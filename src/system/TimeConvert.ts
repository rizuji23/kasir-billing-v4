class TimeConvert {
    static textToMS(val, table) {
        var a = val[1].split(":");
        var seconds = +a[0] * 60 * 60 + +a[0] * 60;
        var milliseconds = seconds * 1000;

        return {table:table, seconds: seconds, milliseconds: milliseconds};
    }
}

export default TimeConvert