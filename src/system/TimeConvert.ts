class TimeConvert {
    static textToMS(val, table) {
        var a = val[1].split(":");
        // const second_1 = +a[0] * 60 * 60 + +a[0] * 60;
        // const second_2 = +a[1] * 60
        const seconds = Number(a[0]) * 60 * 60 + Number(a[1]) * 60;
        // if (a[0] !== "00") {
        //     seconds = +a[0] * 60 * 60 + +a[0] * 60;
        // } else {
        //     seconds = +a[1] * 60;
        // }
        
        var milliseconds = seconds * 1000;
        console.log(seconds);
        return {table:table, seconds: seconds, milliseconds: milliseconds, mode: 'Regular'};
    }

    static textToTime(val, table) {
        var a = val[1].split(":");
        var hh = parseInt(a[0]);
        var mm = parseInt(a[1]);
        return {table: table, hh: +hh, mm: +mm, mode: "Loss"};
    }
}

export default TimeConvert