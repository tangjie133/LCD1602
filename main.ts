//LCD_I2C地址
enum i2cAddr {
    //% block="0x3e"
    addr1 = 0x3e,
    //% block="0x3f"
    addr2 = 0x3f,
    //% block="0x20"
    addr3 = 0x20,
    //% block="0x62"
    addr4 = 0x62,
    //% block="0x27"
    addr5 = 0x27
}

//% weight=100 color=#0020ff 
namespace I2C_LCD1602_RGB {
    let i2cAddr = 0x3E;
    let buf: number[] = [];
    //% block="初始化RGB液晶的I2C地址|%addr"
    //% weight=100 
    export function LcdInit(addr: i2cAddr) {
        i2cAddr = addr;
        basic.pause(50);
        cmd(0x28);      // set 4bit mode
        basic.pause(5);
        cmd(0x28);      // set 4bit mode
        basic.pause(1);
        cmd(0x0c);
        cmd(0x01);// clear wait more then 2ms
        cmd(0x06);
        basic.pause(5);

        Reg(0x00, 0x00);
        Reg(0x08, 0xff);
        Reg(0x01, 0x20);
        setRGB(252, 255, 255);
    }

    //在液晶的指定位置显示数字

    //%  block="显示 数字 %n|位置 x %x|y %y"
    //% weight=90 
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString();
        ShowString(s, x, y);
    }

    //在液晶的指定位置显示字符串

    //%  block="显示 字符串 %s|位置 x %x|y %y"
    //% weight=90 
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowString(s: string, x: number, y: number): void {
        setCursor(x, y);
        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i));
        }
    }


    //清除液晶上显示的内容

    //%  block="清除液晶显示内容"
    //% weight=50
    export function clear(): void {
        cmd(0x01);
        basic.pause(5);
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
    export function showColor(rgb: number) {
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

}