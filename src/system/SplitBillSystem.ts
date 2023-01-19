import { dataSource } from "./data-source";
import shortid from 'shortid';
import { Split_Bill } from "../entity/Split_Bill";
import moment from "moment";
import { Split_Bill_Detail } from "../entity/Split_Bill_Detail";
import { Detail_Booking } from "../entity/Detail_Booking";
import { In } from "typeorm";
import { Cart } from "../entity/Cart";
import { Booking } from "../entity/Booking";
import { Pesanan } from "../entity/Pesanan";
import { Struk } from "../entity/Struk";
import { Menu } from "electron";
import DotAdded from "./DotAdded";


class SplitBillSystem {
    static async addSplit(data_bill) {
        const date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

        try {
            let service = await dataSource;
            const id_split_bill = shortid.generate();

            const add_bill = await service.manager.getRepository(Split_Bill).createQueryBuilder().insert().values({
                id_split_bill: id_split_bill,
                id_booking: data_bill.id_booking,
                nama_bill: data_bill.nama,
                total_bill: new DotAdded().decode(data_bill.total),
                type_bill: data_bill.type_bill,
                user_in: data_bill.user_in,
                created_at: date_now,
                updated_at: date_now
            }).execute();

            if (add_bill) {
                const data_billing = Array<any>();
                const id_billing = Array<string>();
                data_bill.data_billing.forEach(el => {
                    const id_split_bill_detail = shortid.generate();
                    data_billing.push({
                        id_split_bill_detail: id_split_bill_detail,
                        id_split_bill: id_split_bill,
                        id_cart: '',
                        id_detail_booking: el.id_detail_booking,
                        sub_total: el.harga,
                        status_bill: 'lunas',
                        created_at: date_now,
                        updated_at: date_now
                    });

                    id_billing.push(el.id_detail_booking);
                });

                
                const data_menu = Array<any>();
                const id_menu = Array<string>();
                data_bill.data_menu.forEach(el => {
                    const id_split_bill_detail = shortid.generate();
                    data_billing.push({
                        id_split_bill_detail: id_split_bill_detail,
                        id_split_bill: id_split_bill,
                        id_cart: el.id_cart,
                        id_detail_booking: '',
                        sub_total: el.sub_total,
                        status_bill: 'lunas',
                        created_at: date_now,
                        updated_at: date_now
                    });

                    id_menu.push(el.id_cart);
                });

                const data_all = data_billing.concat(data_menu);
                const insert_detail = await service.manager.createQueryBuilder().insert().into(Split_Bill_Detail).values(data_all).execute();

                if (insert_detail) {
                    // Update all Cart and Detail_Booking to lunas/terbayar
                     const update_billing = await service.manager.createQueryBuilder().update(Detail_Booking).set({
                        type_bill: "split_bill",
                        status: 'lunas',
                        updated_at: date_now
                     }).where("id_detail_booking IN (:...id)", {id: id_billing}).execute();

                     const update_cart = await service.manager.createQueryBuilder().update(Cart).set({
                        type_bill: "split_bill",
                        status: 'lunas',
                        updated_at: date_now
                     }).where("id_cart IN (:...id)", {id: id_menu}).execute();

                     if (update_billing && update_cart) {
                        // Calculate Again All Cart and Detail Booking then update Struk, Booking, Pesanan
                        console.log("Arr Billing: ", id_billing)
                        console.log("Arr Menu: ", id_menu)

                        var get_billing = await service.manager.find(Detail_Booking, {
                            where: {
                                id_booking: data_bill.id_booking,
                                status: 'active',
                            }
                        });
                        
                        console.log(data_bill.data_menu[0]?.id_pesanan)

                        const get_menu = await service.manager.find(Cart, {
                            where: {
                                id_pesanan: data_bill.id_pesanan,
                                status: 'belum dibayar',
                            }
                        });

                        const dd_billing:any = get_billing;
                        const total_billing = dd_billing.reduce((total, arr) => {
                            return total + arr.harga;
                        }, 0);
                        
                        const dd_menu:any = get_menu;
                        const total_menu = dd_menu.reduce((total, arr) => {
                            return total + arr.sub_total;
                        }, 0);

                        console.log("Total Billing: ", total_billing);
                        console.log("Total Menu: ", total_menu);

                        // Update total Booking
                        const update_booking = await service.manager.createQueryBuilder().update(Booking).set({
                            total_harga: total_billing,
                            updated_at: date_now,
                        }).where('id_booking = :id', {id: data_bill.id_booking}).execute();

                        // Update total Pesanan
                        const update_pesanan = await service.manager.createQueryBuilder().update(Pesanan).set({
                            total: total_menu,
                            updated_at: date_now,
                        }).where("id_pesanan = :id", {id: data_bill.id_pesanan}).execute();

                        if (update_booking && update_pesanan) {
                            // Update Final to Struk    
                            const total_struk = total_billing + total_menu;
                            console.log("Total Struk: ", total_struk);

                            const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                                total_struk: total_struk,
                                updated_at: date_now,
                            }).where("id_pesanan = :id", {id: data_bill.id_pesanan}).orWhere("id_booking = :id", {id: data_bill.id_booking}).execute();

                            if (update_struk) {
                                return {response: true, data: 'split bill is done'};
                            } else {
                                return {response: false, data: 'split bill is not done'};
                            }
                        } else {
                            return {response: false, data: 'split bill is not done'};
                        }
                     } else {
                        return {response: false, data: 'split bill is not done'};
                     }

                } else {
                    return {response: false, data: 'split bill is not done'};
                }
            } else {
                return {response: false, data: 'split bill is not done'};

            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getLaporanSplitBill():Promise<any> {
        try {
            let service = await dataSource;

            const get_split_bill = await service.manager.find(Split_Bill);
            
            if (get_split_bill.length !== 0) {
                return {response: true, data: get_split_bill};
            } else {
                return {response: false, data: "data is empty"};
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    static async getDetailSplitBill(data):Promise<any> {
        try {
            let service = await dataSource;

            console.log(data);

            const get_split_bill = await service.manager.query("SELECT * FROM split_bill WHERE id_split_bill = ? ORDER BY id DESC", [data]);

            if (get_split_bill.length !== 0) {
                return {response: true, data: get_split_bill};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getDetailSplitBooking(data):Promise<any> {
        try {
            let service = await dataSource;

            console.log(data);

            const get_split_bill = await service.manager.query("SELECT * FROM split_bill_detail LEFT OUTER JOIN detail_booking ON split_bill_detail.id_detail_booking = detail_booking.id_detail_booking WHERE split_bill_detail.id_split_bill = ? ORDER BY id DESC", [data]);

            if (get_split_bill.length !== 0) {
                return {response: true, data: get_split_bill};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getDetailSplitCafe(data):Promise<any> {
        try {
            let service = await dataSource;

            console.log(data);

            const get_split_bill = await service.manager.query("SELECT * FROM split_bill_detail LEFT OUTER JOIN cart ON split_bill_detail.id_cart = cart.id_cart LEFT OUTER JOIN menu ON menu.id_menu = cart.id_menu WHERE split_bill_detail.id_split_bill = ? ORDER BY id DESC", [data]);

            if (get_split_bill.length !== 0) {
                return {response: true, data: get_split_bill};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getFilterSplitBill(data):Promise<any> {
        try {
            let service = await dataSource;

            const from_date = moment(data.dari_tanggal, "YYYY-MM-DD").format("YYYY-MM-DD")
            const to_date = moment(data.sampai_tanggal, "YYYY-MM-DD").format("YYYY-MM-DD")

            const get_split_bill = await service.manager.query("SELECT *, date(split_bill.created_at) AS date_clean FROM split_bill WHERE date_clean BETWEEN ? AND ?", [from_date, to_date]);
            
            if (get_split_bill.length !== 0) {
                return {response: true, data: get_split_bill};
            } else {
                return {response: false, data: "data is empty"};
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    static async getFilterMonthSplitBill(data):Promise<any> {
        try {
            let service = await dataSource;

            const month =  moment(data.month, "YYYY-MM").format("MM-YYYY");

            const get_split_bill = await service.manager.query("SELECT *, strftime('%m-%Y', split_bill.created_at) AS date_clean FROM split_bill WHERE date_clean = ?", [month]);
            
            if (get_split_bill.length !== 0) {
                return {response: true, data: get_split_bill};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default SplitBillSystem;