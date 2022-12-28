import moment from "moment";
import { Menu } from "../entity/Menu";
import { Stok_Main } from "../entity/Stok_Main";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import "moment-timezone";
import { Stok_Keluar } from "../entity/Stok_Keluar";

const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");
class StokSystem {
    static async getStok(day):Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.query("SELECT m.nama_menu, s.*, substr(s.created_at, 1, 10) AS date_clean FROM stok_main AS s LEFT OUTER JOIN menu AS m ON s.id_menu = m.id_menu WHERE date_clean = ?", [day.tanggal]);

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async newBookStok(day):Promise<any> {
        try {
            let service = await dataSource;
            const id_stok_main = shortid.generate();
            // get id_menu to stok main
            const get_all_menu = await service.manager.find(Menu);
            // get data previous 
            const yesterday_date = moment().tz("Asia/Jakarta").subtract(1, "days").format("DD-MM-YYYY");
            const get_yesterday_stok = await service.manager.query("SELECT *, substr(created_at, 1, 10) AS date_clean FROM stok_main WHERE date_clean = ?", [yesterday_date]);

            if (get_yesterday_stok.length !== 0) {
                // insert to stock main
                const data_all = Array<any>();

                await get_yesterday_stok.forEach(el => {
                    data_all.push({
                        id_stok_main: id_stok_main,
                        id_menu: el.id_menu,
                        stok_awal: el.stok_akhir,
                        stok_masuk: 0,
                        terjual: 0,
                        sisa: 0,
                        stok_akhir: el.stok_akhir,
                        keterangan: "",
                        shift: "pagi",
                        user_in: day.user_in,
                        created_at: day.date_now,
                        updated_at: day.date_now,
                    });
                });

                const input_menu = await service.manager.createQueryBuilder().insert().into(Stok_Main).values(data_all).execute();

                if (input_menu) {
                    return {response: true, data: "data is saved"}
                } else {
                    return {response: false, data: "data is not saved"}
                }
            } else {
                const data_all = Array<any>();

                await get_all_menu.forEach(el => {
                    data_all.push({
                        id_stok_main: id_stok_main,
                        id_menu: el.id_menu,
                        stok_awal: 0,
                        stok_masuk: 0,
                        terjual: 0,
                        sisa: 0,
                        stok_akhir: 0,
                        keterangan: "",
                        shift: "pagi",
                        user_in: day.user_in,
                        created_at: day.date_now,
                        updated_at: day.date_now,
                    });
                });

                const input_menu = await service.manager.createQueryBuilder().insert().into(Stok_Main).values(data_all).execute();

                if (input_menu) {
                    return {response: true, data: "data is saved 2"}
                } else {
                    return {response: false, data: "data is not saved 2"}
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async fetchStokMenu(data):Promise<any> {
        try {
            let service = await dataSource;

            // get data stok menu
            const get_data = await service.manager.find(Stok_Main, {
                where: {
                    id_menu: data.id_menu,
                    id_stok_main: data.id_stok_main
                }
            });

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async addStokMasuk(data):Promise<any> {
        try {
            let service = await dataSource;
            // get previous stok
            const get_data_stok = await service.manager.find(Stok_Main, {
                where: {
                    id_menu: data.id_menu,
                    id_stok_main: data.id_stok_main,
                }
            });

            // sum old and new data
            const sum_masuk = parseInt(data.stok_masuk) + get_data_stok[0].stok_masuk;

            const sum_akhir = parseInt(data.stok_masuk) + get_data_stok[0].stok_akhir;
            // update into stok main
            const update_stok = await service.manager.createQueryBuilder().update(Stok_Main).set({
                stok_masuk: sum_masuk,
                stok_akhir: sum_akhir,
            }).where("id_menu = :id_menu AND id_stok_main = :id_stok_main", {id_menu: data.id_menu, id_stok_main: data.id_stok_main}).execute();

            if (update_stok) {
                return {response: true, data: "data is saved"};
            } else {
                return {response: true, data: 'data is not saved'};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async addTerjual(data_cart, tanggal, user_in, shift):Promise<any> {
        try {
            let service = await dataSource;
            const arr_id_menu = Array<any>();
            const arr_qty = Array<any>();

            await data_cart.forEach(el => {
                arr_id_menu.push(el.id_menu);
                arr_qty.push(el.qty);
            });

            //convert array to string
            const arr_id_menu_where = await arr_id_menu.map((el,i) => {
                return `'${el}'`
            });

            const result_id_menu = await arr_id_menu_where.join(", ");

            console.log(`(${result_id_menu})`)
            

            const get_stok = await service.manager.query("SELECT *, substr(created_at, 1, 10) AS date_clean FROM stok_main WHERE date_clean = ? AND id_menu IN ("+ result_id_menu +")", [tanggal]);
            
            console.log(get_stok);

            if (get_stok.length !== 0) {
                // calculate sum all qty and stok akhir by id_menu
                const id_stok_keluar = shortid.generate();
                const arr_result = Array<any>();
                const arr_out = Array<any>();

                for (var i = 0; i <= get_stok.length - 1; i++) {
                    if (get_stok[i].id_menu === data_cart[i].id_menu) {
                        arr_result.push({
                            id_stok_main: get_stok[i].id_stok_main, 
                            id_menu: get_stok[i].id_menu, 
                            stok_akhir: get_stok[i].stok_akhir - data_cart[i].qty, 
                            sisa: get_stok[i].stok_akhir - data_cart[i].qty, 
                            terjual: get_stok[i].stok_akhir - data_cart[i].qty
                        });

                        await service.manager.createQueryBuilder().update(Stok_Main).set({
                            stok_akhir: get_stok[i].stok_akhir - data_cart[i].qty, 
                            sisa: get_stok[i].stok_akhir - data_cart[i].qty, 
                            terjual: get_stok[i].terjual + data_cart[i].qty
                        }).where('id_menu = :id AND id_stok_main = :id2', {id: get_stok[i].id_menu, id2: get_stok[i].id_stok_main}).execute();

                        arr_out.push({
                            id_stok_keluar: id_stok_keluar,
                            id_stok_main: get_stok[i].id_stok_main,
                            id_menu: data_cart[i].id_menu,
                            stok_keluar: data_cart[i].qty,
                            keterangan: "",
                            shift: shift,
                            user_in: user_in,
                            created_at: date_now,
                            updated_at: date_now
                        });
                    }
                }
                
                console.log(arr_result);
                console.log(arr_id_menu);
                const insert_out = await service.manager.getRepository(Stok_Keluar).createQueryBuilder().insert().values(arr_out).execute();

                if (insert_out) {
                    return {response: true, data: "done"};
                } else {
                    return {response: false, data: "stok is error"};
                }
            } else {
                return {response: false, data: "stok not found"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default StokSystem;