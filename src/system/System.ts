import { Shift } from "../entity/Shift";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";
import 'moment-timezone';
import { Settings } from "../entity/Settings";

class System {
    static async setShift(data_shift):Promise<any> {
        try {
            const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");
            let service = await dataSource;

            const check_shift = await service.manager.find(Shift);

            if (check_shift.length <= 2) {
                console.log("CAN");
                const id_shift = shortid.generate();

                const insert_shift = await service.manager.getRepository(Shift).createQueryBuilder().insert().values({
                    id_shift: id_shift,
                    shift: data_shift.shift,
                    start_jam: data_shift.start_jam,
                    end_jam: data_shift.end_jam,
                    created_at: date_now,
                    updated_at: date_now,
                }).execute();

                if (insert_shift) {
                    return {response: true, data: "data is saved"};
                } else {
                    return {response: false, data: "data is not saved"};
                }
            } else {
                console.log("DONT");
                return {response: false, data: "data is full"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getShift(data_shift):Promise<any> {
        try {
            let service = await dataSource;
            const check_shift = await service.manager.find(Shift, {
                where: {
                    id_shift: data_shift.id_shift,
                }
            });

            if (check_shift.length !== 0) {
                return {response: true, data: check_shift};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async setApi(data_api):Promise<any> {
        try {
            let service = await dataSource;
            const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");

            const update_api = await service.manager.createQueryBuilder().update(Settings).set({
                url: data_api.url,
                updated_at: date_now,
            }).where("id_settings = :id", {id: "API001"}).execute();

            if (update_api) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getApi():Promise<any> {
        try {
            let service = await dataSource;

            const get_api = await service.manager.find(Settings, {
                where: {
                    id_settings: "API001",
                }
            });

            if (get_api.length !== 0) {
                return {response: true, data: get_api};
            } else {
                return {response: false, data: "data is empty"};
            }


        } catch (err) {
             console.log(err);
        }
    }

    static async getPrinter(win):Promise<any> {
        try {
            let service = await dataSource;

            console.log(win);

            const get_db = await service.manager.find(Settings, {
                where: {
                    id_settings: "PRINTER001"
                }
            });

            return {response: true, data: win, data_db: get_db};
        } catch (err) {
            console.log(err);
        }
    }

    static async setPrinter(data_print):Promise<any> {
        try {
            let service = await dataSource;
            const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");

            const update_api = await service.manager.createQueryBuilder().update(Settings).set({
                url: data_print.printer,
                updated_at: date_now,
            }).where("id_settings = :id", {id: "PRINTER001"}).execute();

            if (update_api) {
                return {response: true, data: "data is saved"}; 
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default System;