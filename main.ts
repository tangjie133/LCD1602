/**
* makecode I2C LCD1602 package for microbit.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

/**
 * Custom blocks   icon="▀"
 */
//% weight=20 color=#0fbc11 
namespace I2C_LCD1602 {
    let i2cAddr: number // 0x3F: PCF8574A, 0x27: PCF8574
    let BK: number      // backlight control
    let RS: number      // command/data

    let showfunction: number
    let showcontrol: number
    let showmode: number
    //向I2c写数据
    function setreg(d: number) {

        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(5)
    }
    // send data to I2C bus
    function set(d: number) {
        i2cAddr=0X3E
        setreg(d)
    }

    // send command
    function cmd(d: number) {
        i2cAddr = 0X3E
        setreg(0x80)
        setreg(d)
    }

    // send data
    function sen(d: number) {
        set(d)
        set(d << 4)
    }

    //send Reg
    function Reg(d: number, n: number) {
        i2cAddr = 0X70
        setreg(d)
        setreg(n)
    }

    //send RGB
    function setRGB(r: number, g: number, b: number) {
        Reg(0x04, r)
        Reg(0x03, g)
        Reg(0x02, b)
    }

    function dispiay() {
        showcontrol |= 0x04
        cmd(showcontrol | 0x08)
    }

    function setColrWhite() {
        setRGB(255, 255, 255)
    }

    // send begin
    function begin(d: number, n: number, b: number) {
        if (n > 1) {
            showfunction = 0x08
        }
        let numline = n
        let currline = 0
        if ((b !== 0) && (n == 1)) {
            showfunction = 0x04
        }
        basic.pause(50)
        cmd(0x20 | showfunction)
        basic.pause(5)
        cmd(0x20 | showfunction)
        basic.pause(5)
        cmd(0x20 | showfunction)
        basic.pause(5)
        showcontrol = 0x04
        dispiay()
        basic.pause(5)
        clear()

        showmode = 0x02
        cmd(0x04 | showmode)
        Reg(0x00, 0)
        Reg(0x08, 0xff)
        Reg(0x01, 0x20)
        setColrWhite()
    }
    /*
    // auto get LCD address
    function AutoAddr() {
        let k = true
        let addr = 0x20
        let d1 = 0, d2 = 0
        while (k && (addr < 0x28)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr

        addr = 0x38
        while (k && (addr < 0x40)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr
        else return 0

    }
*/
    /**
     * initial LCD, set I2C address. Address is 39/63 for PCF8574/PCF8574A
     * @param Addr is i2c address for LCD, eg: 0, 39, 63. 0 is auto find address
     */
    //% blockId="I2C_LCD1620_SET_ADDRESS" block="LCD initializeshow "
    //% weight=100 blockGap=8
    //% c.min=1 c.max=16
    //% r.min=1 r.max=2
    export function LcdInit() {
        showfunction = 0x00
        begin(16, 2, 0x00)

    }

    /**
     * show a number in LCD at given position
     * @param n is number will be show, eg: 10, 100, 200
     * @param x is LCD column position, eg: 0
     * @param y is LCD row position, eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_NUMBER" block="show number %n|at x %x| y %y"
    //% weight=90 blockGap=8
    //% x.min=1 x.max=16
    //% y.min=1 y.max=2
    //% parts=LCD1602_I2C trackArgs=0
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        ShowString(s, x, y)
    }

    /**
     * show a string in LCD at given position
     * @param s is string will be show, eg: "Hello"
     * @param x is LCD column position, [0 - 15], eg: 0
     * @param y is LCD row position, [0 - 1], eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_STRING" block="show string %s|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1602_I2C trackArgs=0
    export function ShowString(s: string, x: number, y: number): void {
        let a: number

        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        cmd(a)

        for (let i = 0; i < s.length; i++) {
            sen(s.charCodeAt(i))
        }
    }

    /**
     * turn on LCD
     */
    //% blockId="I2C_LCD1620_ON" block="turn on LCD"
    //% weight=81 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function on(): void {
        cmd(0x0C)
    }

    /**
     * turn off LCD
     */
    //% blockId="I2C_LCD1620_OFF" block="turn off LCD"
    //% weight=80 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function off(): void {
        cmd(0x08)
    }

    /**
     * clear all display content
     */
    //% blockId="I2C_LCD1620_CLEAR" block="clear LCD"
    //% weight=85 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function clear(): void {
        cmd(0x01)
        basic.pause(2000)
    }

    /**
     * turn on LCD backlight
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_ON" block="turn on backlight"
    //% weight=71 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function BacklightOn(): void {
        BK = 8
        cmd(0)
    }

    /**
     * turn off LCD backlight
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_OFF" block="turn off backlight"
    //% weight=70 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function BacklightOff(): void {
        BK = 0
        cmd(0)
    }

}