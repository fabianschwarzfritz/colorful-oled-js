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

enum DefaultColors {
    RED = 0xF00,
    GREEN = 0x0F0,
    BLUE = 0x00F,
}

class ColorfulOled {
    private readonly board: Board
    private readonly ADDRESS: number

    public constructor(board: Board, address: number) {
        this.board = board
        this.ADDRESS = address
    }

    private _transfer(type: TransferType, transferValue: number): void {
        this.board.io.i2cWrite(this.ADDRESS, [type, transferValue])
    }

    private _read(fn: (data: number) => void): void {
        this.board.io.i2cReadOnce(this.ADDRESS, 1, (data: number) => {
            fn(data)
        })
    }

    public turnOffDisplay (): void {
        this._transfer(TransferType.Command, Command.SET_DISPLAY_OFF)
    }

    public turnOnDisplay (): void {
        this._transfer(TransferType.Command, Command.SET_DISPLAY_ON_NORMAL_MODE)
    }
}