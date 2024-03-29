import { Menu } from "electron";
import { Cart } from "../entity/Cart";
import { dataSource } from "./data-source";
import shortid from 'shortid';
import moment from "moment";
import { Pesanan } from "../entity/Pesanan";
import { Struk } from "../entity/Struk";
import DotAdded from "./DotAdded";
import StrukSystem from "./StrukSystem";
import { Booking } from "../entity/Booking";
import { Stok_Main } from "../entity/Stok_Main";
import StokSystem from "./StokSystem";
import { Stok_Keluar } from "../entity/Stok_Keluar";
import AktivitasSystem from "./AktivitasSystem";

class CartSystem {
    static async getCart():Promise<any> {
        try {
            let service = await dataSource;
            const get_data = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu WHERE cart.status = 'active' ORDER BY cart.id DESC");

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: 'data not exists'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async addCart(data_cart):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;
            const id_cart = shortid.generate();

            const check_cart = await service.manager.find(Cart, {
                where: {
                    id_menu: data_cart.id_menu,
                    status: 'active',
                }
            });

            if (check_cart.length === 0) {
                const add_cart = await service.manager.getRepository(Cart).createQueryBuilder().insert().values({
                    id_cart: id_cart,
                    id_menu: data_cart.id_menu,
                    qty: data_cart.qty,
                    sub_total: data_cart.sub_total,
                    status: 'active',
                    id_pesanan: '',
                    user_in: data_cart.user_in,
                    created_at: date_now,
                    updated_at: date_now
                }).execute();
                
                const get_cart = await service.manager.find(Cart, {
                    where: {
                        id_cart: id_cart
                    }
                })

                if (add_cart) {
                    return {response: true, data: get_cart};
                } else {
                    return {response: false, data: 'cart is not saved'};
                }

            } else {
                const total_new = check_cart[0].sub_total + data_cart.sub_total;
                const qty_new = check_cart[0].qty + data_cart.qty;

                const update_cart = await service.manager.createQueryBuilder().update(Cart).set({
                    sub_total: total_new,
                    qty: qty_new
                }).where('id_menu = :id', {id: data_cart.id_menu}).execute();
                
                if (update_cart) {
                    return {response: true, data: 'cart is saved'};
                } else {
                    return {response: false, data: 'cart is not saved'};
                }
            }

            
        } catch (err) {
            console.log(err);
        }
    }

    static async editCart(data_cart):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;
            const edit_cart = await service.manager.createQueryBuilder().update(Cart).set({
                qty: data_cart.qty,
                sub_total: data_cart.sub_total,
                user_id: data_cart.user_id,
                updated_at: date_now
            }).where('id_cart = :id', {id: data_cart.id_cart}).execute();

            if (edit_cart) {
                return {response: true, data: 'data is saved'};
            } else {
                return {response: false, data: 'data is not saved'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteCart(id_cart):Promise<any> {
        try {
            let service = await dataSource;
            const delete_cart = await service.manager.getRepository(Cart).delete({id_cart: id_cart});
            if (delete_cart) {
                return {response: true, data: 'data is deleted'};
            } else {
                return {response: false, data: 'data is not deleted'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async addPesananCafeOnly(data_cart):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;
            const id_pesanan = shortid.generate();
            const id_struk = shortid.generate();

            const add_pesanan = await service.manager.getRepository(Pesanan).createQueryBuilder().insert().values({
                id_pesanan: id_pesanan,
                id_cart: '',
                total: data_cart.total,
                uang_cash: data_cart.uang_cash,
                uang_kembalian: data_cart.uang_kembalian,
                id_booking: '',
                status: 'lunas',
                user_in: data_cart.user_in,
                created_at: date_now,
                updated_at: date_now,
            }).execute();

            if (add_pesanan) {
                const struk = await service.manager.getRepository(Struk).createQueryBuilder().insert().values({
                    id_struk: id_struk,
                    id_pesanan: id_pesanan,
                    id_booking: '',
                    nama_customer: 'Cafe',
                    total_struk: data_cart.total,
                    cash_struk: data_cart.uang_cash,
                    kembalian_struk: data_cart.uang_kembalian, 
                    status_struk: 'lunas',
                    type_struk: 'cafe only',
                    user_in: data_cart.user_in,
                    created_at: date_now,
                    updated_at: date_now
                }).execute();

                if (struk) {
                    const cart = await service.manager.createQueryBuilder().update(Cart).set({
                        id_pesanan: id_pesanan,
                        status: 'not active',
                    }).where('status = :status', {status: 'active'}).execute();

                    // increast stok
                    const get_date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                    // update stok
                    const get_cart:any = await service.manager.find(Cart, {
                        where: {
                            id_pesanan: id_pesanan,
                        }
                    });

                    const arr_cart = await Array.from(
                        get_cart.reduce((a, {id_menu, qty}) => {
                            return a.set(id_menu, (a.get(id_menu) || 0) + qty);
                        }, new Map())
                    ).map(([id_menu, qty]) => ({id_menu, qty}));

                    console.log(arr_cart);

                    if (cart) {
                        
                        StokSystem.addTerjual(arr_cart, get_date_now, data_cart.user_in, data_cart.shift, "cafe only")
                        StrukSystem.print(id_struk);
                        await AktivitasSystem.addAktivitas({aktivitas: `Melakukan Pemesanan (Cafe Only) [${id_pesanan}]`, user_in: data_cart.user_in});
                        return {response: true, data: 'pesanan selesai'};
                    } else {
                        return {response: false, data: 'pesanan gagal'};
                    }
                } else {
                    return {response: false, data: 'pesanan gagal'};
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async addPesananTable(data_cart):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;
            const dot = new DotAdded();
            

            const check_pesanan = await service.manager.find(Pesanan, {
                where: {
                    id_booking: data_cart.id_booking,
                }
            });

            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_booking: data_cart.id_booking
                }
            })

            if (check_pesanan.length !== 0) {
                const cart = await service.manager.createQueryBuilder().update(Cart).set({
                    id_pesanan: check_pesanan[0].id_pesanan,
                    status: 'belum dibayar',
                }).where('status = :status', {status: 'active'}).execute();

                if (cart) {
                    const check_cart = await service.manager.find(Cart, {
                        where: {
                            id_pesanan: check_pesanan[0].id_pesanan,
                            status: 'belum dibayar',
                        }
                    });

                    const dd:any = await check_cart;
                    const total_new = await dd.reduce((total, arr) => {
                        return total + arr.sub_total;
                    }, 0);

                    const update_pesanan = await service.manager.createQueryBuilder().update(Pesanan).set({
                        total: total_new,
                        updated_at: date_now,
                    }).where('id_booking = :id', {id: data_cart.id_booking}).execute();

                    // increast stok
                    const get_date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                    // update stok

                    const arr_cart = await Array.from(
                        data_cart.cart.reduce((a, {id_menu, qty}) => {
                            return a.set(id_menu, (a.get(id_menu) || 0) + qty);
                        }, new Map())
                    ).map(([id_menu, qty]) => ({id_menu, qty}));

                    if (update_pesanan) {
                        const check_booking = await service.manager.find(Booking, {
                            where: {
                                id_booking: data_cart.id_booking
                            }
                        });

                        const total_struk = await check_booking[0].total_harga + total_new;
                        const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                            total_struk: total_struk,
                            updated_at: date_now
                        }).where('id_booking = :id', {id: data_cart.id_booking}).execute();

                            if (update_struk && check_booking) {
                                console.log("IN HERE")
                                StokSystem.addTerjual(data_cart.cart, get_date_now, data_cart.user_id, data_cart.shift, "table")

                                return {response: true, data: 'pesanan selesai'};
                            } else {
                                return {response: false, data: 'pesanan is not complite'};
                            }

                    }
                }
                
            } else {
                const id_pesanan = shortid.generate();
                const insert_pesanan = await service.manager.getRepository(Pesanan).createQueryBuilder().insert().values({
                    id_pesanan: id_pesanan,
                    id_cart: '',
                    total: dot.decode(data_cart.total_harga),
                    uang_cash: 0,
                    uang_kembalian: 0,
                    id_booking: data_cart.id_booking,
                    status: 'belum lunas',
                    user_in: data_cart.user_id,
                    created_at: date_now,
                    updated_at: date_now
                }).execute();

                if (insert_pesanan) {
                    const total_new = check_struk[0].total_struk + dot.decode(data_cart.total_harga);
                    const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                        id_pesanan: id_pesanan,
                        total_struk: total_new,
                        updated_at: date_now
                    }).where('id_booking = :id', {id: data_cart.id_booking}).execute();

                    // increast stok
                    const get_date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

                    const arr_cart = await Array.from(
                        data_cart.cart.reduce((a, {id_menu, qty}) => {
                            return a.set(id_menu, (a.get(id_menu) || 0) + qty);
                        }, new Map())
                    ).map(([id_menu, qty]) => ({id_menu, qty}));

                    if (update_struk) {
                        const cart = await service.manager.createQueryBuilder().update(Cart).set({
                            id_pesanan: id_pesanan,
                            status: 'belum dibayar',
                        }).where('status = :status', {status: 'active'}).execute();
                        
                        if (cart) {
                            console.log("IN HERE 2")
                            StokSystem.addTerjual(data_cart.cart, get_date_now, data_cart.user_id, data_cart.shift, "table")

                            return {response: true, data: 'pesanan selesai'};
                        } else {
                            return {response: false, data: 'pesanan is not complite'};
                        }
                    } else {
                        return {response: false, data: 'pesanan is not complite'};
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async cancelPesanan():Promise<any> {
        try {
            let service = await dataSource;
            const delete_all = await service.manager.createQueryBuilder().delete().from(Cart).where('status = :status', {status: 'active'}).execute();

            if (delete_all) {
                return {response: true, data: 'cart is empty'};
            } else {
                return {response: false, data: 'cart is failed to empty'};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteCartTable(data_cart):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        const date_clean = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

        try {
            let service = await dataSource;
            const check_pesanan = await service.manager.find(Pesanan, {
                where: {
                    id_booking: data_cart.id_booking
                }
            });

            const get_cart = await service.manager.find(Cart, {
                where: {
                    id_cart: data_cart.id_cart,
                }
            });

            const get_stok = await service.manager.query("SELECT *, date(stok_main.created_at) AS date_clean FROM stok_main WHERE id_menu = ? AND date_clean = ?", [get_cart[0].id_menu, date_clean]);

            if (get_stok.length !== 0) {

                const filter_day = await get_stok.filter(el => el.shift === data_cart.shift);
                const terjual = parseInt(filter_day[0].terjual || 0) - get_cart[0].qty;
                const sisa = parseInt(filter_day[0].sisa || 0) + get_cart[0].qty;

                const update_stok = await service.manager.createQueryBuilder().update(Stok_Main).set({
                    sisa: sisa,
                    terjual: terjual,
                }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: data_cart.shift}).execute();

                const delete_out = await service.manager.getRepository(Stok_Keluar).delete({id_cart: data_cart.id_cart});

                if (delete_out && update_stok) {
                    if (data_cart.shift === "pagi") {
                        await service.manager.createQueryBuilder().update(Stok_Main).set({
                            stok_akhir: sisa,
                            updated_at: date_now,
                        }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).execute();

                        await service.manager.createQueryBuilder().update(Stok_Main).set({
                            sisa: sisa,
                            updated_at: date_now,
                        }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "malam"}).execute();
                    } else if (data_cart.shift === "malam") {
                        await service.manager.createQueryBuilder().update(Stok_Main).set({
                            stok_akhir: sisa,
                            sisa: sisa,
                            updated_at: date_now,
                        }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "malam"}).execute();
                        await service.manager.createQueryBuilder().update(Stok_Main).set({
                            stok_akhir: sisa,
                            updated_at: date_now,
                        }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "pagi"}).execute();
                    }
                }
            }

            if (check_pesanan.length !== 0) {
                const delete_cart = await service.manager.getRepository(Cart).delete({id_cart: data_cart.id_cart, status: 'belum dibayar'});
                if (delete_cart) {
                    const check_cart = await service.manager.find(Cart, {
                        where: {
                            id_pesanan: check_pesanan[0].id_pesanan,
                            status: 'belum dibayar',
                        }
                    });

                    console.log("Check Cart: ", check_cart);
                    console.log("Check Pesanan: ", check_pesanan);


                    if (check_cart) {
                        const dd:any = check_cart;
                        const total_cart = dd.reduce((total, arr) => {
                            return total + arr.sub_total;
                        }, 0);

                        const check_booking = await service.manager.find(Booking, {
                            where: {
                                id_booking: data_cart.id_booking
                            }
                        });

                        const update_pesanan = await service.manager.createQueryBuilder().update(Pesanan).set({
                            total: total_cart,
                            updated_at: date_now
                        }).where('id_pesanan = :id', {id: check_pesanan[0].id_pesanan}).execute()
                        console.log("Total Cart : ", total_cart)
                        
                        const total_struk = check_booking[0].total_harga + total_cart;
                        console.log("Total Struk : ", total_struk)

                        const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                            total_struk: total_struk,
                            updated_at: date_now
                        }).where('id_booking = :id', {id: data_cart.id_booking}).execute();
                        console.log(update_struk)
                        console.log(update_pesanan)

                        if (update_struk && update_pesanan) {
                            return {response: true, data: 'data is deleted'};
                        } else {
                            return {response: false, data: 'data is not deleted'};
                        }
                } else {
                    return {response: false, data: 'data is not deleted'};
                }
            }
        }
        } catch (err) {
            console.log(err);
        }
    }

    static async editCartTable(data_cart):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        const date_clean = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

        try {
            let service = await dataSource;
            const check_pesanan = await service.manager.find(Pesanan, {
                where: {
                    id_booking: data_cart.id_booking
                }
            });

            // get cart
            const get_cart = await service.manager.find(Cart, {
                where: {
                    id_cart: data_cart.id_cart,
                }
            });

            // get data stok main
            const get_stok = await service.manager.query("SELECT *, date(stok_main.created_at) AS date_clean FROM stok_main WHERE id_menu = ? AND date_clean = ?", [get_cart[0].id_menu, date_clean]);
            console.log("Stok_main", get_stok)

            if (get_stok.length !== 0) {
                // process stoking
                if (get_cart[0].qty < data_cart.qty) {
                    console.log("ditambah");
                    const filter_day = await get_stok.filter(el => el.shift === data_cart.shift);
                    console.log(filter_day)
                    const qty = parseInt(data_cart.qty) - get_cart[0].qty;
                    const terjual = parseInt(filter_day[0].terjual) + qty;
                    const sisa = parseInt(filter_day[0].sisa) - qty;

                    console.log("terjual", terjual)
                    console.log("sisa", sisa)
                    console.log("qty", qty)

                    const update_stok = await service.manager.createQueryBuilder().update(Stok_Main).set({
                        sisa: sisa,
                        terjual: terjual,
                    }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: data_cart.shift}).execute();

                    const get_stok_akhir = await service.manager.find(Stok_Keluar, {
                        where: {
                            id_cart: data_cart.id_cart,
                        }
                    });

                    const stok_keluar_2 = get_stok_akhir[0].stok_keluar + qty;
                    const update_stok_akhir = await service.manager.createQueryBuilder().update(Stok_Keluar).set({
                        stok_keluar: stok_keluar_2,
                        updated_at: date_now,
                    }).where('id_cart = :id', {id: data_cart.id_cart}).execute();

                    if (update_stok_akhir && update_stok) {
                        // update stok_akhir in stok_main table
                        if (data_cart.shift === "pagi") {
                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).execute();

                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                sisa: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "malam"}).execute();
                        } else if (data_cart.shift === "malam") {
                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                sisa: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "malam"}).execute();
                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "pagi"}).execute();
                        }
                    }

                } else if (get_cart[0].qty > data_cart.qty) {
                    console.log("dikurang");
                    const filter_day = await get_stok.filter(el => el.shift === data_cart.shift);
                    console.log(filter_day)
                    const qty = get_cart[0].qty - parseInt(data_cart.qty);
                    const terjual = parseInt(filter_day[0].terjual) - qty;
                    const sisa = parseInt(filter_day[0].sisa) + qty;
                    console.log("terjual", terjual)
                    console.log("sisa", sisa)
                    console.log("qty", qty)
                    const update_stok = await service.manager.createQueryBuilder().update(Stok_Main).set({
                        sisa: sisa,
                        terjual: terjual,
                    }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: data_cart.shift}).execute();

                    const get_stok_akhir = await service.manager.find(Stok_Keluar, {
                        where: {
                            id_cart: data_cart.id_cart,
                        }
                    });

                    const stok_keluar_2 = await get_stok_akhir[0].stok_keluar - qty;
                    const update_stok_akhir = await service.manager.createQueryBuilder().update(Stok_Keluar).set({
                        stok_keluar: stok_keluar_2,
                        updated_at: date_now,
                    }).where('id_cart = :id', {id: data_cart.id_cart}).execute();

                    if (update_stok_akhir && update_stok) {
                        // update stok_akhir in stok_main table
                        if (data_cart.shift === "pagi") {
                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).execute();

                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                sisa: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "malam"}).execute();
                        } else if (data_cart.shift === "malam") {
                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                sisa: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "malam"}).execute();
                            await service.manager.createQueryBuilder().update(Stok_Main).set({
                                stok_akhir: sisa,
                                updated_at: date_now,
                            }).where('id_menu = :id', {id: get_cart[0].id_menu}).andWhere('date(stok_main.created_at) = :date', {date: date_clean}).andWhere('shift = :shift', {shift: "pagi"}).execute();
                        }
                    }
                } else {
                    console.log("pass");
                }
            }

            if (check_pesanan.length !== 0) {
                const edit_cart = await service.manager.createQueryBuilder().update(Cart).set({
                    qty: data_cart.qty,
                    sub_total: data_cart.sub_total,
                    user_id: data_cart.user_id,
                    updated_at: date_now
                }).where('id_cart = :id', {id: data_cart.id_cart}).andWhere('status = :status', {status: 'belum dibayar'}).execute();
                console.log(edit_cart)
                if (edit_cart) {
                    const check_cart = await service.manager.find(Cart, {
                        where: {
                            id_pesanan: check_pesanan[0].id_pesanan,
                            status: 'belum dibayar'
                        }
                    });

                    if (check_cart.length !== 0) {
                        const dd:any = check_cart;
                        const total_cart = dd.reduce((total, arr) => {
                            return total + arr.sub_total;
                        }, 0);

                        console.log(total_cart)

                        const update_pesanan = await service.manager.createQueryBuilder().update(Pesanan).set({
                            total: total_cart,
                            updated_at: date_now
                        }).where('id_pesanan = :id', {id: check_pesanan[0].id_pesanan}).execute()

                        const check_booking = await service.manager.find(Booking, {
                            where: {
                                id_booking: data_cart.id_booking
                            }
                        });

                        const total_struk = check_booking[0].total_harga + total_cart;
                        const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                            total_struk: total_struk,
                            updated_at: date_now
                        }).where('id_booking = :id', {id: data_cart.id_booking}).execute();

                        if (update_struk && update_pesanan) {
                            return {response: true, data: 'data is saved'};
                        } else {
                            return {response: false, data: 'data is not saved'};
                        }
                    }
                }   
            }
        } catch (err) {
            console.log(err);
        }
    }

}

export default CartSystem;