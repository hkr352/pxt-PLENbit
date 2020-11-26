//plenbit.ts

/**
 * Blocks for PLEN:bit
 */
//% weight=100 color=#00A654 icon="\uf085" block="PLEN:bit"
namespace plenbit {
    export enum LedLr {
        //% block="A button"
        AButtonSide = 8,
        //% block="B button"
        BButtonSide = 16
    }

    export enum LedOnOff {
        //% block="on"
        On = 0,
        //% block="off"
        Off = 1
    }

    export enum StdMotions {
        //% block="Walk Forward"
        WalkForward = 0x46,
        //% block="Walk Left Turn"
        WalkLTurn = 0x47,
        //% block="Walk Right Turn"
        WalkRTurn = 0x48,
        //% block="Walk Back"
        WalkBack = 0x49,
        //% block="Left step"
        LStep = 0x00,
        //% block="Forward step"
        FStep = 0x01,
        //% block="Right step"
        RStep = 0x02,
        //% block="A hem"
        AHem = 0x03,
        //% block="Bow"
        Bow = 0x04,
        //% block="Propose"
        Propose = 0x05,
        //% block="Hug"
        Hug = 0x06,
        //% block="Clap"
        Clap = 0x07,
        //% block="Highfive"
        HighFive = 0x08,
        //% block="Arm PataPata"
        ArmPataPata = 0x29
    }

    export enum BoxMotions {
        //% block="Shake A Box"
        ShakeABox = 0x0a,
        //% block="Pick Up High"
        PickUpHigh = 0x0b,
        //% block="Pick Up Low"
        PickUpLow = 0x0c,
        //% block="Receive a Box"
        ReceiveaBox = 0x0d,
        //% block="Present a Box"
        PresentaBox = 0x0e,
        //% block="Pass a Box"
        PassaBox = 0x0f,
        //% block="Throw a Box"
        ThrowaBox = 0x10,
        //% block="Put Down High"
        PutDownHigh = 0x11,
        //% block="Put Down Low"
        PutDownLow = 0x12,
        //% block="Carry For ward"
        CarryForward = 0x2A,
        //% block="Carry L Turn"
        CarryLTurn = 0x2B,
        //% block="Carry R Turn"
        CarryRTurn = 0x2c,
        //% block="Carry Back"
        CarryBack = 0x2d
    }

    export enum SocMotions {
        //% block="Defense Left Step"
        DefenseLStep = 0x14,
        //% block="Dribble"
        Dribble = 0x15,
        //% block="Defense Right Step"
        DefenseRStep = 0x16,
        //% block="Left Kick"
        LKick = 0x17,
        //% block="Long Dribble"
        LongDribble = 0x18,
        //% block="Right Kick"
        RKick = 0x19,
        //% block="Pass To Left"
        PassToLeft = 0x1a,
        //% block="Pass It To Me"
        PassItToMe = 0x1b,
        //% block="Pass To Right"
        PassToRight = 0x1c
    }

    export enum DanceMotions {
        //% block="Dance Left Step"
        DanceLStep = 0x1e,
        //% block="Dance Forward Step"
        DanceFStep = 0x1f,
        //% block="Dance Right Step"
        DanceRStep = 0x20,
        //% block="Dance Fisnish Pose"
        DanceFisnishPose = 0x21,
        //% block="Dance Up Down"
        DanceUpDown = 0x22,
        //% block="Wiggle Dance"
        WiggleDance = 0x23,
        //% block="Dance Back Step"
        DanceBStep = 0x24,
        //% block="Dance Bow"
        DanceBow = 0x25,
        //% block="Twist Dance"
        TwistDance = 0x26
    }
    enum MoveMotions {}

    export enum WalkMode {
        //% block="move"
        Move = 1,
        //% block="stop"
        Stop = 0
    }

    export let motionSpeed = 20;// update 11/26
    //[1000, 900, 300, 900, 800, 900, 1500, 900];good angle
    export let servoSetInit = [1000, 630, 300, 600, 240, 600, 1000, 720];
    let servoAngle = [1000, 630, 300, 600, 240, 600, 1000, 720];
    let SERVO_NUM_USED = 8;
    let romAdr1 = 0x56;
    let initBle:boolean = false;
    let initPCA9865:boolean = false;
    let plenDebug :boolean = false;
    let plenStrip: neopixel.Strip = null// update 11/26
    let plenEyeCreated = false;// update 11/26
    loadPos();
    eyeLed(LedOnOff.On);

    //% block="PLEN Eye"
    // weight=0
    //% blockSetVariable=plenStrip
    //% advanced=true
    export function createPlenEye():neopixel.Strip{
        plenStrip = neopixel.create(DigitalPin.P16, 2, NeoPixelMode.RGB_RGB)
        plenStrip.setBrightness(50)
        plenEyeCreated = true;
        return plenStrip;
    }// update 11/26

    //% block
    //% weight=99
    export function setColor(color: NeoPixelColors, wait:number)
    {
      if(!plenEyeCreated)createPlenEye();
      plenStrip.showColor(neopixel.colors(color))
      basic.pause(wait);
    }// update 11/26

    //% block
    // weight=98
    //% advanced=true
    export function clearPlenEye(): void {
        plenStrip.clear();
    }// update 11/26
    
    /**
     * Eye LED
     * @param ledOnOff 
     */
    //% block="eye led is %onoff"
    //% weight=100
    export function eyeLed(ledOnOff: LedOnOff) {
        if(plenEyeCreated)clearPlenEye();
        pins.digitalWritePin(DigitalPin.P8, ledOnOff);
        pins.digitalWritePin(DigitalPin.P16, ledOnOff);
    }

    export function secretIncantation() {
        write8(0xFE, 0x85);//PRE_SCALE
        write8(0xFA, 0x00);//ALL_LED_ON_L
        write8(0xFB, 0x00);//ALL_LED_ON_H
        write8(0xFC, 0x66);//ALL_LED_OFF_L
        write8(0xFD, 0x00);//ALL_LED_OFF_H
        write8(0x00, 0x01);
    }

    //% blockId=PLEN:bit_Sensor
    //% block="read sensor %num"
    //% weight=76
    export function sensorLR(num: LedLr) {
        return pins.analogReadPin( (num == 16) ? AnalogPin.P2 : AnalogPin.P0 );
    }

    /**
     * Make this block insert "on start", when using checkMic. Use by substitution to a variable.
     * @param num - plenbit.LedLr.AButtonSide or BButtonSide 
    */
    //% block="Init Mic %num"
    //% weight=77
    export function initMic(num: LedLr){
        let cal = 0;
        for (let i = 0; i < 100; i++) {
            cal += pins.analogReadPin( (num == 16) ? AnalogPin.P2 : AnalogPin.P0 )
        }
        return cal = cal / 100
    }

    /**
     * Check mic
     * @param num - pins
     * @param value - Threshold , Max: 1023 - 'Standard Value'
     * @param adjust - Standard value
     */
    // Threshold "しきい値"
    //% block="Side %num, Mic Value %value, InitValue $adjust"
    //% value.min=0 value.max=511 value.defl=100
    //% adjust.min=0 adjust.max=1023 adjust.defl=550
    //% weight=78
    export function checkMic(num: LedLr,value:number,adjust:number){
        let n = (num == 16) ? AnalogPin.P2 : AnalogPin.P0;
        return ( pins.analogReadPin(n) <= (adjust-value) || (adjust+value) <= pins.analogReadPin(n) ) ? true:false;
    }

    /**
     * Check distance
     * @param num - pins
     * @param value - Threshold
     */
    //% block="Side %num, Distance Value %value"
    //% value.min=22 value.max=700 value.defl=600
    //% weight=79
    export function checkDistane(num: LedLr,value:number){
        let n = (num == 16) ? AnalogPin.P2 : AnalogPin.P0;
        return ( value <= pins.analogReadPin(n) ) ? true:false;
    }

    //% blockId=PLEN:bit_Mic
    //% block="read Mic %num is If (Mic <= %low OR %up <= Mic)"
    //% advanced=true
    export function readMic(num: LedLr,low: number,up: number){
        let n = (num == 16) ? AnalogPin.P2 : AnalogPin.P0;
        return ( pins.analogReadPin(n) <= low || up <= pins.analogReadPin(n) ) ? true:false;
    }

    /**
     * Get the angle in the direction that "PLEN: bit" is facing
     */
    //% block
    //% weight=75
    export function direction() {
        return Math.atan2(input.magneticForce(Dimension.X), input.magneticForce(Dimension.Z)) * 180 / 3.14 + 180
    }

    /**
     * Change the speed of the motion.
     * @param speed - 0 ~ 50, The larger this value, the faster.
     */
    //% block="Motion Speed %speed"
    //% speed.min=0 speed.max=50 speed.defl=20
    //% advanced=true
    export function changeMotionSpeed(speed: number) {
        if(0 <= speed && speed <= 50){motionSpeed = speed;}
        if(speed <= 0){motionSpeed = 0;}
        if(speed >= 50){motionSpeed = 50;}
    }// update 11/26

    //% blockId=PLEN:bit_servo
    //% block="servo motor %num|number %degrees|degrees"
    //% num.min=0 num.max=11
    //% degrees.min=0 degrees.max=180
    //% weight=84
    export function servoWrite(num: number, degrees: number) {
        let servoNum = 0x08;
        if (initPCA9865 == false) {
            secretIncantation();
            initPCA9865 = true;
        }
        let highByte = false;
        let pwmVal = degrees * 100 * 226 / 10000;
        pwmVal = Math.round(pwmVal) + 0x66;
        if (pwmVal > 0xFF) {
            highByte = true;
        }
        write8(servoNum + num * 4, pwmVal);
        if (highByte) {
            write8(servoNum + num * 4 + 1, 0x01);
        } else {
            write8(servoNum + num * 4 + 1, 0x00);
        }
    }

    export function write8(addr: number, d: number) {
        let cmd = pins.createBuffer(2);
        cmd[0] = addr;
        cmd[1] = d;
        pins.i2cWriteBuffer(0x6A, cmd, false);
    }

    //% blockId=PLEN:bit_motion_std
    //% block="play std motion %fileName"
    //% weight=90
    export function stdMotion(fileName: StdMotions) {
        motion(fileName);
    }
    //% blockId=PLEN:bit_motion_Soc
    //% block="play soccer motion %fileName"
    //% weight=89
    export function soccerMotion(fileName: SocMotions) {
        motion(fileName);
    }
    //% blockId=PLEN:bit_motion_box
    //% block="play box motion %fileName"
    //% advanced=true
    export function boxMotion(fileName: BoxMotions) {
        motion(fileName);
    }
    //% blockId=PLEN:bit_motion_dan
    //% block="play dance motion %fileName"
    //% weight=88
    export function danceMotion(fileName: DanceMotions) {
        motion(fileName);
    }
    // blockId=PLEN:bit_motion_m
    // block="play move motion %fileName"
    export function moveMotion(fileName: MoveMotions) {
        motion(fileName);
    }

    let modeNum=0;
    //% blockId=PLEN:bit_walk
    //% block="walk %mode"
    //% weight=85
    export function walk(mode: WalkMode){
        
        if(mode == 1){
            if(modeNum == 0){
                modeNum = 0;
            }else if(modeNum == 100){
                modeNum = 0;
            }
        }else{
            if(modeNum == 1){
                modeNum = 2;
            }else{
                modeNum = 100;
            }
        }
        switch(modeNum){
            case 0:
                motionFlame(StdMotions.WalkForward, 0);
                motionFlame(StdMotions.WalkForward, 1);
                modeNum = 1;
                //break;
            case 1:
                motionFlame(StdMotions.WalkForward, 2);
                motionFlame(StdMotions.WalkForward, 3);
                motionFlame(StdMotions.WalkForward, 4);
                motionFlame(StdMotions.WalkForward, 5);
                motionFlame(StdMotions.WalkForward, 6);
                motionFlame(StdMotions.WalkForward, 7);
                break;
            case 2:
                motionFlame(StdMotions.WalkForward, 8);
                motionFlame(StdMotions.WalkForward, 9);
                modeNum = 0;
                break;
            default:
                break;
        }
    }

    //% blockId=PLEN:bit_motion
    //% block="play motion number %fileName"
    //% fileName.min=0 fileName.max=73
    //% advanced=true
    export function motion(fileName: number ) {
        doMotion(fileName,0xff);
    }

    // block="play motion number %fileName number%flameNum"
    function motionFlame(fileName: number, flameNum: number) {
        doMotion(fileName,flameNum);
    }

    function doMotion(fileName: number, flameNum: number)
    {
        let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let command = 0x3e;//">"
        let listLen = 43;
        let loopBool = false;
        let plenDebug :boolean = false;
        if(flameNum == 0xff){
            flameNum = 0;
            loopBool = true;
        }
        let readAdr =  0x32 + 860 * fileName + flameNum * listLen;
        //serial.writeNumber(fileName)
        //serial.writeString(",fileName")
        //serial.writeNumber(readAdr)
        //serial.writeString(",adr")
        let error = 0;
        while (1) 
        {
            let mBuf = reep(readAdr, listLen);
            readAdr += listLen;
            if (mBuf[0] == 0xff) break;
            let mf = "";    //=null ?
            let listNum = 0;
            if(command != mBuf[listNum])break;
            if(plenDebug)serial.writeString(",>OK");
            listNum += 1; // >
            if ( 0x4d46 != ( mBuf[listNum] << 8 | mBuf[listNum + 1] ) )break;
            if(plenDebug)serial.writeString(",mfOK");
            listNum += 2; // MF
            if ( fileName != ( num2Hex(mBuf[listNum]) << 4 | num2Hex(mBuf[listNum + 1]) ) )break;
            if(plenDebug)serial.writeString(",fileOK");
            listNum += 4;// slot,flame
            let time = num2Hex(mBuf[listNum])<<12 | num2Hex(mBuf[listNum+1])<<8 | num2Hex(mBuf[listNum+2])<<4 | num2Hex(mBuf[listNum+3]);
            listNum += 4;
            for (let val = 0; val < SERVO_NUM_USED; val++)
            {
                let numHex = num2Hex(mBuf[listNum])<<12 | num2Hex(mBuf[listNum+1])<<8 | num2Hex(mBuf[listNum+2])<<4 | num2Hex(mBuf[listNum+3]);
                if (numHex >= 0x7fff)
                {
                    numHex = numHex - 0x10000;
                } else {
                    numHex = numHex & 0xffff;
                }
                data[val] = numHex;
                if(plenDebug)serial.writeNumber(data[val]);
                listNum += 4;
            }
            setAngle(data, time);
            if(!loopBool)break;
        }
    }

    /**
     * Eight servos can be controlled at once
     * @param angle 8 arrays
     * @param msec 100 ~ 1000
     */
    //% block="Set Angle $angle, msec %msec"
    //% msec.min=100 msec.max=1000 msec.defl=500
    //% advanced=true
    export function setAngle(angle: number[], msec: number) {
        let step = [0, 0, 0, 0, 0, 0, 0, 0];
        msec = msec / motionSpeed;//now 20 //default 10; //speedy 30
        for (let val = 0; val < SERVO_NUM_USED; val++) {
            let target = (servoSetInit[val] - angle[val]);
            if (target != servoAngle[val]) {  // Target != Present
                step[val] = (target - servoAngle[val]) / (msec);
            }
        }
        for (let i = 0; i <= msec; i++)
        {
            let nowTime = input.runningTime();
            for (let val = 0; val < SERVO_NUM_USED; val++) {
                servoAngle[val] += step[val];
                servoWrite(val, (servoAngle[val] / 10));
            }// 1 loop: v1 10~17ms, v2 6~10ms

            nowTime = input.runningTime() - nowTime;
            if( (nowTime) < 17 ) {
                basic.pause(17 - nowTime);
            }
        }
    }// update 11/26

    function num2Hex(num: number) {
        let i:number = 0;
        if (48 <= num && num <= 57) {
            i = (num - 48);
        } else if (62 <= num && num <= 77) {
            switch (num) {
                //case 62: i = 0x3e; break;
                case 65: i = 0x0a; break;
                case 66: i = 0x0b; break;
                case 67: i = 0x0c; break;
                case 68: i = 0x0d; break;
                case 69: i = 0x0e; break;
                case 70: i = 0x0f; break;
                //case 77: i = 0x4d; break;
                default: i = 0;break;
            }
        } else if (97 <= num && num <= 102) {
            switch (num) {
                case 97: i = 0x0a; break;
                case 98: i = 0x0b; break;
                case 99: i = 0x0c; break;
                case 100: i = 0x0d; break;
                case 101: i = 0x0e; break;
                case 102: i = 0x0f; break;
                //case 109: i = "m"; break;
                default: i = 0;break;
            }
        }
        return i;
    }

    export function weep(eepAdr: number, num: number) {
        let data = pins.createBuffer(3);
        data[0] = eepAdr >> 8;
        data[1] = eepAdr & 0xFF;
        data[2] = num;
        pins.i2cWriteBuffer(romAdr1, data);
        basic.pause(10);
        return 0;
    }

    // blockId=PLEN:bit_reep
    // block="readEEPROM %eepAdr| byte%num"
    // eepAdr.min=910 eepAdr.max=2000
    // num.min=0 num.max=43
    // advanced=true
    export function reep(eepAdr: number, num: number) {
        let data = pins.createBuffer(2);
        data[0] = eepAdr >> 8;
        data[1] = eepAdr & 0xFF;
        // need adr change code
        pins.i2cWriteBuffer(romAdr1, data);
        //let value = (pins.i2cReadBuffer(romAdr1, num, false));
        return pins.i2cReadBuffer(romAdr1, num, false);//value;
    }

    //% block
    //% advanced=true
    export function savePositon(servoNum: number, adjustNum: number)
    {
        adjustNum = servoSetInit[servoNum] + adjustNum;
        weep(0, 1);    //write flag
        weep(servoNum * 2 + 2, (adjustNum & 0xff00) >> 8 );
        weep(servoNum * 2 + 3, adjustNum & 0xff);
    }

    export function loadPos(){
        let readBuf = reep(0x00, 1);
        if (readBuf[0] == 0x01){
            readBuf = reep(0x02, 16);
            for (let i = 0; i < 8; i++){
                servoSetInit[i] = (readBuf[i * 2] << 8) | (readBuf[i * 2 + 1]);
                servoAngle[i] = servoSetInit[i];
            }
        }
    }

    //% block
    //% advanced=true
    export function resetPosition(){
        weep(0, 0);    //write flag reset
        for (let n = 0; n < 8; n++){
            weep(n * 2 + 2, (servoSetInit[n] & 0xff00) >> 8 );
            weep(n * 2 + 3, servoSetInit[n] & 0xff);
        }
    }

    //% block
    //% advanced=true
    export function servoAdjust(servoNum: number, adjustNum: number) {
        let adjNum = servoSetInit[servoNum] + adjustNum
        if (100 > adjNum) {
            adjustNum = adjustNum + 1;
        } else if (adjNum > 1700) {
            adjustNum = adjustNum - 1;
        } else {
            servoWrite(servoNum, (adjNum / 10));
            basic.pause(0.5);
        }
        return adjustNum;
    }
    
    function parseIntM(str: string) {
        let len = str.length;
        let num = [0, 0, 0, 0];
        for (let i = 0; i < len; i++) {
            switch (str[i]) {
                case "a": num[i] = 10; break;
                case "b": num[i] = 11; break;
                case "c": num[i] = 12; break;
                case "d": num[i] = 13; break;
                case "e": num[i] = 14; break;
                case "f": num[i] = 15; break;
                case "A": num[i] = 10; break;
                case "B": num[i] = 11; break;
                case "C": num[i] = 12; break;
                case "D": num[i] = 13; break;
                case "E": num[i] = 14; break;
                case "F": num[i] = 15; break;
                default:
                    num[i] = parseInt(str[i]);
                    break;
            }
        }
        let hex = 0;
        switch (len) {
            case 4: hex = (num[len - 4] * 0x1000);
            case 3: hex += (num[len - 3] * 0x0100);
            case 2: hex += (num[len - 2] * 0x0010);
            case 1: hex += (num[len - 1] * 0x0001);
        }
        return hex;
    }

    function bleInit() {
        serial.redirect(SerialPin.P8, SerialPin.P12, 115200);
        pins.digitalWritePin(DigitalPin.P16, 0);
        initBle = true;
    }

    //% blockId=PLEN:bit_BLE
    //% block="enable control from smartphone"
    //% advanced=true
    export function serialRead() {
        if (initBle == false) bleInit();
        pins.digitalWritePin(DigitalPin.P16, 1);
        while (1) {
            let buf = serial.readString();
            if ((buf[0] != "$") && (buf[0] != "#")) {
            //let buf: Buffer = serial.readBuffer(5);
            //if ((buf[0] != 0x24) && (buf[0] != 0x23)) {
                break;
            }
            //basic.showString("1");
            let bufB = buf[1] + buf[2];
            //buf = serial.readBuffer(4);
            //let bufB:number = ( buf[1] << 8 | buf[2] );
            //( 0x4d46 != ( mBuf[listNum] << 8 | mBuf[listNum + 1] ) )
            //if ( 0x504d != bufB ){
                //basic.showString("2");
            if (bufB == "PM") {
                //basic.showNumber(bufB);//
                //basic.showString(bufB);
                //serial.writeString("");
                //serial.writeNumber(parseInt(bufB));
                bufB = buf[3] + buf[4];
                motion(parseIntM(bufB));
                //motion( buf[3] << 8 | buf[4]);
                break;
            } else if (bufB == "SM") {
            //} else if (bufB == 0x534d ) {
            //}else if ( 0x534d == bufB){
                break;
            } else {
                basic.showString("b");
                //display.show("b")
                break;
            }
        }
        pins.digitalWritePin(DigitalPin.P16, 0);
    }

    //% block="servo motor initial"
    export function servoInitialSet() {
        for (let n = 0; n < 8; n++) {
            servoWrite(n, servoSetInit[n] / 10);
        }
    }

    //% block
    //% advanced=true
    export function servoFree() {
        //Power Free!
        write8(0xFA, 0x00);
        write8(0xFB, 0x00);
        write8(0xFC, 0x00);
        write8(0xFD, 0x00);
        write8(0x00, 0x01);
        //write8(0x00, 0x80);
        initPCA9865 == false;
    }


    
    // Super Advance Code

    //% block
    //% advanced=true
    export function checkEprom(eepAdr: number) {
        //43 * 20 = 860
        let adrrr = 0x32 + 860 * eepAdr;    // 0x00
        let mf = 0;

        for (let i = 0; i < 20; i++) {
            let _n:Buffer = plenbit.reep(adrrr, 43);
            mf = plenbit.bufToNum(_n);
            serial.writeNumber(mf);
            //serial.writeBuffer(_n);
            serial.writeString("\r\n");
            adrrr += 43;
        }
        basic.pause(300);
    }

    export function bufToNum(mBuf: Buffer) {
        let mf = 0;    //=null ?
        for (let i = 0; i < mBuf.length; i++) {
            let num = mBuf.getNumber(NumberFormat.Int8LE, i);
            mf += num2Hex(num);//numToHex(num);
        }
        return mf;
    }

    function ack() {
        let data = pins.createBuffer(2);
        data[0] = 46;
        serial.writeBuffer(data);
    }


    export function weep_page(eepAdr: number, value: Buffer, valueLengh: number) {
        let dataFloat = pins.createBuffer(45);
        let data = pins.createBuffer(45);
        let counter = eepAdr;
        data[0] = eepAdr >> 8;//msb
        data[1] = eepAdr & 0xFF;//lsb
        let float_flag = false;
        let bufLength = valueLengh;//value.length;//bufferの型の長さしか取れない
        let dataAddr = 2;
        let dataFloatAddr = 0;

        for (let i = 0; i < bufLength; i++) {
            let neko = counter % 256;
            let thisBuf = value.slice(i, 1);
            if (float_flag) {
                float_flag = true;
                dataFloat.write(dataFloatAddr, thisBuf);
                dataFloatAddr++;
            } else if (neko != 0) {
                data.write(dataAddr, thisBuf);
            } else {
                // copy data
                let dataSuper = pins.createBuffer(i + 2);
                dataSuper.write(0, data);
                pins.i2cWriteBuffer(romAdr1, dataSuper, false);
                //serial.writeString("DS:");//debug
                //serial.writeString(plenbit.bufToStr(dataSuper));//debug
                basic.pause(20);

                // over page 
                float_flag = true;
                dataFloat[0] = counter >> 8;
                dataFloat[1] = counter & 0xFF;
                dataFloat[2] = thisBuf[0];
                dataFloatAddr = 3;
            }
            counter += 1;
            dataAddr += 1;
        }



        //未解決ゾーン（たぶん解決済）
        //1.bufferの長さに精確性が皆無だった
        //関数に入るときのbufferの空データのせいでlengthが狂う
        //2.12cWrite()のバッファーも文字数と合わせる必要がある。（2回書き込む場合）

        if (float_flag) {
            pins.i2cWriteBuffer(romAdr1, dataFloat, false);
            //serial.writeString(":D2:");//debug
            //serial.writeString(plenbit.bufToStr(dataFloat));//debug
        } else {
            pins.i2cWriteBuffer(romAdr1, data, false);
            //serial.writeString("D1:");//debug
            //serial.writeString(plenbit.bufToStr(data));//debug
        }
        basic.pause(20);

        return 0;
    }

    //% block
    //% advanced=true
    export function motionWrite() {
        serial.setRxBufferSize(64)
        let motionData: Buffer = pins.createBuffer(64);
        let writeF = false;
        let _motion_adr = 0;
        let _stage = 0;
        let nextMotionAdr = 0;
        let longloop = true;

        while (longloop) {
            let mf = "";
            switch (_stage) {
                case 0:
                    led.plot(0, 4);
                    let _nHead: Buffer = serial.readBuffer(3);
                    mf = _nHead.toString();

                    if (writeF == true) {

                        if (mf == "end") {
                            led.plot(4, 0);
                            if (nextMotionAdr > _motion_adr) {
                                plenbit.weep(_motion_adr, 0xff);//FF書込み
                            }
                            serial.writeString(";");
                            _stage = 0;
                            writeF = false;
                            _motion_adr = 0;
                            longloop = false;
                            basic.clearScreen();
                        } else {
                            led.plot(4, 1);
                            _stage = 2;
                            if (mf == ">MF") {
                                led.plot(0, 1);
                                _stage = 2;
                                motionData.write(0, _nHead);
                                //_motion_adr += 3;
                            } else {
                                serial.writeString("f2");
                                _stage = 0;
                                longloop = false;
                                basic.clearScreen();
                            }
                        }
                    } else {
                        if (mf == ">MF") {
                            led.plot(4, 2);
                            _stage = 1;
                            motionData.write(0, _nHead);
                        } else if (mf == ">DB") {
                            led.plot(4, 3);
                            let _nDB: Buffer = serial.readBuffer(2);
                            //let _n = plenbit.bufToStr(_nDB);
                            //checkEprom(plenbit.parseIntM(_n));
                            checkEprom(num2Hex(_nDB[0]) << 4 | num2Hex(_nDB[1]));
                            serial.writeString(";");
                        } else {
                            led.plot(4, 4);
                            serial.writeString("f1");
                            _stage = 0;
                            longloop = false;
                            basic.clearScreen();
                        }
                    }
                    break;

                case 1:
                    led.plot(1, 4);
                    let _n_slot:Buffer = serial.readBuffer(2);
                    //mf = _n_slot.toString();
                    //let _n_adr = plenbit.parseIntM(mf[0] + mf[1]);
                    let _n_adr = _n_slot[0] << 4 | _n_slot[1];
                    //serial.writeNumber(_n_adr);
                    //basic.showNumber(_n_adr);
                    _motion_adr = 0x32 + 860 * _n_adr;
                    nextMotionAdr = _motion_adr + 860;
                    //serial.writeNumber(_motion_adr);
                    //plenMotion.weep_page(_motion_adr, _nHead);
                    //_motion_adr += 3;//head
                    motionData.write(3, _n_slot);
                //plenMotion.weep_page(_motion_adr, _n_slot);
                //_motion_adr += 2;//flame//time
                case 2:
                    led.plot(2, 4);
                    if (writeF == true) {
                        led.plot(0, 0);
                        let mBuf1: Buffer = serial.readBuffer(40);//3+2+38
                        //led.plot(1, 0);
                        ack();
                        //led.plot(2, 0);
                        motionData.write(3, mBuf1);
                        //led.plot(3, 0);
                        plenbit.weep_page(_motion_adr, motionData, 43);
                        _motion_adr += 43;
                    } else {
                        led.plot(1, 2);
                        let mBuf1: Buffer = serial.readBuffer(38);//3+2+38
                        ack();
                        motionData.write(5, mBuf1);
                        plenbit.weep_page(_motion_adr, motionData, 43);
                        _motion_adr += 43;//38;
                    }
                    led.plot(2, 2);
                    _stage = 0;
                    writeF = true;
                    basic.clearScreen();
            }
        }
    }
}