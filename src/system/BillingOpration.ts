import { dataSource } from "./data-source";
import { Harga_Billing } from "../entity/Harga_Billing";
import { Table_Billiard } from "../entity/Table_Billiard";
import { Booking } from "../entity/Booking";
import 'moment-timezone';
import moment from "moment";
import { Detail_Booking } from "../entity/Detail_Booking";
import { Pesanan } from "../entity/Pesanan";
import { Cart } from "../entity/Cart";
import { ipcRenderer, Menu } from "electron";
import shortid from 'shortid'
import { Struk } from "../entity/Struk";
import DotAdded from "./DotAdded";
import StrukSystem from "./StrukSystem";
import { IsNull, Not } from "typeorm";


interface data_pay {
    id_table: string,
    id_booking: string,
    id_pesanan: string,
    uang_cash: string,
    kembalian: string,
    type_booking: string,
}

class BillingOperation {
    async checkHarga(data):Promise<any> {
        try {
            let service = await dataSource;
            const jam = moment().tz("Asia/Jakarta");
            const jam_sekarang = jam.format("HH:mm:ss");
            const data_durasi = jam.format("HH:mm:ss").split(':');

            const harga_detail = [];
            var total_harga = 0;
    
                for (var i = 0; i<data.durasi; i++) {
                    const jam_estimasi = moment().tz("Asia/Jakarta").set('minutes', i * 60).format('HH');
                    const jam_full = moment().tz("Asia/Jakarta").set('minutes', i * 60).format('HH:mm:ss');
                    const split_jam = jam_full.split(':')
                    split_jam[1] = data_durasi[1];
                    split_jam[2] = data_durasi[2];
                    const jam_all = `${split_jam[0]}:${split_jam[1]}:${split_jam[2]}`;

                    console.log(jam_all)
    
                    if (jam_estimasi >= data.start_jam && jam_estimasi < data.end_jam) {
                        const result = await service.manager.find(Harga_Billing, {
                            where: {
                                tipe_durasi: "Siang"
                            }
                        });
    
                        harga_detail.push({'tipe': "Siang", harga: result[0].harga, durasi: 1, start_duration: jam_sekarang, end_duration: jam_all})
                        total_harga += result[0].harga;
                    } else if (jam_estimasi >= data.start_jam || jam_estimasi < data.end_jam) {
                        const result = await service.manager.find(Harga_Billing, {
                            where: {
                                tipe_durasi: "Malam"
                            }
                        })
    
                        harga_detail.push({'tipe': "Malam", harga: result[0].harga, durasi: 1, start_duration: jam_sekarang, end_duration: jam_all})
                        total_harga += result[0].harga;
    
                    }
                }
            return {'response': true, harga_detail: harga_detail, total_harga: total_harga}
        } catch (err) {
            console.log(err)
            return {'response': false, data: err}
        }
    }

    async inputPrice(data_booking:any, shift_now):Promise<any> {
        try {
            const date_now =  moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
            const data_price:any = await this.checkHarga(shift_now);
            console.log(data_price)
            let service = await dataSource;
            const check_booking = await service.manager.find(Booking, {
                where: {
                    id_booking: data_booking.id_booking
                }
            });

            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_booking: data_booking.id_booking,
                }
            });

            if (check_booking.length !== 0) {
                    const harga:number = check_booking[0].total_harga + data_price.total_harga;
                    const durasi:number = check_booking[0].durasi_booking + 1;
                    const input_price = await service.manager.createQueryBuilder().update(Booking).set({
                        durasi_booking: durasi,
                        total_harga: harga,
                        updated_at: date_now
                    }).where('id_booking = :id', {id: data_booking.id_booking}).execute();

                    if (input_price) {
                        const id_detail_booking = shortid.generate();
                        console.log(id_detail_booking);
                        const input_detail = await service.manager.createQueryBuilder().insert().into(Detail_Booking).values({
                            id_detail_booking: id_detail_booking,
                            id_booking: data_booking.id_booking,
                            harga: data_price.total_harga,
                            durasi: 1,
                            status: 'active',
                            start_duration: data_price.harga_detail[0].start_duration,
                            end_duration: data_price.harga_detail[0].end_duration,
                            created_at: date_now,
                            updated_at: date_now
                        }).execute();

                        const check_detail_booking = await service.manager.find(Detail_Booking, {
                            where: {
                                id_booking: data_booking.id_booking,
                                status: 'active'
                            }
                        });

                        const dd_booking:any = check_detail_booking;
                        const total_booking = dd_booking.reduce((total, arr) => {
                            return total + arr.harga
                        }, 0);

                        var total_all;

                        if (check_struk[0].id_pesanan.length !== 0) {
                            const check_cart = await service.manager.find(Cart, {
                                where: {
                                    id_pesanan: check_struk[0].id_pesanan,
                                    status: 'belum dibayar'
                                }
                            });

                            const dd_cart:any = check_cart;
                            const total_cart = dd_cart.reduce((total, arr) => {
                                return total + arr.sub_total;
                            }, 0);

                            total_all = total_cart + total_booking;
                        } else {
                            total_all = total_booking;
                        }

                        const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                            total_struk: total_all,
                            updated_at: date_now,
                        }).where('id_booking = :id', {id: data_booking.id_booking}).execute();

                        if (update_struk) {
                            return {'response': true, 'data': 'data is saved'};
                        } else {
                            return {'response': false, 'data': 'data not found'};
                        }
                    }
            } else {
                return {'response': false, 'data': 'data not found'};

            }
        } catch (err) {
            console.log(err)
        }
    }

    async getDataTable(id_table):Promise<any> {
        try {
            let service = await dataSource;
            const check_table = await service.manager.find(Table_Billiard, {
                where: {
                    id_table:id_table
                }
            })

            if (check_table.length !== 0) {
                const search_booking = await service.manager.find(Booking, {
                    where: {
                        id_booking: check_table[0].id_booking,
                        status_booking: 'active',
                    }
                });


                    if (search_booking.length !== 0) {
                        return {'response': true, data: search_booking}
                    } else {
                        return {'response': false, data: "data empty"}
                    }

            } else {
                return {'response': false, data: "data empty"}
            }
        } catch (err) {
            console.log(err)
            return {'response': false, data: err}
        }
    }

    async getDetailPriceBill(id_booking):Promise<any> {
        try {
            let service = await dataSource;
            
            const get_detail = await service.manager.find(Detail_Booking, {
                where: {
                    id_booking: id_booking,
                }
            });

            const get_booking = await service.manager.find(Booking, {
                where: {
                    id_booking: id_booking,
                }
            })
    
            if (get_detail.length !== 0) {
                return {'response': true, data: get_detail, data_booking: get_booking};
            } else {
                return {'response': false, data: 'data empty'};
            }
        } catch (err) {
            console.log(err)
            return {'response': false, data: err}

        }
       
    }

    async getCafeDetail(id_booking):Promise<any> {
        try {
            let service = await dataSource;

            var get_detail_struk = await service.manager.find(Struk, {
                where: {
                    id_booking: id_booking,
                }
            });

    
            if (get_detail_struk.length !== 0) {
                var get_detail_pesanan = await service.manager.find(Pesanan, {
                    where: {
                        id_pesanan: get_detail_struk[0].id_pesanan,
                    }
                });
    
                var get_detail_cafe = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu WHERE cart.id_pesanan=? AND cart.status != 'active' ORDER BY id DESC", [get_detail_struk[0].id_pesanan]);

                console.log(get_detail_struk[0].id_pesanan);
                console.log(get_detail_pesanan)
    
                if (get_detail_cafe.length !== 0 || get_detail_struk.length !== 0 || get_detail_pesanan.length !== 0) {
                    return {'response': true, 'data_struk': get_detail_struk, 'data_cafe': get_detail_cafe, 'data_pesanan': get_detail_pesanan};
                } else {
                    return {'response': false, 'data_struk': 'data empty', 'data_cafe': 'data empty', 'data_pesanan': 'data empty'}
                }
            } else {
                return {'response': false, 'data_struk': 'data empty', 'data_cafe': 'data empty', 'data_pesanan': 'data empty'}
            }
        } catch (err) {
            console.log(err)
            return {'response': false, data: err}
        }

    }

    async getAllTable(all):Promise<any> {
        try {
            let service = await dataSource;
            var get_table;
    
            if (all) {
                get_table = await service.manager.find(Table_Billiard);
            } else {
                get_table = await service.manager.find(Table_Billiard, {
                    where: {
                        status: 'not_active',
                    }
                })
            }
    
            if (get_table.length !== 0) {
                return {'response': true, data: get_table}
            } else {
                return {'response': false, data: 'data empty'}
            }
        } catch (err) {
            console.log(err)
            return {'response': false, data: err}
        }

    }

    static async getActiveTable():Promise<any> {
        try {
            let service = await dataSource;
            const table = await service.manager.find(Table_Billiard, {
                where: {
                    status: 'active',
                }
            });

            if (table.length !== 0) {
                return {response: true, data: table};
            } else {
                return {response: false, data: 'data table empty'};
            }
        } catch (err) {
            console.log(err);
        }
    }


    static async sendPayNow(data_pay:data_pay):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;

            if (service) {
                const update_table = await service.manager.createQueryBuilder().update(Table_Billiard).set({
                    id_booking: '',
                    durasi: 0,
                    status: 'not_active',
                    updated_at: date_now,
                }).where("id_booking = :id", {id: data_pay.id_booking}).execute();

                if (update_table) {
                    const dot = new DotAdded();
                    const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                        status_struk: 'lunas',
                        updated_at: date_now,
                        cash_struk: dot.decode(data_pay.uang_cash),
                        kembalian_struk: dot.decode(data_pay.kembalian)
                    }).where('id_booking = :id', {id: data_pay.id_booking}).execute();

                    console.log("data_pay.id_booking", data_pay.id_booking)

                    const get_struk = await service.manager.find(Struk, {
                        where: {
                            id_booking: data_pay.id_booking,
                        },
                    });
                    console.log("Data ID STRUK ", get_struk[0].id_struk)

                    if (update_struk && get_struk.length !== 0) {
                        StrukSystem.printBilling(get_struk[0].id_struk, data_pay)
                        return {response: true, data: 'data is saved', id: get_struk};
                    } else {
                        return {response: false, data: 'data is not saved'};
                    }
                }
            }   
        } catch (err) {
            console.log(err);
        }
    }

    static async getHarga():Promise<any> {
        try {
            let service = await dataSource;

            const get_harga = await service.manager.find(Harga_Billing);

            return {response: true, data: get_harga};
        } catch (err) {
            console.log(err);
        }
    }

    static async changeName(data):Promise<any> {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;

            const change_name = await service.manager.createQueryBuilder().update(Booking).set({
                nama_booking: data.nama,
                updated_at: date_now
            }).where('id_booking = :id', {id: data.id_booking}).execute();

            if (change_name) {
                return {response: true, data: "data saved"};
            } else {
                return {response: false, data: "data is not saved"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async checkingPayTable(data_pay):Promise<any> {
        try {
            let service = await dataSource;

            // calculate all cart & detail_billing
            var total_menu = 0;
            var get_cart;
            const get_pesanan = await service.manager.find(Pesanan, {
                where: {
                    id_pesanan: data_pay?.id_pesanan || "",
                }
            });

            if (get_pesanan.length !== 0) {
                get_cart = await service.manager.find(Cart, {
                    where: {
                        id_pesanan: data_pay.id_pesanan,
                        type_bill: IsNull()
                    }
                });

                total_menu = await get_cart.reduce((total, arr) => {
                    return total + arr.sub_total;
                }, 0);
            }

            const get_billing = await service.manager.find(Detail_Booking, {
                where: {
                    id_booking: data_pay.id_booking,
                    type_bill: IsNull()
                }
            });

            var total_billing= await get_billing.reduce((total, arr) => {
                return total + arr.harga;
            }, 0);

            const total_all = await total_billing + total_menu;

            var data_menu;

            if (get_pesanan.length !== 0) {
                // update pesanan
                await service.manager.createQueryBuilder().update(Pesanan).set({
                    total: total_menu,
                }).where('id_pesanan = :id', {id: data_pay.id_pesanan}).execute();

                data_menu = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu WHERE cart.id_pesanan = ? AND cart.type_bill IS ?", [data_pay.id_pesanan, null]);
            }

            await service.manager.createQueryBuilder().update(Booking).set({
                total_harga: total_billing,
            }).where('id_booking = :id', {id: data_pay.id_booking}).execute();

            const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                total_struk: total_all,
            }).where('id_booking = :id', {id: data_pay.id_booking}).execute();

            if (update_struk) {
                return {response: true, data: "saved", data_billing: get_billing, data_menu: data_menu};
            } else {
                return {response: false, data: "something is wrong"};
            }
            
        } catch (err) {
            console.log(err);            
        }
    }

    static async getStruk(id_booking) {
        try {
            let service = await dataSource;

            const get_struk = await service.manager.find(Struk, {
                where: {
                    id_booking: id_booking,
                }
            });

            if (get_struk.length !== 0) {
                return {response: true, data: get_struk};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async fixList(data_pay) {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        try {
            let service = await dataSource;
            const get_billing = await service.manager.find(Detail_Booking, {
                where: {
                    id_booking: data_pay.id_booking,
                    type_bill: IsNull()
                }
            });

            var result_dupli = get_billing.reduce((unique, o) => {
                if (!unique.some(obj => obj.start_duration === o.start_duration && obj.end_duration === o.end_duration)) {
                    unique.push(o);
                }
                return unique;
            }, []);

            console.log("result_dupli", result_dupli);

            if (result_dupli.length !== 0) {
                // delete all data from detail_billing by id_booking
                const delete_booking = await service.manager.createQueryBuilder().delete().from(Detail_Booking).where('id_booking = :id', {id: data_pay.id_booking}).execute();

                if (delete_booking) {
                    // insert detail_booking data in result_dupli by id_booking
                    const insert = await service.manager.createQueryBuilder().insert().into(Detail_Booking).values(result_dupli).execute();

                    if (insert) {
                        // get data again detail_booking by id_booking
                        const get_bookings = await service.manager.find(Detail_Booking, {
                            where: {
                                id_booking: data_pay.id_booking,
                            }
                        });

                        const total_billing = await get_bookings.reduce((total, arr) => {
                            return total + arr.harga;
                        }, 0);

                        // update data booking by id_booking
                        await service.manager.createQueryBuilder().update(Booking).set({
                            durasi_booking: get_bookings.length,
                            total_harga: total_billing,
                            updated_at: date_now,
                        }).where('id_booking = :id', {id: data_pay.id_booking}).execute();

                        // get pesanan by id_pesanan
                        const get_pesanan = await service.manager.find(Pesanan, {
                            where: {
                                id_pesanan: data_pay?.id_pesanan || "",
                            }
                        });
                        var total_menu = 0;
                        if (get_pesanan.length !== 0) {
                            const get_cart = await service.manager.find(Cart, {
                                where: {
                                    id_pesanan: data_pay.id_pesanan,
                                    type_bill: IsNull(),
                                }
                            });

                            total_menu = await get_cart.reduce((total, arr) => {
                                return total + arr.sub_total;
                            }, 0);
                        }
                        
                        const total_all = await total_billing + total_menu;

                        // update struk by id_booking
                        const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                            total_struk: total_all,
                        }).where('id_booking = :id', {id: data_pay.id_booking}).execute();

                        if (update_struk) {
                            return {response: true, data: "saved"};
                        } else {
                            return {response: false, data: "Something is wrong"};
                        }
                    }
                }
            } else {
                return {response: false, data: "Data is already fixed"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default BillingOperation;