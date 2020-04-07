import { Board } from "johnny-five"
const board = new Board()
import { ColorfulOled, DefaultColors } from "./index"

const oled = new ColorfulOled(board, 0, {
    width: 128,
    height: 128,
})

oled.drawPixel(5, 5, DefaultColors.BLUE)
