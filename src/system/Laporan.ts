import { Cart } from "../entity/Cart";
import { Detail_Booking } from "../entity/Detail_Booking";
import { Pesanan } from "../entity/Pesanan";
import { Struk } from "../entity/Struk";
import { dataSource } from "./data-source";

class Laporan {
    static async getDataKeuangan():Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.query("SELECT * FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan LEFT OUTER JOIN booking ON struk.id_booking = booking.id_booking WHERE struk.status_struk = ? AND struk.type_struk = ? ORDER BY id DESC", ['lunas', 'table']);

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getLaporanReset():Promise<any> {
        try {
            let service = await dataSource;

            const get_reset = await service.manager.query("SELECT * FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan LEFT OUTER JOIN booking ON struk.id_booking = booking.id_booking WHERE struk.status_struk = ? AND struk.type_struk = ? ORDER BY id DESC", ['reset', 'table']);

            if (get_reset.length !== 0) {
                return {response: true, data: get_reset};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getLaporanBelumBayar():Promise<any> {
        try {
            let service = await dataSource;

            const get_belum = await service.manager.query("SELECT * FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan LEFT OUTER JOIN booking ON struk.id_booking = booking.id_booking WHERE struk.status_struk = ? AND struk.type_struk = ? ORDER BY id DESC", ['belum lunas', 'table']);

            if (get_belum.length !== 0) {
                return {response: true, data: get_belum};
            } else {
                return {response: false, data: "data is empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getDataKeuanganCafe():Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.query("SELECT * FROM struk LEFT OUTER JOIN pesanan ON struk.id_pesanan = pesanan.id_pesanan WHERE struk.status_struk = ? AND struk.type_struk = ? ORDER BY id DESC", ['lunas', 'cafe only']);

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getDataCart(id_cart):Promise<any> {
        try {
            let service = await dataSource;

            const get_cart = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu LEFT OUTER JOIN detail_cafe ON cart.id_menu = detail_cafe.id_menu WHERE cart.id_pesanan = ? ORDER BY cart.id DESC", [id_cart]);

            if (get_cart.length !== 0) {
                return {response: true, data: get_cart};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async getDataDetailBooking(id_booking):Promise<any> {
        try {
            let service = await dataSource;

            const get_detail = await service.manager.find(Detail_Booking, {
                where: {
                    id_booking: id_booking
                }
            });

            if (get_detail.length !== 0) {
                return {response: true, data: get_detail};
            } else {
                return {response: false, data: "data is empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default Laporan;