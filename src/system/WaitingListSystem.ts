import { dataSource } from "./data-source";
import { Waiting_List } from "../entity/Waiting_List";
import shortid from 'shortid';
import moment from "moment";


class WaitingListSystem {
    static async getDataWaiting():Promise<any> {
       try {
            const service = await dataSource;
            const get_all = await service.manager.getRepository(Waiting_List).find();
            if (get_all.length !== 0) {
                    return {response: true, data: get_all};
            } else {
                    return {response: false, data: 'data is not exists'};
            }
       } catch (err) {
            console.log(err)
       }
    }

    static async addDataWaiting(data_waiting:any) {
        try {
            const service = await dataSource;

            const id_waiting = shortid.generate();
            const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
            const update_waiting = await service.manager.createQueryBuilder().insert().into(Waiting_List).values({
                id_waiting: id_waiting,
                nama_waiting: data_waiting.nama_waiting,
                table_waiting: data_waiting.table_waiting,
                created_at: date_now,
                updated_at: date_now
            }).execute();
            if (update_waiting) {
                return {response: true, data: 'waiting is saved'};
            } else {
                return {response: false, data: 'data is not save'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteDataWaiting(id_waiting:string){
        try {
            const service = await dataSource;
            const delete_waiting = await service.manager.getRepository(Waiting_List).delete({id_waiting: id_waiting});
            if (delete_waiting) {
                return {response: true, data: 'waiting deleted'};
            } else {
                return {response: false, data: 'waiting is not deleted'};
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export default WaitingListSystem;