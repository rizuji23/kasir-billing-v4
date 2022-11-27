class TimeConvert {
    static textToMS(val, table) {
        var a = val[1].split(":");
        var seconds = +a[0] * 60 * 60 + +a[0] * 60;
        var milliseconds = seconds * 1000;

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