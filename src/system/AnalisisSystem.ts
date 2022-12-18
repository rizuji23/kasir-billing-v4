import moment from "moment";
import { dataSource } from "./data-source";

class AnalisisSystem {
    static async getPendapatan(filter, data):Promise<any> {
        try {
            let service = await dataSource;
            
            if (filter === false) {
                const get_data_billing = await service.manager.query("SELECT * FROM booking WHERE status_booking = ? ORDER BY id DESC", ['lunas']);
                const get_data_cafe = await service.manager.query("SELECT * FROM pesanan WHERE status = ?", ['lunas']);

                return {response: true, data: {data_billing: get_data_billing, data_cafe: get_data_cafe}};
            } else {
                const from_date = moment(data.dari_tanggal, "YYYY-MM-DD").format("DD-MM-YYYY")
                const to_date = moment(data.sampai_tanggal, "YYYY-MM-DD").format("DD-MM-YYYY")

                const get_data_billing = await service.manager.query("SELECT *, substr(created_at, 1, 10) AS date_clean FROM booking WHERE status_booking = ?  AND date_clean BETWEEN ? AND ? ORDER BY id DESC", ['lunas', from_date, to_date]);

                const get_data_cafe = await service.manager.query("SELECT *, substr(created_at, 1, 10) AS date_clean FROM pesanan WHERE status = ? AND date_clean BETWEEN ? AND ?", ['lunas', from_date, to_date]);

                return {response: true, data: {data_billing: get_data_billing, data_cafe: get_data_cafe}};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getPendapatanPerbulan(data):Promise<any> {
        try {
            let service = await dataSource;
            const month = moment(data.month, "MM-YYYY").format("MM-YYYY")

            const get_data_billing = await service.manager.query("SELECT *, substr(created_at, 4, 7) AS date_clean FROM booking WHERE status_booking = ?  AND date_clean = ? ORDER BY id DESC", ['lunas', month]);

            const get_data_cafe = await service.manager.query("SELECT *, substr(created_at, 4, 7) AS date_clean FROM pesanan WHERE status = ? AND date_clean = ?", ['lunas', month]);

            return {response: true, data: {data_billing: get_data_billing, data_cafe: get_data_cafe}};

        } catch (err) {
            console.log(err);
        }
    }

    static async getPendapatanKuartal(data):Promise<any> {
        try {
            let service = await dataSource;
            const year = moment(data.year, "YYYY").format("YYYY")

            const get_data_billing = await service.manager.query("SELECT *, 'Q' || coalesce(nullif((substr(created_at, 3, 2) - 1) / 3, 0), 4) AS kuartal, substr(created_at, 7, 4) AS date_clean FROM booking WHERE status_booking = ? AND date_clean = ? ORDER BY id DESC", ['lunas', year]);

            const get_data_cafe = await service.manager.query("SELECT *, 'Q' || coalesce(nullif((substr(created_at, 3, 2) - 1) / 3, 0), 4) AS kuartal, substr(created_at, 7, 4) AS date_clean FROM pesanan WHERE status = ? AND date_clean = ?", ['lunas', year]);

            return {response: true, data: {data_billing: get_data_billing, data_cafe: get_data_cafe}};

        } catch (err) {
            console.log(err);
        }
    }
}

export default AnalisisSystem;