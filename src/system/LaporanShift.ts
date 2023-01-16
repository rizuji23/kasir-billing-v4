import moment from "moment";
import 'moment-timezone';
import { dataSource } from "./data-source";
import { Shift } from "../entity/Shift";

class LaporanShift {
    static async getDataBilling():Promise<any> {
        try {
            let service = await dataSource;
            
            const get_data = await service.manager.query("SELECT * FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan LEFT OUTER JOIN booking ON struk.id_booking = booking.id_booking WHERE struk.status_struk = ? AND struk.type_struk = ? ORDER BY id DESC", ['lunas', 'table']);

            const get_shift = await service.manager.find(Shift);
            console.log(get_shift)
            // filter all data to time
            get_data.map((el) => {
                const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                if (time >= get_shift[0].start_jam.split(':')[0] && time < get_shift[0].end_jam.split(':')[0]) {
                    el['shift'] = "siang";
                } else if (time >= get_shift[1].start_jam.split(':')[0] || time < get_shift[1].end_jam.split(':')[0]) {
                    el['shift'] = "malam";
                }
            });

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getDataKeuanganCafe():Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.query("SELECT * FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan WHERE struk.status_struk = ? AND struk.type_struk = ? ORDER BY id DESC", ['lunas', 'cafe only']);

            // filter all data to time
            get_data.map((el, i) => {
                const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH:mm");
                if (time <= "16") {
                    el['shift'] = "siang";
                } else if (time >= "16") {
                    el['shift'] = "malam";
                }
            });

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

export default LaporanShift;