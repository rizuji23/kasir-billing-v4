import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";
import { Harga_Member } from "../entity/Harga_Member";
import { Member } from "../entity/Member";


const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")

class MemberSystem {
    static async getPriceMember(tipe_booking):Promise<any> {
        try {
            let service = await dataSource;
            const check_harga = await service.manager.find(Harga_Member, {
                where: {
                    jenis_member: tipe_booking
                }
            })

            if (check_harga.length !== 0) {
                return {response: true, data: check_harga}
            } else {
                return {response: false, data: 'data is not exists'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async addMember(data_member):Promise<any> {
        try {
            let service = await dataSource;
            const id_member = shortid.generate();
            const add_member = await service.manager.getRepository(Member).createQueryBuilder().insert().values({
                id_member: id_member,
                kode_member: data_member.kode_member,
                nama_member: data_member.nama_member,
                no_telp: data_member.no_telp,
                email: data_member.email,
                no_ktp: data_member.no_ktp,
                alamat: data_member.alamat,
                tipe_member: data_member.tipe_member,
                status_member: data_member.status_member,
                created_at: date_now,
                updated_at: date_now
            }).execute();

            if (add_member) {
                return {response: true, data: 'data is saved'};
            } else {
                return {response: false, data: 'data is not save'};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async editMember(data_member):Promise<any> {
        try {
            let service = await dataSource;
            const edit_member = await service.manager.createQueryBuilder().update(Member).set({
                kode_member: data_member.kode_member,
                nama_member: data_member.nama_member,
                no_telp: data_member.no_telp,
                email: data_member.email,
                no_ktp: data_member.no_ktp,
                alamat: data_member.alamat,
                tipe_member: data_member.tipe_member,
                updated_at: date_now
            }).where('id_member = :id', {id: data_member.id_member}).execute();

            if (edit_member) {
                return {response: true, data: 'data is updated'};
            } else {
                return {response: false, data: 'data is not updated'};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getDataById(id_member):Promise<any> {
        try {
            let service = await dataSource;
            const find_member = await service.manager.find(Member, {
                where: {
                    id_member: id_member
                }
            });

            if (find_member.length !== 0) {
                return {response: true, data: find_member};
            } else {
                return {response: false, data: 'data not exists'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteMember(id_member):Promise<any> {
        try {
            let service = await dataSource;
            const delete_member = await service.manager.getRepository(Member).delete({id_member: id_member});
            if (delete_member) {
                return {response: true, data: 'data is deleted'};
            } else {
                return {response: false, data: 'data is not deleted'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getAllMember():Promise<any> {
        try {
            let service = await dataSource;
            const get_all = await service.manager.find(Member);
            if (get_all.length !== 0) {
                return {response: true, data: get_all};
            } else {
                return {response: false, data: 'data is empty'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async checkMember(data_member):Promise<any> {
        try {
            let service = await dataSource;

            const check = await service.manager.find(Member, {
                where: {
                    kode_member: data_member.kode_member,
                }
            });

            if (check.length !== 0) {
                return {response: true, data: check};
            } else {
                return {response: false, data: "member is not found"};
            }
            
        } catch (err) {
            console.log(err);
        }
    }
}

export default MemberSystem
