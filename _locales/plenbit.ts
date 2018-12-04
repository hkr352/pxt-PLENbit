//plenbit.ts

/**
 * Blocks for PLEN:bit
 */
//% weight=100 color=#00A654 icon="\uf085" block="PLEN:bit"

namespace plenbit {

    let Motion_Speed = 15;
    let SERVO_NUM = 0x08;
    let SERVO_SET_INIT = [1000, 630, 300, 600, 240, 600, 1000, 720];
    let SERVO_ANGLE = [1000, 630, 300, 600, 240, 600, 1000, 720];
    let romADR1 = 0x56;
    let init_BLE = false;

    export enum LED_LR{
        右 = 16,
        左 = 8
    }
    export enum LED_onoff{
        オン = 0,
        オフ = 1
    }

    export enum stdMotions {
        左ステップ = 0x00,
        前ステップ = 0x01,
        右ステップ = 0x02,
        えっへん = 0x03,
        おじき = 0x04,
        こくはく = 0x05,
        ハグ = 0x06,
        はくしゅ = 0x07,
        ハイタッチ = 0x08
    }
    export enum boxMotions {
        箱をふる = 0x0a,
        箱を高くとる = 0x0b,
        箱を低くとる = 0x0c,
        箱をうけとる = 0x0d,
        箱をあげる = 0x0e,
        箱をわたす = 0x0f,
        箱をなげる = 0x10,
        箱をおとす = 0x11,
        箱をおく = 0x12
    }
    export enum socMotions {
        左ディフェンス = 0x14,
        ドリブル = 0x15,
        右ディフェンス = 0x16,
        左キック = 0x17,
        ダッシュ = 0x18,
        右キック = 0x19,
        左パス = 0x1a,
        パスちょうだい = 0x1b,
        右パス = 0x1c
    }
    export enum danceMotions {
        ダンス左ステップ = 0x1e,
        ダンス前ステップ = 0x1f,
        ダンス右ステップ = 0x20,
        ダンスポーズ = 0x21,
        ダンスアップダウン = 0x22,
        ダンスくねくね = 0x23,
        ダンス後ろステップ = 0x24,
        ダンスおじぎ = 0x25,
        ダンスツイスト = 0x26
    }
    export enum moveMotions {
        前に進む = 0x46,
        左に回る = 0x47,
        右に回る = 0x48,
        後ろに進む = 0x49,
        腕をパタパタする = 0x29
    }
    secretIncantation();
    setAngle([0, 0, 0, 0, 0, 0, 0, 0], 1000);

    function secretIncantation() {
        write8(0xFE, 0x85)
        write8(0xFA, 0x00)
        write8(0xFB, 0x00)
        write8(0xFC, 0x66)
        write8(0xFD, 0x00)
        write8(0x00, 0x01)
    }

    //% blockId=PLEN:bit_servo
    //% block="サーボモータ %num|番を %degrees|度にする"
    //% num.min=0 num.max=11
    //% degrees.min=0 degrees.max=180
    export function servoWrite(num: number, degrees: number) {
        let HighByte = false;
        let PWMVal = degrees * 100 * 226 / 10000;
        PWMVal = Math.round(PWMVal) + 0x66;
        if (PWMVal > 0xFF) {
            HighByte = true;
        }
        write8(SERVO_NUM + num * 4, PWMVal);
        if (HighByte) {
            write8(SERVO_NUM + num * 4 + 1, 0x01);
        } else {
            write8(SERVO_NUM + num * 4 + 1, 0x00);
        }
    }

    function write8(addr: number, d: number) {
        let cmd = pins.createBuffer(2);
        cmd[0] = addr;
        cmd[1] = d;
        pins.i2cWriteBuffer(0x6A, cmd, false);
    }

    //% blockId=PLEN:bit_motion_std
    //% block="基本モーション %filename|の再生"
    export function std_motion(filename: stdMotions) {
        motion(filename);
    }
    //% blockId=PLEN:bit_motion_Soc
    //% block="サッカーモーション %filename|の再生"
    export function soccer_motion(filename: socMotions) {
        motion(filename);
    }
    //% blockId=PLEN:bit_motion_box
    //% block="ボックスモーション %filename|の再生"
    export function box_motion(filename: boxMotions) {
        motion(filename);
    }
    //% blockId=PLEN:bit_motion_dan
    //% block="ダンスモーション %filename|の再生"
    export function dance_motion(filename: danceMotions) {
        motion(filename);
    }
    //% blockId=PLEN:bit_motion_m
    //% block="動きモーション %filename|の再生"
    export function Move_motion(filename: moveMotions) {
        motion(filename);
    }


    //% blockId=PLEN:bit_motion
    //% block="モーション番号を選んで %filename|再生"
    //% filename.min=0 filename.max=73
    export function motion(filename: number) {
        let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let command = ">";//0x3e
        let list_len = 43;
        let _read_adr = 0x32 + 860 * filename;
        //serial.writeNumber(filename)
        //serial.writeString(",filename")
        //serial.writeNumber(_read_adr)
        //serial.writeString(",adr")


        let error = 0;

        while (1) {
            if (error == 1) {
                break
            }

            let mbuf = reep(_read_adr, list_len);
            _read_adr += list_len;
            if (mbuf[0] == 0xff) {
                break
            }

            let mf = "";    //=null ?
            for (let i = 0; i < list_len; i++) {
                let num_ = mbuf.getNumber(NumberFormat.Int8LE, i);
                mf += numtohex(num_);
            }
            //serial.writeString(",Nonull")
            let _ls_n = 0;   // list_num
            while (list_len > _ls_n) {
                if (command != mf[_ls_n]) {
                    _ls_n += 1;
                    continue
                } //serial.writeString(",>OK")
                _ls_n += 1; // >
                //serial.writeString(mf[_ls_n]);
                //serial.writeString(mf[_ls_n] + 1);
                if ("mf" != (mf[_ls_n] + mf[_ls_n + 1])) {
                    //if (0x4d != (mf[_ls_n])) {
                    _ls_n += 2;
                    continue
                } //serial.writeString(",mfOK")
                _ls_n += 2; // MF

                //if (filename != int((_mf[_ls_n] + _mf[_ls_n + 1]), 16)) {
                if (filename != parseInt_m(mf[_ls_n] + mf[_ls_n + 1])) {
                    error = 1;
                    break
                }
                //serial.writeString(",fileOK")
                _ls_n += 4;// slot,flame

                let times = (mf[_ls_n] + mf[_ls_n + 1] + mf[_ls_n + 2] + mf[_ls_n + 3])
                let time = (parseInt_m(times));
                _ls_n += 4;
                let val = 0;
                while (1) {
                    if ((list_len < (_ls_n + 4)) || (command == mf[_ls_n]) || (24 < val)) {
                        setAngle(data, time);
                        break
                    }
                    let num = (mf[_ls_n] + mf[_ls_n + 1] + mf[_ls_n + 2] + mf[_ls_n + 3]);
                    let num_h = (parseInt_m(num));
                    if (num_h >= 0x7fff) {
                        num_h = num_h - 0x10000;
                    } else {
                        num_h = num_h & 0xffff;
                    }
                    data[val] = num_h;
                    //serial.writeNumber(data[val]);
                    //serial.writeString(",")
                    val = val + 1;
                    _ls_n += 4;
                }
            }
        }
    }

    function hextoint(num: number) {
        let i = 0;
        if (48 <= num && num <= 57) {
            i = num - 48;
        } else if (65 <= num && num <= 70) {
            i = num - 65 + 10;
        } else if (97 <= num && num <= 102) {
            i = num - 97 + 10;
        }
        return i;
    }

    function numtohex(num: number) {
        let i = "";
        if (48 <= num && num <= 57) {
            i = (num - 48).toString();
        } else if (62 <= num && num <= 77) {
            switch (num) {
                case 62:
                    i = ">";
                    break;
                case 65:
                    i = "a";
                    break;
                case 66:
                    i = "b";
                    break;
                case 67:
                    i = "c";
                    break;
                case 68:
                    i = "d";
                    break;
                case 69:
                    i = "e";
                    break;
                case 70:
                    i = "f";
                    break;
                case 77:
                    i = "m";
                    break;
                default:
                    i = "";

            }
        } else if (97 <= num && num <= 102) {
            switch (num) {
                case 97:
                    i = "a";
                    break;
                case 98:
                    i = "b";
                    break;
                case 99:
                    i = "c";
                    break;
                case 100:
                    i = "d";
                    break;
                case 101:
                    i = "e";
                    break;
                case 102:
                    i = "f";
                    break;
                //case 109:
                //    i = "m";
                //    break;
                default:
                    i = "";
            }
        }
        return i;
    }

    export function parseInt_m(str: string) {
        let len = str.length;
        let num = [0, 0, 0, 0];
        for (let i = 0; i < len; i++) {
            switch (str[i]) {
                case "a":
                    num[i] = 10;
                    break;
                case "b":
                    num[i] = 11;
                    break;
                case "c":
                    num[i] = 12;
                    break;
                case "d":
                    num[i] = 13;
                    break;
                case "e":
                    num[i] = 14;
                    break;
                case "f":
                    num[i] = 15;
                    break;
                case "A":
                    num[i] = 10;
                    break;
                case "B":
                    num[i] = 11;
                    break;
                case "C":
                    num[i] = 12;
                    break;
                case "D":
                    num[i] = 13;
                    break;
                case "E":
                    num[i] = 14;
                    break;
                case "F":
                    num[i] = 15;
                    break;
                default:
                    num[i] = parseInt(str[i]);
                    break;
            }
        }
        let hex = 0;
        switch (len) {
            case 4:
                hex = (num[len - 4] * 0x1000);
            case 3:
                hex += (num[len - 3] * 0x0100);
            case 2:
                hex += (num[len - 2] * 0x0010);
            case 1:
                hex += (num[len - 1] * 0x0001);
        }
        //let hex = (num[0] * 0x1000) + (num[1] * 0x0100) + (num[2] * 0x0010) + (num[3] * 0x0001);
        return hex;
    }

    export function bufTostr(mbuf: Buffer) {
        let mf = "";    //=null ?
        for (let i = 0; i < mbuf.length; i++) {
            let num_ = mbuf.getNumber(NumberFormat.Int8LE, i);
            mf += numtohex(num_);
        }
        return mf;
    }

    function setAngle(angle: number[], msec: number) {
        let _step = [0, 0, 0, 0, 0, 0, 0, 0];
        let _msec = msec / Motion_Speed ;//default 10; //speedy 20   Speed Adj
        for (let _val = 0; _val < 8; _val++) {
            let _target = (SERVO_SET_INIT[_val] - angle[_val]);
            if (_target != SERVO_ANGLE[_val]) {  // Target != Present
                _step[_val] = (_target - SERVO_ANGLE[_val]) / (_msec);
            }
        }
        for (let i = 0; i <= _msec; i++) {
            for (let _val = 0; _val < 8; _val++) {
                SERVO_ANGLE[_val] += _step[_val];
                servoWrite(_val, (SERVO_ANGLE[_val] / 10));
            }
            //basic.pause(1); //Nakutei yoi
        }
    }

    // blockId=PLEN:bit_reep
    // block="ReadEEPROM %eepAdr| byte%num"
    // eepAdr.min=910 eepAdr.max=2000
    // num.min=0 num.max=43
    export function reep(eepAdr: number, num: number) {
        let _data = pins.createBuffer(2);
        _data[0] = eepAdr >> 8;
        _data[1] = eepAdr & 0xFF;
        // need adr change code
        pins.i2cWriteBuffer(romADR1, _data)
        let value = (pins.i2cReadBuffer(romADR1, num, false));
        return value
    }

    function BLE_init() {
        serial.redirect(SerialPin.P8, SerialPin.P12, 115200);
        pins.digitalWritePin(DigitalPin.P16, 0);
        init_BLE = true;
    }

    //% blockId=PLEN:bit_BLE
    //% block="スマホからコントロールできるようにする"
    export function serialread() {
        if (init_BLE == false) BLE_init();
        pins.digitalWritePin(DigitalPin.P16, 1);
        while (1) {
            let buf = serial.readString();
            if ((buf[0] != "$") && (buf[0] != "#")) {
                break
            }
            let _buf = buf[1] + buf[2];
            if (_buf == "PM") {
                _buf = buf[3] + buf[4];
                //basic.showString(_buf);
                motion(parseInt_m(_buf));
                break
            } else if (_buf == "SM") {
                break
            } else {
                //display.show("b")
                break
            }
        }
        pins.digitalWritePin(DigitalPin.P16, 0);
    }
    
    //% blockId=PLEN:bit_eye
    //% block="%LR|目のLEDを %onoff|にする"
    export function eyeLed(led_lr:LED_LR, led_onoff:LED_onoff) {
        if (led_lr == 8){
            pins.digitalWritePin(DigitalPin.P8, led_onoff);
        } 
        if (led_lr == 16) {
            pins.digitalWritePin(DigitalPin.P16, led_onoff);
        //23 or 15
        }
    }
    /**
     * This is no test.
    **/
    //% blockId=PLEN:bit_Sensor
    //% block="センサー%num|の値を読み取る"
    export function sensorLR(num: LED_LR) {
        let neko = 0;
        if(num = 16){
            neko = AnalogPin.P2;
        }else{
            neko = AnalogPin.P0;
        }
        return pins.analogReadPin(neko);
    }

}