import moment from "moment";
import 'moment-timezone';
import { dataSource } from "./data-source";

class FilterSystem {
    static async getToday():Promise<any> {
        try {
            let service = await dataSource;
            const today = moment().tz("Asia/Jakarta").format("DD-MM-YYYY")

            const get_data = await service.manager.query("SELECT *, substr(struk.created_at, 1, 10) AS date_clean FROM struk WHERE struk.status_struk = ? AND date_clean = ? ORDER BY id DESC", ['lunas', today]);

            if (get_data.length !== 0) {
                return {response: true, data: "data exist"};
            } else {
                return {response: false, data: "data empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getDate(data):Promise<any> {
        try {
            let service = await dataSource;
            const from_date = moment(data.start, "YYYY-MM-DD").format("DD-MM-YYYY")
            const to_date = moment(data.end, "YYYY-MM-DD").format("DD-MM-YYYY")

            const get_data = await service.manager.query("SELECT *, substr(struk.created_at, 1, 10) AS date_clean FROM struk WHERE struk.status_struk = ? AND date_clean BETWEEN ? AND ? ORDER BY id DESC", ['lunas', from_date, to_date]);


            if (get_data.length !== 0) {
                return {response: true, data: "data exist"};
            } else {
                return {response: false, data: "data empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getMonth(data):Promise<any> {
        try {
            let service = await dataSource;

            const month = moment(data, "YYYY-MM").format("MM-YYYY");

            const get_data = await service.manager.query("SELECT *, substr(struk.created_at, 4, 7) AS date_clean FROM struk WHERE struk.status_struk = ? AND date_clean = ? ORDER BY id DESC", ['lunas', month]);

            if (get_data.length !== 0) {
                return {response: true, data: "data exist"};
            } else {
                return {response: false, data: "data empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getYear(data):Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.query("SELECT *, substr(struk.created_at, 7, 4) AS date_clean FROM struk WHERE struk.status_struk = ? AND date_clean = ? ORDER BY id DESC", ['lunas', data]);

            if (get_data.length !== 0) {
                return {response: true, data: "data exist"};
            } else {
                return {response: false, data: "data empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default FilterSystem;