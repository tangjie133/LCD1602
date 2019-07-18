enum clear {
    //%block="第一行"
    back1 = 1,
    //%block="第二行"
    block2 = 2,
    //%block="全屏"
    block3 = 3
}
let j: number = 0;
let i: number
//% weight=100 color=#0020ff 
namespace I2C_LCD1602_RGB {
    let i2cAddr = 0x3E;

    let buf: number[] = [];


    export function LcdInit() {
        i2cAddr = 0x3e;
        basic.pause(50);
        cmd(0x28);      // set 4bit mode
        basic.pause(5);
        cmd(0x28);      // set 4bit mode
        basic.pause(1);
        cmd(0x0c);
        //cmd(0x01);// clear wait more then 2ms
        cmd(0x06);
        basic.pause(5);

        Reg(0x00, 0x00);
        Reg(0x08, 0xff);
        Reg(0x01, 0x20);
        //setRGB(252, 255, 255);
    }

    //在液晶的指定位置显示数字

    //%  block="显示 数字 %n|位置 x %x|y %y"
    //% weight=90 
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowNumber(n: number, x: number, y: number): void {
        if (j == 0) {
            j = 1;
            LcdInit();
            setRGB(252, 255, 255);
        }
        ShowString(n.toString(), x, y);
    }

    //在液晶的指定位置显示字符串

    //%  block="显示 字符串 %s|位置 x %x|y %y"
    //% weight=90 
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowString(s: string, x: number, y: number): void {
        if (j == 0) {
            j = 1;
            LcdInit();
            setRGB(252, 255, 255);
        }
        setCursor(x, y);
        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i));
        }
    }
    //清屏处理
    //%block="清除LCD |%c 内容"
    //%weight=40
    export function clear(c: clear): void {
        serial.writeNumber(c)
        if (c == 1) {
            for (i = 0; i <= 15; i++)
                String(" ", i, 0);
        }
        if (c == 2) {
            for (i = 0; i <= 15; i++)
                String(" ", i, 1);
        }
        if (c == 3) {
            cmd(0x01);
        }
    }
    //清除特定位置内容
    //%weight=30
    //%block="清除LCD第 |%y行 第|%s位 到 |%x位内容"
    //%y.min=0 y.max=1
    //%s.min=0 s.max=15
    //%x.min=0 x.max=15
    export function clear1(y: number, s: number, x: number): void {
        let t: number
        t = x - s
        for (i = 0; i <= t; i++) {

            String(" ", s, y);
            s = s + 1;
        }
    }

    //通过RGB修改颜色
    //% weight=70
    //% R.min=0 R.max=255
    //% G.min=0 G.max=255
    //% B.min=0 B.max=255
    //%block="红 %R| 绿 %G| 蓝 %B"
    export function RGB(R: number, G: number, B: number): number {
        return (R << 16) + (G << 8) + (B);
    }
    //设置显示屏背景颜色颜色
    //%weight=60
    //% rgb.shadow="colorNumberPicker"
    //% block="设置背景颜色 |%rgb"
    export function showColor(rgb: number): void {
        LcdInit();
        j = 1;
        let _brightness = 255;
        let r = (rgb >> 16) * (_brightness / 255);
        let g = ((rgb >> 8) & 0xFF) * (_brightness / 255);
        let b = ((rgb) & 0xFF) * (_brightness / 255);
        setRGB(r, g, b);
    }

    // 设置光标位置
    function setCursor(col: number, row: number) {
        col = (row == 0 ? col | 0x80 : col | 0xc0);
        cmd(col);
    }
    // send command
    function cmd(d: number) {
        buf = [0x80, d];
        let cmd = pins.createBufferFromArray(buf);
        pins.i2cWriteBuffer(i2cAddr, cmd);
        basic.pause(1);
    }
    // send data
    function dat(d: number) {
        buf = [0x40, d];
        let dat = pins.createBufferFromArray(buf);
        pins.i2cWriteBuffer(i2cAddr, dat);
        basic.pause(1);
    }
    //send RGB
    function Reg(d: number, n: number) {
        buf = [d, n];
        let lcd = pins.createBufferFromArray(buf);
        let i2cAddr_lcd = 0x60;
        pins.i2cWriteBuffer(i2cAddr_lcd, lcd);
        basic.pause(10);
    }

    function setRGB(r: number, g: number, b: number) {
        Reg(0x04, r);
        Reg(0x03, g);
        Reg(0x02, b);
        //basic.pause(1);
    }


    function String(s: string, x: number, y: number): void {
        setCursor(x, y);
        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i));
        }
    }
}