// tests go here; this will not be compiled when this package is used as a library


basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `);

basic.forever(function () {
    //plenbit.serialread()

})
input.onButtonPressed(Button.A, function () {
    while(1){
        if(plenbit.sensorLR(plenbit.LedLr.BButtonSide) >= 700){
            plenbit.walk(false);
        }else{
            plenbit.walk(true);
        }
        if(input.buttonIsPressed(Button.B)){
            break;
        }
    }
    // //plenbit.dance_motion(plenbit.danceMotions.DanceLStep)
    // //plenbit.stdMotion(plenbit.StdMotions.ArmPataPata)
    // plenbit.motion_flame(plenbit.StdMotions.WalkForward, 0);
    // plenbit.motion_flame(plenbit.StdMotions.WalkForward, 1);
    // for (let i = 0; i <= 3; i++) {
    //     plenbit.motion_flame(plenbit.StdMotions.WalkForward, 2);
    //     plenbit.motion_flame(plenbit.StdMotions.WalkForward, 3);
    //     plenbit.motion_flame(plenbit.StdMotions.WalkForward, 4);
    //     plenbit.motion_flame(plenbit.StdMotions.WalkForward, 5);
    //     plenbit.motion_flame(plenbit.StdMotions.WalkForward, 6);
    //     plenbit.motion_flame(plenbit.StdMotions.WalkForward, 7);
    // }
    // plenbit.motion_flame(plenbit.StdMotions.WalkForward, 8);
    // plenbit.motion_flame(plenbit.StdMotions.WalkForward, 9);

})
input.onButtonPressed(Button.B, function () {
    //plenbit.servoFree();
    plenbit.motion(plenbit.StdMotions.WalkForward);
})

/*
basic.forever(function () {
    plenbit.serialread()
    if (pins.analogReadPin(AnalogPin.P0) <= 500) {
        plenbit.Move_motion(plenbit.moveMotions.PataPata)
        basic.pause(100)
    } else {
        if (pins.analogReadPin(AnalogPin.P2) >= 650) {
            plenbit.Move_motion(plenbit.moveMotions.WalkBack)
            basic.pause(100)
        }
    }
})
*/