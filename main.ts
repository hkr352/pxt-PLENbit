/*
basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `);

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