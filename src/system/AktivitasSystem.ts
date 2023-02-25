import { Aktivitas } from "../entity/Aktivitas";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";
import 'moment-timezone';

class AktivitasSystem {
    static async getAktivitas():Promise<any> {
        try {
            let service = await dataSource;

            const get_aktivitas = await service.manager.find(Aktivitas);
            if (get_aktivitas.length !== 0) {
                return {response: true, data: get_aktivitas};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async addAktivitas(data):Promise<any> {
        try {
            let service = await dataSource;

            const id_aktivitas = shortid.generate();
            const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

            const add_aktivitas = await service.manager.getRepository(Aktivitas).createQueryBuilder().insert().values({
                id_aktivitas: id_aktivitas,
                aktivitas: data.aktivitas,
                user_in: data.user_in,
                created_at: date_now,
                updated_at: date_now,
            }).execute();

            if (add_aktivitas) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default AktivitasSystem;