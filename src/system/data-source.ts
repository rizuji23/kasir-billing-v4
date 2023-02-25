import { DataSource, Table } from "typeorm"
import { User_Kasir } from "../entity/User_Kasir"
import { Booking } from "../entity/Booking"
import { Cart } from "../entity/Cart"
import { Detail_Booking } from "../entity/Detail_Booking"
import { Detail_Cafe } from "../entity/Detail_Cafe"
import { Harga_Billing } from "../entity/Harga_Billing"
import { Kategori_Menu } from "../entity/Kategori_Menu"
import { Menu } from "../entity/Menu"
import { Pesanan } from "../entity/Pesanan"
import { Settings } from "../entity/Settings"
import { Struk } from "../entity/Struk"
import { Table_Billiard } from "../entity/Table_Billiard"
import { Waiting_List } from "../entity/Waiting_List"
import { Harga_Member } from "../entity/Harga_Member"
import { Member } from "../entity/Member"
import { Split_Bill } from "../entity/Split_Bill"
import { Split_Bill_Detail } from "../entity/Split_Bill_Detail"
import { Voucher } from "../entity/Voucher"
import { Stok_Main } from "../entity/Stok_Main"
import { Stok_Masuk } from "../entity/Stok_Masuk"
import { Stok_Keluar } from "../entity/Stok_Keluar"
import { Shift } from "../entity/Shift"
import Keterangan from "./Keterangan"
import { Aktivitas } from "../entity/Aktivitas"

const AppDataSource = async () => {
    const dataSourceConn = new DataSource({
        type: "sqlite",
        database: "./kasirv3_ori.sqlite",
        synchronize: true,
        logging: false,
        entities: [
            User_Kasir,
            Booking,
            Cart,
            Detail_Booking,
            Detail_Cafe,
            Harga_Billing,
            Kategori_Menu,
            Menu,
            Pesanan,
            Settings,
            Struk,
            Table_Billiard,
            Waiting_List,
            Harga_Member,
            Member,
            Split_Bill,
            Split_Bill_Detail,
            Voucher,
            Stok_Main,
            Stok_Masuk,
            Stok_Keluar,
            Shift,
            Keterangan,
            Aktivitas,
        ],
        migrations: [
            "./src/migrations/**/*.ts"
        ],
        subscribers: [
            "./src/subscriber/**/*.ts"
        ],
    })

    try {
        await dataSourceConn.initialize();
        console.log("Data Source has been initialized!");
        return dataSourceConn;
    } catch (err) {
        console.error("Error during Data Source initialization", err);        
    }
}

export const dataSource = AppDataSource();
