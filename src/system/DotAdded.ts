class DotAdded {
    parse(integer:number) {
        var number_string = integer.toString().replace(/[^,\d]/g, ""),
        split = number_string.split(","),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        var separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
    }

    decode(str:string) {
        return parseInt(str.split('.').join(''));
    }

    isNegative(number:number) {
        return !Object.is(Math.abs(number), +number); 
    }
}

// const dot = new DotAdded();
// console.log(dot.parse(1000000))
export default DotAdded