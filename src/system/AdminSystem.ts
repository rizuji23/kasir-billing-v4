import moment from "moment";
import 'moment-timezone';
import System from "./System";
import { dataSource } from "./data-source";
import { Shift } from "../entity/Shift";
import { Harga_Billing } from "../entity/Harga_Billing";
import { Harga_Member } from "../entity/Harga_Member";
import { User_Kasir } from "../entity/User_Kasir";

class AdminSystem {
    static async getShiftAdmin():Promise<any> {
        try {
            let service = await dataSource;

            const get_shift = await service.manager.find(Shift);
            if (get_shift.length !== 0) {
                return {response: true, data: get_shift};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async updateShift(data):Promise<any> {
        try {
            let service = await dataSource;

            const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

            const update_shift = await service.manager.createQueryBuilder().update(Shift).set({
                start_jam: data.start_jam,
                end_jam: data.end_jam,
                updated_at: date_now
            }).where('id_shift = :id', {id: data.id_shift}).execute();

            if (update_shift) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getHargaBilling():Promise<any> {
        try {
            let service = await dataSource;

            const get_harga = await service.manager.find(Harga_Billing);

            if (get_harga.length !== 0) {
                return {response: true, data: get_harga};
            } else {
                return {response: false, data: "data is empty"};
            }

         } catch (err) {
            console.log(err);
        }
    }

    static async updateHargaBilling(data):Promise<any> {
        try {
            let service = await dataSource;
            
            const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

            const update_harga = await service.manager.createQueryBuilder().update(Harga_Billing).set({
                harga: data.harga,
                updated_at: date_now,
            }).where('id_harga_billing = :id', {id: data.id_harga_billing}).execute();

            if (update_harga) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getHargaMember():Promise<any> {
        try {
            let service = await dataSource;

            const get_harga = await service.manager.find(Harga_Member)

            if (get_harga.length !== 0) {
                return {response: true, data: get_harga};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async updateHargaMember(data):Promise<any> {
        try {
            let service = await dataSource;

            const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

            const update_harga = await service.manager.createQueryBuilder().update(Harga_Member).set({
                harga_member: data.harga_member,
                potongan: data.potongan,
                playing: data.playing,
                updated_at: date_now,
            }).where('id_harga_member = :id', {id: data.id_harga_member}).execute();

            if (update_harga) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }


    static async loginAdmin(data):Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.find(User_Kasir, {
                where: {
                    username: data.username,
                    password: data.password,
                    jabatan: "Admin",
                }
            });

            if (get_data.length !== 0) {
                return {response: true, data: "done"};
            } else {
                return {response: false, data: "failed"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default AdminSystem;