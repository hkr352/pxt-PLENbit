//% color=#00A654 icon="\uf185"
namespace custom {
    /**
    *    test neko function
    */    //% weight=30 blockId="neko_moisture" block="neko %pin"
    export function nekoneko(pin: number): number {
        let num = pin;
        return neko(num);
    }

    /**
     * Function used for simulator
     */
    //% shim=custom::neko
    function neko(num: number) {
        // Fake function for simulator
        return num
    }
}
