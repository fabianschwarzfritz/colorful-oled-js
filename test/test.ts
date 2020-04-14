import { Board } from "johnny-five"
import { ColorfulOled } from "./../index"

var sinon = require('sinon');

describe('Colorful Oled', function() {
    it('#constructor initializes display', function() {
        const board = sinon.mock(Board);
        board.io = sinon.mock();
        board.io.i2cWrite = sinon.spy();
        const oled = new ColorfulOled(board,  10, {});
        sinon.assert.calledWith(board.io.i2cWrite, 10, [0x00, 0xAE]);
    });
});