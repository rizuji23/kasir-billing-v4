import { Menu } from "../entity/Menu";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";
import fs from 'fs'
import { Detail_Cafe } from "../entity/Detail_Cafe";
import DotAdded from "./DotAdded";
import { Kategori_Menu } from "../entity/Kategori_Menu";

const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");
const dot = new DotAdded();

class MenuSystem {
    static async getDataMenu():Promise<any> {
        try {
            let service = await dataSource;
            const get_data = await service.manager.createQueryBuilder().select('menu').from(Menu, 'menu').leftJoinAndMapMany('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').leftJoinAndMapMany('menu.kategori_menu', Kategori_Menu, 'kategori', 'kategori.id_kategori_menu = menu.kategori_menu').getMany();
            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: 'data is empty'};
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async addMenu(data_menu:any):Promise<any> {
        try {
            let service = await dataSource;
            const id_menu = shortid.generate();
            const split_img = data_menu.gambar[0].name;
            const img = split_img.split('.');
            const name_img = img[0] = `${id_menu}-${img[0]}`
            const dir_upload = `./public/assets/img/menu/${name_img}.${img[1]}`

            const img_file = `${name_img}.${img[1]}`;
            const harga = {
                harga: dot.decode(data_menu.harga),
                harga_jual: dot.decode(data_menu.harga_jual),
                modal: dot.decode(data_menu.modal),
                keuntungan: dot.decode(data_menu.keuntungan),
            }


            const add_menu = await service.manager.getRepository(Menu).createQueryBuilder().insert().values({
                id_menu: id_menu,
                nama_menu: data_menu.nama,
                harga_menu: harga.harga,
                kategori_menu: data_menu.kategori,
                img_file: img_file,
                created_at: date_now,
                updated_at: date_now
            }).execute();

            if (add_menu) {
                const id_detail_cafe = shortid.generate();
                const add_detail_cafe = await service.manager.getRepository(Detail_Cafe).createQueryBuilder().insert().values({
                    id_detail_cafe: id_detail_cafe,
                    id_menu: id_menu,
                    harga_jual: harga.harga_jual,
                    modal: harga.modal,
                    keuntungan: harga.keuntungan,
                    created_at: date_now,
                    updated_at: date_now
                }).execute();

                if (add_detail_cafe) {
                    fs.copyFile(data_menu.gambar[0].path, dir_upload, (error) => {
                        if (error) throw error;
                    });
                    return {response: true, data: "data is saved"};
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async editMenu(data_menu:any):Promise<any> {
        try {
            let service = await dataSource;

            console.log(data_menu.harga);

            const harga = {
                harga: dot.decode(data_menu.harga),
                harga_jual: dot.decode(data_menu.harga_jual),
                modal: dot.decode(data_menu.modal),
                keuntungan: dot.decode(data_menu.keuntungan),
            }


            const update_menu = await service.manager.createQueryBuilder().update(Menu).set({
                nama_menu: data_menu.nama,
                harga_menu: harga.harga,
                kategori_menu: data_menu.kategori,
                updated_at: date_now
            }).where('id_menu = :id', {id: data_menu.id_menu}).execute();

            if (update_menu) {
                const update_detail = await service.manager.createQueryBuilder().update(Detail_Cafe).set({
                    harga_jual: harga.harga_jual,
                    modal: harga.modal,
                    keuntungan: harga.keuntungan,
                    updated_at: date_now
                }).where("id_menu = :id", {id: data_menu.id_menu}).execute();

                if (update_detail) {
                    return {response: true, data: "data is updated"};
                } else {
                    return {response: false, data: "data is not updated"};
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteMenu(id_menu):Promise<any> {
        try {
            let service = await dataSource;
            const delete_menu = await service.manager.getRepository(Menu).delete({id_menu: id_menu});
            if (delete_menu) {
                const delete_detail = await service.manager.getRepository(Detail_Cafe).delete({id_menu: id_menu});
                if (delete_detail) {
                    return {response: true, data: "data is deleted"};
                } else {
                    return {response: false, data: "data is not deleted"};
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
} 

export default MenuSystem;