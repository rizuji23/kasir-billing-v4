import moment from "moment";
import "moment-timezone"
import { dataSource } from "../../../system/data-source";

class FilterTransaksiShift {
    static async filterByDateBilling(data:any):Promise<any> {
        try {
            let service = await dataSource;
            const from_date = moment(data.dari_tanggal, "YYYY-MM-DD").format("YYYY-MM-DD");
            const to_date = moment(data.sampai_tanggal, "YYYY-MM-DD").format("YYYY-MM-DD");

            const get_data = await service.manager.query("SELECT *, date(struk.created_at) AS date_clean FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan LEFT OUTER JOIN booking ON struk.id_booking = booking.id_booking WHERE struk.status_struk = ? AND struk.type_struk = ? AND date_clean BETWEEN ? AND ? ORDER BY id DESC", ['lunas', 'table', from_date, to_date]);

            get_data.map((el, i) => {
                const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                if (time >= data.shift.start_jam.split(':')[0] && time < data.shift.end_jam.split(':')[0]) {
                    el['shift'] = "siang";
                } else if (time >= data.shift.start_jam.split(':')[0] || time < data.shift.end_jam.split(':')[0]) {
                    el['shift'] = "malam";
                }
            })

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async filterByDateCafe(data:any):Promise<any> {
        try {
            let service = await dataSource;
            const from_date = moment(data.dari_tanggal, "YYYY-MM-DD").format("YYYY-MM-DD")
            const to_date = moment(data.sampai_tanggal, "YYYY-MM-DD").format("YYYY-MM-DD")

            const get_data = await service.manager.query("SELECT *, date(struk.created_at) AS date_clean FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan WHERE struk.status_struk = ? AND struk.type_struk = ? AND date_clean BETWEEN ? AND ? ORDER BY id DESC", ['lunas', 'cafe only', from_date, to_date]);

            get_data.map((el, i) => {
                const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                if (time >= data.shift.start_jam.split(':')[0] && time < data.shift.end_jam.split(':')[0]) {
                    el['shift'] = "siang";
                } else if (time >= data.shift.start_jam.split(':')[0] || time < data.shift.end_jam.split(':')[0]) {
                    el['shift'] = "malam";
                }
            })

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }
}

export default FilterTransaksiShift;