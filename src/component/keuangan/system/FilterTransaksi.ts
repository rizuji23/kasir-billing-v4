import moment from "moment";
import "moment-timezone"

class FilterTransaksi {
    static async filterByDate(data:any):Promise<any> {
        return new Promise((res, rej) => {
            const from_date = moment(data.dari_tanggal, "YYYY-MM-DD").format("DD-MM-YYYY")
            const to_date = moment(data.sampai_tanggal, "YYYY-MM-DD").format("DD-MM-YYYY")

            const filter_data = data.data.filter((el) => {
                el['created_at_clean'] = moment(el.created_at, "DD-MM-YYYY").format("DD-MM-YYYY")
                return el['created_at_clean'] >= from_date && el['created_at_clean'] <= to_date;
            });

            if (filter_data.length !== 0) {
                res(filter_data)
            } else {
                rej(`${data.dari_tanggal} ~ ${data.sampai_tanggal} tidak ada.`);
            }
        });
    }
}

export default FilterTransaksi;