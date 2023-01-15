import moment from "moment";
import 'moment-timezone';
import { dataSource } from "./data-source";
import { Struk } from "../entity/Struk";
import { Booking } from "../entity/Booking";
import { Detail_Booking } from "../entity/Detail_Booking";
import { Pesanan } from "../entity/Pesanan";
import { Cart } from "../entity/Cart";
import { Menu } from "../entity/Menu";

class FilterSystem {
    static async getToday():Promise<any> {
        try {
            let service = await dataSource;
            const today = moment().tz("Asia/Jakarta").format("DD-MM-YYYY")

            const get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').where('substr(struk.created_at, 1, 10) = :today', {today: today}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getDate(data):Promise<any> {
        try {
            let service = await dataSource;
            const from_date = moment(data.start, "YYYY-MM-DD").format("DD-MM-YYYY")
            const to_date = moment(data.end, "YYYY-MM-DD").format("DD-MM-YYYY")

            const get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').where('substr(struk.created_at, 1, 10) BETWEEN :start AND :end', {start: from_date, end: to_date}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();


            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getMonth(data):Promise<any> {
        try {
            let service = await dataSource;

            const month = moment(data, "YYYY-MM").format("MM-YYYY");

            const get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').where('substr(struk.created_at, 4, 7) = :month', {month: month}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data empty"};
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async getYear(data):Promise<any> {
        try {
            let service = await dataSource;

            const get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').where('substr(struk.created_at, 7, 4) = :data', {data: data}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            if (get_data.length !== 0) {
                return {response: true, data: get_data};
            } else {
                return {response: false, data: "data empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default FilterSystem;