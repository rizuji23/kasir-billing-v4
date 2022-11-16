import { Kategori_Menu } from "../entity/Kategori_Menu";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";

const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")

class KategoriMenuSystem {
    static async getKategoriMenu():Promise<any> {
        try {
            let service = await dataSource;
            const get_kategori = await service.manager.find(Kategori_Menu);
            if (get_kategori.length !== 0) {
                return {response: true, data: get_kategori};
            } else {
                return {response: false, data: 'data is not exists'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async addKategoriMenu(data_kategori):Promise<any> {
        try {
            let service = await dataSource;
            const id_kategori = shortid.generate();
            const add_kategori = await service.manager.getRepository(Kategori_Menu).createQueryBuilder().insert().values({
                id_kategori_menu: id_kategori,
                nama_kategori: data_kategori.nama,
                created_at: date_now,
                updated_at: date_now
            }).execute();

            if (add_kategori) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async editKategoriMenu(data_kategori):Promise<any> {
        try {
            let service = await dataSource;
            const edit_kategori = await service.manager.createQueryBuilder().update(Kategori_Menu).set({
                nama_kategori: data_kategori.nama,
                updated_at: date_now
            }).where("id_kategori_menu = :id", {id: data_kategori.id_kategori}).execute();

            if (edit_kategori) {
                return {response: true, data: "data is updated"};
            } else {
                return {response: false, data: "data is not updated"};
            }
        } catch (err) {
            console.log(err)
        } 
    }

    static async deleteKategoriMenu(id_kategori):Promise<any> {
        try {
            let service = await dataSource;
            const delete_kategori = await service.manager.getRepository(Kategori_Menu).delete({id_kategori_menu: id_kategori});
            if (delete_kategori) {
                return {response: true, data: "data is deleted"};
            } else {
                return {response: false, data: "data is not deleted"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default KategoriMenuSystem;