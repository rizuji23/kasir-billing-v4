import { Cart } from "../entity/Cart";
import { Detail_Booking } from "../entity/Detail_Booking";
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

    static async getDataCart(id_cart):Promise<any> {
        try {
            let service = await dataSource;

            const get_cart = await service.manager.find(Cart, {
                where: {
                    id_cart: id_cart
                }
            });

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