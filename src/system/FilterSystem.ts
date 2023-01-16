import moment from "moment";
import 'moment-timezone';
import { dataSource } from "./data-source";
import { Struk } from "../entity/Struk";
import { Booking } from "../entity/Booking";
import { Detail_Booking } from "../entity/Detail_Booking";
import { Pesanan } from "../entity/Pesanan";
import { Cart } from "../entity/Cart";
import { Menu } from "../entity/Menu";
import { Detail_Cafe } from "../entity/Detail_Cafe";

class FilterSystem {
    static async getToday(data):Promise<any> {
        try {
            let service = await dataSource;
            const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
            var get_data;

            if (data.shift === "Semua") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) = :today', {today: today}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Pagi") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) = :today', {today: today}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start}).andWhere("strftime('%H', struk.created_at) < :end", {end: data.end}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Malam") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) = :today', {today: today}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start}).orWhere("strftime('%H', struk.created_at) < :end", {end: data.end}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            }
            

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
            const from_date = moment(data.start, "YYYY-MM-DD").format("YYYY-MM-DD")
            const to_date = moment(data.end, "YYYY-MM-DD").format("YYYY-MM-DD")

            var get_data;

            if (data.shift === "Semua") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) BETWEEN :start AND :end', {start: from_date, end: to_date}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Pagi") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) >= :start', {start: from_date, end: to_date}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start_time}).andWhere("strftime('%H', struk.created_at) < :end", {start: data.end_time}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Malam") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) >= :start', {start: from_date, end: to_date}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start_time}).orWhere("strftime('%H', struk.created_at) < :end", {end: data.end_time}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            }


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

            const month = moment(data.month, "YYYY-MM").format("MM-YYYY");

            var get_data;

            if (data.shift === "Semua") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%m-%Y', struk.created_at) = :month", {month: month}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Pagi") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%m-%Y', struk.created_at) = :month", {month: month}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start}).andWhere("strftime('%H', struk.created_at) < :end", {end: data.end}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Malam") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%m-%Y', struk.created_at) = :month", {month: month}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start}).orWhere("strftime('%H', struk.created_at) < :end", {end: data.end}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            }

            

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

            var get_data;

            if (data.shift === "Semua") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%Y', struk.created_at) = :data", {data: data.year}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Pagi") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%Y', struk.created_at) = :data", {data: data.year}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start}).andWhere("strftime('%H', struk.created_at) < :end", {end: data.end}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            } else if (data.shift === "Malam") {
                get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%Y', struk.created_at) = :data", {data: data.year}).andWhere("strftime('%H', struk.created_at) >= :start", {start: data.start}).orWhere("strftime('%H', struk.created_at) < :end", {end: data.end}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();
            }
            
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