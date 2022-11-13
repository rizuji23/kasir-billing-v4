import { dataSource } from "./data-source";
import { Harga_Billing } from "../entity/Harga_Billing";
import { Table_Billiard } from "../entity/Table_Billiard";
import { Booking } from "../entity/Booking";
import 'moment-timezone';
import moment from "moment";
import { Detail_Booking } from "../entity/Detail_Booking";
import { Pesanan } from "../entity/Pesanan";
import { Cart } from "../entity/Cart";
import { Menu } from "electron";
import shortid from 'shortid'

class BillingOperation {
    async checkHarga(durasi:number):Promise<any> {
        try {
            let service = await dataSource;
            const jam = moment().tz("Asia/Jakarta");
            const jam_sekarang = jam.format("HH:mm:ss");
    
            const harga_detail = [];
            var total_harga = 0;
    
                for (var i = 0; i<durasi; i++) {
                    const jam_estimasi = moment().tz("Asia/Jakarta").set('minute', i * 60).format('HH');
                    const jam_full = moment().tz("Asia/Jakarta").set('minute', i * 60).format('HH:mm:ss');
    
                    if (jam_estimasi <= '17') {
                        const result = await service.manager.find(Harga_Billing, {
                            where: {
                                tipe_durasi: "Siang"
                            }
                        });
    
                        harga_detail.push({'tipe': "Siang", harga: result[0].harga, durasi: 1, start_duration: jam_sekarang, end_duration: jam_full})
                        total_harga += result[0].harga;
                    } else if (jam_estimasi >= '17') {
                        const result = await service.manager.find(Harga_Billing, {
                            where: {
                                tipe_durasi: "Malam"
                            }
                        })
    
                        harga_detail.push({'tipe': "Malam", harga: result[0].harga, durasi: 1, start_duration: jam_sekarang, end_duration: jam_full})
                        total_harga += result[0].harga;
    
                    }
                }
            return {'response': true, harga_detail: harga_detail, total_harga: total_harga}
        } catch (err) {
            console.log(err)
            return {'response': false, data: err}
        }
    }

    async inputPrice(data_booking:any):Promise<any> {
        try {
            const date_now =  moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
            const data_price:any = await this.checkHarga(1);
            let service = await dataSource;
            const check_booking = await service.manager.find(Booking, {
                where: {
                    id_booking: data_booking.id_booking
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
                        if (input_detail) {
                            return {'response': true, 'data': 'data is saved'};
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
                        id_booking: check_table[0].id_booking
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
            var get_detail;
            get_detail = await service.manager.find(Detail_Booking, {
                where: {
                    id_booking: id_booking
                }
            });
    
            if (get_detail.length !== 0) {
                return {'response': true, data: get_detail};
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

            var get_detail_pesanan = await service.manager.find(Pesanan, {
                where: {
                    id_booking: id_booking,
                }
            });
    
            if (get_detail_pesanan.length !== 0) {
                // var get_detail_cafe = await service.manager.find(Cart, {
                //     where: {
                //         id_pesanan: get_detail_pesanan[0].id_pesanan,
                //     }
                // });
    
                var get_detail_cafe = await service.manager.createQueryBuilder().select('cart').from(Cart, 'cart').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'menu.id_menu = cart.id_menu').where('cart.id_pesanan = :id_pesanan', {id_pesanan: get_detail_pesanan[0].id_pesanan}).getMany();
    
                if (get_detail_cafe.length !== 0) {
                    return {'response': true, 'data_pesanan': get_detail_pesanan, 'data_cafe': get_detail_cafe};
                } else {
                    return {'response': false, 'data_pesanan': 'data empty', 'data_cafe': 'data empty'}
                }
            } else {
                return {'response': false, 'data_pesanan': 'data empty', 'data_cafe': 'data empty'}
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

}

export default BillingOperation

// const bill = new BillingOperation()
// const data = async () => {
//     console.log(await bill.checkHarga(3))
// }

// data()
