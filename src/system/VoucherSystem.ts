import { Voucher } from "../entity/Voucher";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";
import 'moment-timezone';

const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");

class VoucherSystem {
    static async addVoucher(data_voucher:any):Promise<any> {
        try {
            let service = await dataSource;
            const check_voucher = await service.manager.find(Voucher, {
                where: {
                    kode_voucher: data_voucher.kode_voucher,
                }
            });

            if (check_voucher.length === 0) {
                const id_voucher = shortid.generate();
                const add_voucher = await service.manager.getRepository(Voucher).createQueryBuilder().insert().values({
                    id_voucher: id_voucher,
                    kode_voucher: data_voucher.kode_voucher,
                    desc_voucher: data_voucher.desc_voucher,
                    potongan: data_voucher.potongan,
                    start_masa: data_voucher.start_masa,
                    end_masa: data_voucher.end_masa,
                    status_voucher: "active",
                    created_at: date_now,
                    updated_at: date_now,
                }).execute();

                if (add_voucher) {
                    return {response: true, data: "data is saved"};
                } else {
                    return {response: false, data: "data is not saved"};
                }

            } else {
                return {response: false, data: "kode voucher is aready used"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async editVoucher(data_voucher: any):Promise<any> {
        try {   
            let service = await dataSource;
            
            const update_voucher = await service.manager.createQueryBuilder().update(Voucher).set({
                kode_voucher: data_voucher.kode_voucher,
                desc_voucher: data_voucher.desc_voucher,
                potongan: data_voucher.potongan,
                start_masa: data_voucher.start_masa,
                end_masa: data_voucher.end_masa,
                status_voucher: "active",
                updated_at: date_now,
            }).where('id_voucher = :id', {id: data_voucher.id_voucher}).execute();

            if (update_voucher) {
                return {response: true, data: "data is updated"};
            } else {
                return {response: false, data: "data is not updated"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async deleteVoucher(id_voucher: any):Promise<any> {
        try {
            let service = await dataSource;
            const delete_voucher = await service.manager.getRepository(Voucher).delete({id_voucher: id_voucher});

            if (delete_voucher) {
                return {response: true, data: "data is deleted"};
            } else {
                return {response: false, data: "data is not deleted"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getDataVoucher():Promise<any> {
        try {
            let service = await dataSource;
            const get_data = await service.manager.find(Voucher);
            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async checkVoucher(data_voucher):Promise<any> {
        try {
            let service = await dataSource;
            const check = await service.manager.find(Voucher, {
                where: {
                    kode_voucher: data_voucher.kode_voucher,
                }
            });

            if (check.length !== 0) {
                return {response: true, data: check};
            } else {
                return {response: false, data: "voucher is not found"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default VoucherSystem;