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
import { Split_Bill } from "../entity/Split_Bill";
import { Split_Bill_Detail } from "../entity/Split_Bill_Detail";

class FilterSystem {
    static async getToday(data):Promise<any> {
        try {
            let service = await dataSource;
            const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
            var get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) = :today', {today: today}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            const get_split = await service.manager.createQueryBuilder().select('split_bill').from(Split_Bill, 'split_bill').leftJoinAndMapMany('split_bill.id_split_bill', Split_Bill_Detail, 'split_bill_detail', 'split_bill.id_split_bill = split_bill_detail.id_split_bill').leftJoinAndMapOne('split_bill_detail.id_cart', Cart, 'cart', 'split_bill_detail.id_cart = cart.id_cart').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'menu.id_menu = detail_cafe.id_menu').leftJoinAndMapOne('split_bill_detail.id_detail_booking', Detail_Booking, 'detail_booking', 'split_bill_detail.id_detail_booking = detail_booking.id_detail_booking').where('date(split_bill.created_at) = :today', {today: today}).getMany();

            var data_result = [];
            var data_split = [];

            // start_time: "",
            // end_time: "",
            if (data.shift === "Pagi") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] && time < data.end.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] && time < data.end.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Malam") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] || time < data.end.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] || time < data.end.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Semua") {
                get_data.map((el) => {
                    data_result.push(el);
                });

                get_split.map((el) => {
                    data_split.push(el);
                });
            }

            

            if (data_result.length !== 0) {
                return {response: true, data: data_result, data_split: data_split};
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

            var get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where('date(struk.created_at) BETWEEN :start AND :end', {start: from_date, end: to_date}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            const get_split = await service.manager.createQueryBuilder().select('split_bill').from(Split_Bill, 'split_bill').leftJoinAndMapMany('split_bill.id_split_bill', Split_Bill_Detail, 'split_bill_detail', 'split_bill.id_split_bill = split_bill_detail.id_split_bill').leftJoinAndMapOne('split_bill_detail.id_cart', Cart, 'cart', 'split_bill_detail.id_cart = cart.id_cart').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'menu.id_menu = detail_cafe.id_menu').leftJoinAndMapOne('split_bill_detail.id_detail_booking', Detail_Booking, 'detail_booking', 'split_bill_detail.id_detail_booking = detail_booking.id_detail_booking').where('date(split_bill.created_at) BETWEEN :start AND :end', {start: from_date, end: to_date}).getMany();

            console.log("get_split", get_split)

            var data_result = [];
            var data_split = [];
            // start_time: "",
            // end_time: "",
            if (data.shift === "Pagi") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start_time.split(':')[0] && time < data.end_time.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start_time.split(':')[0] && time < data.end_time.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Malam") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start_time.split(':')[0] || time < data.end_time.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start_time.split(':')[0] || time < data.end_time.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Semua") {
                get_data.map((el) => {
                    data_result.push(el);
                });

                get_split.map((el) => {
                    data_split.push(el);

                });
            }


            if (data_result.length !== 0) {
                return {response: true, data: data_result, data_split: data_split};
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

            var get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%m-%Y', struk.created_at) = :month", {month: month}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            const get_split = await service.manager.createQueryBuilder().select('split_bill').from(Split_Bill, 'split_bill').leftJoinAndMapMany('split_bill.id_split_bill', Split_Bill_Detail, 'split_bill_detail', 'split_bill.id_split_bill = split_bill_detail.id_split_bill').leftJoinAndMapOne('split_bill_detail.id_cart', Cart, 'cart', 'split_bill_detail.id_cart = cart.id_cart').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'menu.id_menu = detail_cafe.id_menu').leftJoinAndMapOne('split_bill_detail.id_detail_booking', Detail_Booking, 'detail_booking', 'split_bill_detail.id_detail_booking = detail_booking.id_detail_booking').where("strftime('%m-%Y', split_bill.created_at) = :month", {month: month}).getMany();

            var data_result = [];
            var data_split = [];
            // start_time: "",
            // end_time: "",
            if (data.shift === "Pagi") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] && time < data.end.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] && time < data.end.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Malam") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] || time < data.end.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] || time < data.end.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Semua") {
                get_data.map((el) => {
                    data_result.push(el);
                });

                get_split.map((el) => {
                    data_split.push(el);
                });
            }

            if (data_result.length !== 0) {
                return {response: true, data: data_result, data_split: data_split};
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

            var get_data = await service.manager.createQueryBuilder().select('struk').from(Struk, 'struk').leftJoinAndMapOne('struk.id_booking', Booking, 'booking', 'booking.id_booking = struk.id_booking').leftJoinAndMapMany('booking.id_booking', Detail_Booking, 'detail_booking', 'detail_booking.id_booking = booking.id_booking').leftJoinAndMapOne('struk.id_pesanan', Pesanan, 'pesanan', 'pesanan.id_pesanan = struk.id_pesanan').leftJoinAndMapMany('pesanan.id_pesanan', Cart, 'cart', 'cart.id_pesanan = pesanan.id_pesanan').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'detail_cafe.id_menu = menu.id_menu').where("strftime('%Y', struk.created_at) = :data", {data: data.year}).andWhere('struk.status_struk = :status', {status: 'lunas'}).getMany();

            const get_split = await service.manager.createQueryBuilder().select('split_bill').from(Split_Bill, 'split_bill').leftJoinAndMapMany('split_bill.id_split_bill', Split_Bill_Detail, 'split_bill_detail', 'split_bill.id_split_bill = split_bill_detail.id_split_bill').leftJoinAndMapOne('split_bill_detail.id_cart', Cart, 'cart', 'split_bill_detail.id_cart = cart.id_cart').leftJoinAndMapOne('cart.id_menu', Menu, 'menu', 'cart.id_menu = menu.id_menu').leftJoinAndMapOne('menu.id_menu', Detail_Cafe, 'detail_cafe', 'menu.id_menu = detail_cafe.id_menu').leftJoinAndMapOne('split_bill_detail.id_detail_booking', Detail_Booking, 'detail_booking', 'split_bill_detail.id_detail_booking = detail_booking.id_detail_booking').where("strftime('%Y', split_bill.created_at) = :data", {data: data.year}).getMany();

            var data_result = [];
            var data_split = [];
            // start_time: "",
            // end_time: "",
            if (data.shift === "Pagi") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] && time < data.end.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] && time < data.end.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Malam") {
                get_data.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] || time < data.end.split(':')[0]) {
                        data_result.push(el);
                    }
                });

                get_split.map((el) => {
                    const time = moment(el.created_at, "YYYY-MM-DD HH:mm:ss").format("HH");
                    if (time >= data.start.split(':')[0] || time < data.end.split(':')[0]) {
                        data_split.push(el);
                    }
                });
            } else if (data.shift === "Semua") {
                get_data.map((el) => {
                    data_result.push(el);
                });

                get_split.map((el) => {
                    data_split.push(el);
                });
            }
            
            if (data_result.length !== 0) {
                return {response: true, data: data_result, data_split: data_split};
            } else {
                return {response: false, data: "data empty"};
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default FilterSystem;