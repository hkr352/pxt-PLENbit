//% color=#00A654 icon="\uf185"
namespace custom {
    //% block="aho2 %pin"
    export function nekoneko(pin: number): number {
        let ADCVal = pin;
        return neko(ADCVal);
    }

    //% shim=custom::neko
    function neko(i: number) {
        // Fake function for simulator
        return 0
    }
}
