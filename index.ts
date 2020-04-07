import { Board, Pin } from "johnny-five"

enum TransferType {
    Command = 0x00, 
    Data = 0x40
}

enum Command {
    SET_COLUMN_START_ADDRESS = 0x15,
    SET_COLUMN_END_ADDRESS = 0x15,
    SET_ROW_START_ADDRESS = 0x75 ,
    SET_ROW_END_ADDRESS = 0x75,
    SET_CONTRAST_COLOR_A = 0x81,
    SET_CONTRAST_COLOR_B = 0x82,
    SET_CONTRAST_COLOR_C = 0x83,
    MASTER_CURRENT_CONTROL = 0x87,
    SET_SECOND_PRE_CHARGE_SPEED_A = 0x8A,
    SET_SECOND_PRE_CHARGE_SPEED_B = 0x8B,
    SET_SECOND_PRE_CHARGE_SPEED_C = 0x8C,
    REMAP_AND_COLOR_DEPTH = 0xA0,
    SET_DISPLAY_START_LINE = 0xA1,
    SET_DISPLAY_OFFSET = 0xA2,
    SET_DISPLAY_MODE_NORMAL = 0xA4,
    SET_DISPLAY_MODE_ENTIRE_ON = 0xA5,
    SET_DISPLAY_MODE_ENTIRE_OFF = 0xA6,
    SET_DISPLAY_MODE_INVERSE = 0xA7,
    SET_MULTIPLEX_RATIO = 0xA8,
    DIM_MODE = 0xAB,
    SET_MASTER_CONFIGURATION = 0xAD,
    SET_DISPLAY_ON_DIM_MODE = 0xAC,
    SET_DISPLAY_OFF = 0xAE,
    SET_DISPLAY_ON_NORMAL_MODE = 0xAF,
    POWER_SAVE_MODE = 0xB0,
    PHASE_PERIOD_ADJUSTMENT = 0xB1,
    DISPLAY_CLOCK_DIVIDER = 0xB3,
    SET_GRAYSCALE_TABLE = 0xB8,
    ENABLE_LINEAR_GRAYSCALE_TABLE = 0xB9,
    SET_PRECHARGE_LEVEL = 0xBB,
    NO_OPERATION_1 = 0xBC,
    NO_OPERATION_2 = 0xBD,
    SET_VOLTAGE = 0xBE,
    NO_OPERATION_3 = 0xE3,
    SET_COMMAND_LOCK = 0xFD,
    DRAW_LINE = 0x21,
    DRAW_RECTANGLE = 0x22,
    COPY = 0x23,
    DIM_WINDOW = 0x24,
    CLEAR_WINDOW = 0x25,
    FILL_ENABLE_DISABLE = 0x26,
    CONTINUOUS_SCROLLING = 0x27,
    DEACTIVATE_SCROLLING = 0x2E,
    ACTIVATE_SCROLLING = 0x2F,
}

export enum DefaultColors {
    RED = 0xF00,
    GREEN = 0x0F0,
    BLUE = 0x00F,
}

interface Options {
    width: number;
    height: number;
}

export class ColorfulOled {
    private readonly board: Board
    private readonly ADDRESS: number
    private readonly WIDTH: number
    private readonly HEIGHT: number

    public constructor(board: Board, address: number, options: Options) {
        this.board = board
        this.ADDRESS = address
        this.WIDTH = options.width || 128
        this.HEIGHT = options.height || 128
        this._initialize()
    }

    private _initialize() {
        // TODO check initalization routine when hardware has arrived.
        // Routine template: https://github.com/Seeed-Studio/RGB_OLED_SSD1331/blob/master/SSD1331.cpp
        this._transferCommand(Command.SET_DISPLAY_OFF)
        this._transferCommand(Command.SET_CONTRAST_COLOR_A, 0x91)
        this._transferCommand(Command.SET_CONTRAST_COLOR_B, 0x50)
        this._transferCommand(Command.SET_CONTRAST_COLOR_C, 0x7D)
        this._transferCommand(Command.MASTER_CURRENT_CONTROL, 0x06)
        this._transferCommand(Command.SET_SECOND_PRE_CHARGE_SPEED_A, 0x64)
        this._transferCommand(Command.SET_SECOND_PRE_CHARGE_SPEED_B, 0x78)
        this._transferCommand(Command.SET_SECOND_PRE_CHARGE_SPEED_C, 0x64)
        this._transferCommand(Command.REMAP_AND_COLOR_DEPTH, 0x72)
        this._transferCommand(Command.SET_DISPLAY_START_LINE, 0x0)
        this._transferCommand(Command.SET_DISPLAY_OFFSET, 0x0)
        this._transferCommand(Command.SET_DISPLAY_MODE_NORMAL)
        this._transferCommand(Command.SET_MULTIPLEX_RATIO, 0x3F)
        this._transferCommand(Command.SET_MASTER_CONFIGURATION, 0x8E)
        this._transferCommand(Command.POWER_SAVE_MODE, 0x00)
        this._transferCommand(Command.PHASE_PERIOD_ADJUSTMENT, 0x31)
        this._transferCommand(Command.DISPLAY_CLOCK_DIVIDER, 0xF0)
        this._transferCommand(Command.SET_PRECHARGE_LEVEL, 0x3A)
        this._transferCommand(Command.SET_VOLTAGE, 0x3E)
        this._transferCommand(Command.DEACTIVATE_SCROLLING)
        this._transferCommand(Command.SET_DISPLAY_ON_NORMAL_MODE)
    }

    private _transferCommand(command: number, value?: number) {
        this._transfer(TransferType.Command, command);
        if(value) {
            this._transfer(TransferType.Command, value);
        }
    }

    private _transferData(value: number) {
        this._transfer(TransferType.Data, value);
    }

    private _transfer(type: TransferType, transferValue: number): void {
        this.board.io.i2cWrite(this.ADDRESS, [type, transferValue])
    }

    private _read(fn: (data: number) => void): void {
        this.board.io.i2cReadOnce(this.ADDRESS, 1, (data: number) => {
            fn(data)
        })
    }

    public drawPixel(x: number,  y: number, color: DefaultColors): void {
        if (x < 0 || this.WIDTH <= x  || y < 0 || this.HEIGHT <= y) {
            throw new Error("Invalid x or y position")
        }
        this._transferCommand(Command.SET_COLUMN_START_ADDRESS, x);
        this._transferCommand(Command.SET_ROW_START_ADDRESS, y);
        this._transferData(color);
    }

    public turnOffDisplay(): void {
        this._transferCommand(Command.SET_DISPLAY_OFF)
    }

    public turnOnDisplay(): void {
        this._transferCommand(Command.SET_DISPLAY_ON_NORMAL_MODE)
    }
}
