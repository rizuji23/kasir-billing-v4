import {app, BrowserWindow, dialog, ipcMain, ipcRenderer} from 'electron'
import * as url from 'url'
import * as path from 'path'
import PortConnect from './system/PortConnect'
import {TableRegular, TablePersonal} from './system/Table'
import Auth from './system/Auth';
import BillingOperation from './system/BillingOpration'
import WaitingListSystem from './system/WaitingListSystem'
import MemberSystem from './system/MemberSystem'
import MenuSystem from './system/MenuSystem'
import KategoriMenuSystem from './system/KategoriMenuSystem'
import CartSystem from './system/CartSystem'
import StrukSystem from './system/StrukSystem'
import SplitBillSystem from './system/SplitBillSystem'
import Laporan from './system/Laporan'
import FilterTransaksi from './component/keuangan/system/FilterTransaksi'
import VoucherSystem from './system/VoucherSystem'
import LaporanShift from './system/LaporanShift'
import FilterTransaksiShift from './component/keuangan/system/FilterTransaksiShift'
import AnalisisSystem from './system/AnalisisSystem'


// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User_Kasir()
//     user.id_user = "TEST"
//     user.nama = "Aye Shabira"
//     user.username = "aye"
//     user.password = "password"
//     user.jabatan = "Kasir"
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User_Kasir)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))


//init MainWindow
let win:any;
const gotTheLock = app.requestSingleInstanceLock();
app.on('ready', () => {
   win = new BrowserWindow({
        width:800,
        height:600,
        icon:path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    })

//    win.loadURL(path.join(__dirname, '..', '..', 'build', 'index.html'))
   win.loadURL('http://localhost:3000')

   win.on('closed', () => {
       win = null;
        app.quit();
        process.exit(1)
    })
})

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (win) {
            if (win.isMinimized())win.restore();
           win.focus();
        }
    })
}

ipcMain.handle("get_data",async (event) => {
    return "HEHEHE";
})

//init Billing Arduino Port
var billingArduino:any;
const arduino = new PortConnect(billingArduino, 57600, "none", true, false, "COM3");
arduino.getConnect()
arduino.isOpen()

//set Regular Timer Billing
var table_01_time:any, table_02_time:any, table_03_time:any

ipcMain.handle("start", async (event, id_table:any, ms_all:any, ms_delay:any, blink:any, stop:any, add_on:any, ms_delay_add:any, ms_add:any, data_booking:any, continuetime:boolean, reset:boolean, startnew:boolean) => {
    if (id_table === "table001") {
        const table_01 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_01.stopTimer(table_01_time, true)
        } else {
            if (add_on === true) {
                table_01_time = await table_01.addOn(ms_delay_add, ms_add, data_booking);
            } else if (startnew === true) {
                table_01_time = await table_01.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_01_time = await table_01.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                console.log('test')
                table_01_time = await table_01.resetTable(data_booking, table_01_time, true)
            }
        }
    } else if (id_table === 'table002') {
        const table_02 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_02.stopTimer(table_02_time, true)
        } else {
            if (add_on === true) {
                table_02_time = await table_02.addOn(ms_delay_add, ms_add, data_booking);
            } else if (startnew === true) {
                table_02_time = await table_02.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_02_time = await table_02.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                console.log('test')
                table_02_time = await table_02.resetTable(data_booking, table_02_time, true)
            }
        }
    }
});

//set Loss Timer Billing
var table_01_time_loss:any
ipcMain.handle('start_loss', async(event, id_table, start, stop, data_booking, reset, continuetime) => {
    if (id_table === 'table001') {
        const table_01 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_01.stopTimer(table_01_time_loss, true)
        } else {
            if (start === true) {
                table_01_time_loss = await table_01.startTimer(data_booking);
                console.log(table_01_time_loss)
            } else if (reset === true) {
                await table_01.resetTable(data_booking, table_01_time_loss, true)
                console.log(table_01_time_loss)
            } else if (continuetime === true) {
                table_01_time_loss = await table_01.continueTimerLoss(data_booking);
                console.log(table_01_time_loss)
            }
        }
    }
});
//end loss

//operation
const bill = new BillingOperation();
ipcMain.handle("login",async (event, username, password) => {
    const data_user = new Auth(username, password);
    return await data_user.goAuth()
});

ipcMain.handle("checkHarga", async(event, durasi) => {
    return await bill.checkHarga(durasi);
});

ipcMain.handle("getDataTable", async (event, id_table) => {
    return await bill.getDataTable(id_table);
});

ipcMain.handle("getAllTable", async (event, all) => {
    return await bill.getAllTable(all);
});

ipcMain.handle("getCafeDetail", async (event, id_booking) => {
    return await bill.getCafeDetail(id_booking);
});

ipcMain.handle("getDetailPriceBill", async (event, id_booking) => {
    return await bill.getDetailPriceBill(id_booking);
});

ipcMain.handle("inputPrice", async (event, data_booking) => {
    return await bill.inputPrice(data_booking);
});

ipcMain.handle("getActiveTable", async (event) => {
    return await BillingOperation.getActiveTable();
});

ipcMain.handle("sendPayNow", async (event, data_pay) => {
    return await BillingOperation.sendPayNow(data_pay);
});

ipcMain.handle("waitinglist", async (event, get_data, add_new, delete_waiting, id_waiting, data_waiting) => {
    if (add_new === true) {
        return await WaitingListSystem.addDataWaiting(data_waiting);
    } else if (delete_waiting === true) {
        return await WaitingListSystem.deleteDataWaiting(id_waiting);
    } else if (get_data === true) {
        return await WaitingListSystem.getDataWaiting();
    }
});

ipcMain.handle("member", async (event, get_data, get_price, add_new, delete_member, data_member, update_member, get_by_id) => {
    if (get_data === true) {
        return await MemberSystem.getAllMember();
    } else if (get_price === true) {
        return await MemberSystem.getPriceMember(data_member);
    } else if (add_new === true) {
        return await MemberSystem.addMember(data_member);
    } else if (delete_member === true) {
        return await MemberSystem.deleteMember(data_member);
    } else if (update_member === true) {
        return await MemberSystem.editMember(data_member);
    } else if (get_by_id === true) {
        return await MemberSystem.getDataById(data_member);
    } else {
        return {response: false, data: "error brow"};
    }
});

ipcMain.handle("menu", async (event, get_all, add_new, edit_menu, delete_menu, data_menu) => {
    if (add_new === true) {
        return MenuSystem.addMenu(data_menu);
    } else if (edit_menu === true) {
        return MenuSystem.editMenu(data_menu);
    } else if (delete_menu === true) {
        return MenuSystem.deleteMenu(data_menu);
    } else if (get_all === true) {
        return MenuSystem.getDataMenu();
    } else {
        return {response: false, data: "data is not availabe"};
    }
});

ipcMain.handle("kategori_menu", async (event, get_all, add_new, edit_kategori, delete_kategori, data_kategori) => {
    if (add_new === true) {
        return KategoriMenuSystem.addKategoriMenu(data_kategori);
    } else if (edit_kategori === true) {
        return KategoriMenuSystem.editKategoriMenu(data_kategori);
    } else if (delete_kategori === true) {
        return KategoriMenuSystem.deleteKategoriMenu(data_kategori);
    } else if (get_all === true) {
        return KategoriMenuSystem.getKategoriMenu();
    } else {
        return {response: false, data: "data is not available"};
    }
});

ipcMain.handle("pesanan", async (event, get_cart, add_cart, edit_cart, delete_cart, cancel_cart, addPesananCafeOnly, addPesananTable, data_cart) => {
    if (get_cart === true) {
        return await CartSystem.getCart();
    } else if (add_cart === true) {
        return await CartSystem.addCart(data_cart);
    } else if (edit_cart === true) {
        return await CartSystem.editCart(data_cart);
    } else if (delete_cart === true) {
        return await CartSystem.deleteCart(data_cart);
    } else if (cancel_cart === true) {
        return await CartSystem.cancelPesanan();
    } else if (addPesananCafeOnly === true) {
        return await CartSystem.addPesananCafeOnly(data_cart);
    } else if (addPesananTable === true) {
        return await CartSystem.addPesananTable(data_cart);
    } else {
        return {response:false, data: 'paramater is not valid'};
    }
});

ipcMain.handle("pesanan_edit", async (event, edit_cart, delete_cart, data_cart) => {
    if (edit_cart === true) {
        return await CartSystem.editCartTable(data_cart);
    } else if (delete_cart === true) {
        return await CartSystem.deleteCartTable(data_cart);
    }
});

ipcMain.handle("split_bill", async (event, data_bill) => {
    return await SplitBillSystem.addSplit(data_bill);
});


// Laporan
ipcMain.handle("keuangan", async (event, get_keuangan, get_cart, get_detail_booking, data_keuangan) => {
    if (get_keuangan === true) {
        return await Laporan.getDataKeuangan();
    } else if (get_cart === true) {
        return await Laporan.getDataCart(data_keuangan);
    } else if (get_detail_booking === true) {
        return await Laporan.getDataDetailBooking(data_keuangan);
    }
});

ipcMain.handle("keuangan_cafe", async (event) => {
    return await Laporan.getDataKeuanganCafe();
});

ipcMain.handle("keuangan_cafe_shift", async (event) => {
    return await LaporanShift.getDataKeuanganCafe();
});

ipcMain.handle("filterByDateBilling", async(event, data_keuangan) => {
    return await FilterTransaksi.filterByDateBilling(data_keuangan);
});

ipcMain.handle("filterByDateCafe", async (event, data_keuangan) => {
    return await FilterTransaksi.filterByDateCafe(data_keuangan);
});

ipcMain.handle("filterByDateBillingShift", async(event, data_keuangan) => {
    return await FilterTransaksiShift.filterByDateBilling(data_keuangan);
});

ipcMain.handle("filterByDateCafeShift", async (event, data_keuangan) => {
    return await FilterTransaksiShift.filterByDateCafe(data_keuangan);
});

ipcMain.handle("voucher", async (event, getData, insertData, updateData, deleteData, data_voucher) => {
    if (getData === true) {
        return await VoucherSystem.getDataVoucher();
    } else if (insertData === true) {
        return await VoucherSystem.addVoucher(data_voucher);
    } else if (updateData === true) {
        return await VoucherSystem.editVoucher(data_voucher);
    } else if (deleteData === true) {
        return await VoucherSystem.deleteVoucher(data_voucher);
    } else {
        return {response: false, data: "data is not valid!"};
    }
});

ipcMain.handle("keuangan_shift", async (event) => {
    return await LaporanShift.getDataBilling();
});

//route main Analisis
ipcMain.handle("getPendapatan", async(event, filter, data) => {
    return await AnalisisSystem.getPendapatan(filter, data);
});

ipcMain.handle("getPendapatanMonth", async(event, data_month) => {
    return await AnalisisSystem.getPendapatanPerbulan(data_month);
});

ipcMain.handle("getPendapatanKuartal", async(event, data_year) => {
    return await AnalisisSystem.getPendapatanKuartal(data_year);
})

//endopration