import {app, BrowserWindow, dialog, ipcMain, ipcRenderer, webContents} from 'electron'
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
import StokSystem from './system/StokSystem'
import System from './system/System'
import { SerialPort } from 'serialport'
import LampSystem from './system/LampSystem'
import FilterSystem from './system/FilterSystem'
import ExportSystem from './system/ExportSystem'
import ShiftSystem from './system/ShiftSystem'
import { dataSource } from './system/data-source'
import AdminSystem from './system/AdminSystem'
import AktivitasSystem from './system/AktivitasSystem'


//init MainWindow
let win:any;
const gotTheLock = app.requestSingleInstanceLock();
var printer_list;

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    app.on('ready', async() => {
        win = new BrowserWindow({
             width:800,
             height:600,
             icon:path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
             webPreferences: {
                 nodeIntegration: true,
                 contextIsolation: false,
                 webSecurity: false
             }
         });
     
     
     //    win.loadURL(path.join(__dirname, '..', '..', 'build', 'index.html'))
        console.log((process.env.NODE_ENV || '').trim())

        if ((process.env.NODE_ENV || '').trim() === 'development') {
            win.loadURL('http://localhost:3000');
        } else {
            console.log("in2")
            win.loadURL(path.join(__dirname, '..', 'build', 'index.html'))
        }
     
        win.on('closed', () => {
             win = null;
             app.quit();
             process.exit(1);
         });
     
         win.on('window-all-closed', () => {
             if (process.platform !== "darwin") {
                 app.quit();
             }
         });
     
         win.on("did-finish-load", () => {
             printer_list = win.getPrintersAsync();
         });
     })
}

//init Billing Arduino Port
var billingArduino:any;
var arduino;
let port = "";
System.getSelectedPort().then((result) => {
    if (result.response === true) {
        // default 57600
        arduino = new PortConnect(billingArduino, 57600, "none", true, false, result.data[0].url);
        arduino.getConnect();
        port = result.data[0].url;
    }
});



//set Regular Timer Billing
var table_01_time:any, table_02_time:any, table_03_time:any, table_04_time:any, table_05_time:any, table_06_time:any, table_07_time:any, table_08_time:any, table_09_time:any, table_10_time:any, table_11_time:any, table_12_time:any;

ipcMain.handle("start", async (event, id_table:any, ms_all:any, ms_delay:any, blink:any, stop:any, add_on:any, ms_delay_add:any, ms_add:any, data_booking:any, continuetime:boolean, reset:boolean, startnew:boolean, pindah:boolean) => {
    const getVariableTime = (id) => {
        switch (id) {
            case "table001": {
                return table_01_time;
                break;
            }
    
            case "table002": {
                console.log("IN")
                return table_02_time;
                break;
            }
    
            case "table003": {
                return table_03_time;
                break;
            } 
    
            case "table004": {
                return table_04_time;
                break;
            }
    
            case "table005": {
                return table_05_time;
                break;
            }
    
            case "table006": {
                return table_06_time;
                break;
            }
    
            case "table007": {
                return table_07_time;
                break;
            }
    
            case "table008": {
                return table_08_time;
                break;
            }
    
            case "table009": {
                return table_09_time;
                break;
            }
    
            case "table010": {
                return table_10_time;
                break;
            }
    
            case "table011": {
                return table_11_time;
                break;
            }
    
            case "table012": {
                return table_12_time;
                break;
            }
        }
    }

    const setVariableTime = (id, value) => {
        if (id === "table001") {
            table_01_time = value;
            return true;
        } else if (id === "table002") {
            table_02_time = value;
            return true;
        } else if (id === "table003") {
            table_03_time = value;
            return true;
        }  else if (id === "table004") {
            table_04_time = value;
            return true;
        } else if (id === "table005") {
            table_05_time = value;
            return true;
        } else if (id === "table006") {
            table_06_time = value;
            return true;
        } else if (id === "table007") {
            table_07_time = value;
            return true;
        } else if (id === "table008") {
            table_08_time = value;
            return true;
        } else if (id === "table009") {
            table_09_time = value;
            return true;
        } else if (id === "table010") {
            table_10_time = value;
            return true;
        } else if (id === "table011") {
            table_11_time = value;
            return true;
        } else if (id === "table012") {
            table_12_time = value;
            return true;
        }
    }

    if (id_table === "table001") {
        var table_01;
        if (pindah !== true) {
            table_01 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        }
        if (stop === true) {
            table_01.stopTimer(table_01_time, true)
        } else {
            if (add_on === true) {
                table_01_time = await table_01.addOn(ms_delay_add, ms_add, table_01_time, data_booking);
            } else if (startnew === true) {
                table_01_time = await table_01.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_01_time = await table_01.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_01_time = await table_01.resetTable(data_booking, table_01_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    } else if (id_table === 'table002') {
        const table_02 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_02.stopTimer(table_02_time, true)
        } else {
            if (add_on === true) {
                table_02_time = await table_02.addOn(ms_delay_add, ms_add, table_02_time, data_booking);
            } else if (startnew === true) {
                table_02_time = await table_02.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_02_time = await table_02.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_02_time = await table_02.resetTable(data_booking, table_02_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table003') {
        const table_03 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_03.stopTimer(table_03_time, true)
        } else {
            if (add_on === true) {
                table_03_time = await table_03.addOn(ms_delay_add, ms_add, table_03_time, data_booking);
            } else if (startnew === true) {
                table_03_time = await table_03.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_03_time = await table_03.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_03_time = await table_03.resetTable(data_booking, table_03_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table004') {
        const table_04 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_04.stopTimer(table_04_time, true)
        } else {
            if (add_on === true) {
                table_04_time = await table_04.addOn(ms_delay_add, ms_add, table_04_time, data_booking);
            } else if (startnew === true) {
                table_04_time = await table_04.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_04_time = await table_04.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_04_time = await table_04.resetTable(data_booking, table_04_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table005') {
        const table_05 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_05.stopTimer(table_05_time, true)
        } else {
            if (add_on === true) {
                table_05_time = await table_05.addOn(ms_delay_add, ms_add, table_05_time, data_booking);
            } else if (startnew === true) {
                table_05_time = await table_05.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_05_time = await table_05.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_05_time = await table_05.resetTable(data_booking, table_05_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table006') {
        const table_06 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_06.stopTimer(table_06_time, true)
        } else {
            if (add_on === true) {
                table_06_time = await table_06.addOn(ms_delay_add, ms_add, table_06_time, data_booking);
            } else if (startnew === true) {
                table_06_time = await table_06.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_06_time = await table_06.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_06_time = await table_06.resetTable(data_booking, table_06_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table007') {
        const table_07 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_07.stopTimer(table_07_time, true)
        } else {
            if (add_on === true) {
                table_07_time = await table_07.addOn(ms_delay_add, ms_add, table_07_time, data_booking);
            } else if (startnew === true) {
                table_07_time = await table_07.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_07_time = await table_07.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_07_time = await table_07.resetTable(data_booking, table_07_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table008') {
        const table_08 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_08.stopTimer(table_08_time, true)
        } else {
            if (add_on === true) {
                table_08_time = await table_08.addOn(ms_delay_add, ms_add, table_08_time, data_booking);
            } else if (startnew === true) {
                table_08_time = await table_08.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_08_time = await table_08.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_08_time = await table_08.resetTable(data_booking, table_08_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table009') {
        const table_09 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_09.stopTimer(table_09_time, true)
        } else {
            if (add_on === true) {
                table_09_time = await table_09.addOn(ms_delay_add, ms_add, table_09_time, data_booking);
            } else if (startnew === true) {
                table_09_time = await table_09.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_09_time = await table_09.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_09_time = await table_09.resetTable(data_booking, table_09_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table010') {
        const table_10 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_10.stopTimer(table_10_time, true)
        } else {
            if (add_on === true) {
                table_10_time = await table_10.addOn(ms_delay_add, ms_add, table_10_time, data_booking);
            } else if (startnew === true) {
                table_10_time = await table_10.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_10_time = await table_10.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_10_time = await table_10.resetTable(data_booking, table_10_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table011') {
        const table_11 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_11.stopTimer(table_11_time, true)
        } else {
            if (add_on === true) {
                table_11_time = await table_11.addOn(ms_delay_add, ms_add, table_11_time, data_booking);
            } else if (startnew === true) {
                table_11_time = await table_11.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_11_time = await table_11.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_11_time = await table_11.resetTable(data_booking, table_11_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }  else if (id_table === 'table012') {
        const table_12 = new TableRegular(id_table, ms_all, ms_delay, blink, arduino.path, win);
        if (stop === true) {
            table_12.stopTimer(table_12_time, true)
        } else {
            if (add_on === true) {
                table_12_time = await table_12.addOn(ms_delay_add, ms_add, table_12_time, data_booking);
            } else if (startnew === true) {
                table_12_time = await table_12.startTimer(data_booking);
            }
            
            if (continuetime === true) {
                table_12_time = await table_12.continueTimer(ms_delay, ms_add);
            } else if (reset === true) {
                table_12_time = await table_12.resetTable(data_booking, table_12_time, true)
            } else if (pindah === true) {
                var get_off = getVariableTime(data_booking.id_table_1);
                const table = new TableRegular(data_booking.pindah, ms_all, ms_delay, data_booking.blink, arduino.path, win);
                var get_on = getVariableTime(data_booking.pindah);
                get_on = setVariableTime(data_booking.pindah, await table.pindahMeja(data_booking, get_off));
                if (get_on) {
                    return {response: true, data: "success"};
                } else {
                    return {response: false, data: "failed"};
                }
            }
        }
    }
});

// ipcMain.handle("pindahMeja", async (event, id_table:any, ms_all:any, ms_delay:any, data_booking:any) => {
//     var get_off = getVariableTime(data_booking.id_table_1);
//     console.log(get_off)
//     var get_on = getVariableTime(id_table);
//     const table = new TableRegular(id_table, ms_all, ms_delay, data_booking.blink, arduino.path, win);
//     get_on = await table.pindahMeja(data_booking, get_off);
//     if (get_on) {
//         return {response: true, data: "success"};
//     } else {
//         return {response: false, data: "failed"};
//     }
// });

//set Loss Timer Billing
var table_01_time_loss:any, table_02_time_loss:any, table_03_time_loss:any, table_04_time_loss:any,table_05_time_loss:any, table_06_time_loss:any, table_07_time_loss:any, table_08_time_loss:any, table_09_time_loss:any, table_10_time_loss:any, table_11_time_loss:any, table_12_time_loss:any
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
    } else if (id_table === 'table002') {
        const table_02 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_02.stopTimer(table_02_time_loss, true)
        } else {
            if (start === true) {
                table_02_time_loss = await table_02.startTimer(data_booking);
                console.log(table_02_time_loss)
            } else if (reset === true) {
                await table_02.resetTable(data_booking, table_02_time_loss, true)
                console.log(table_02_time_loss)
            } else if (continuetime === true) {
                table_02_time_loss = await table_02.continueTimerLoss(data_booking);
                console.log(table_02_time_loss)
            }
        }
    } else if (id_table === 'table003') {
        const table_03 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_03.stopTimer(table_03_time_loss, true)
        } else {
            if (start === true) {
                table_03_time_loss = await table_03.startTimer(data_booking);
                console.log(table_03_time_loss)
            } else if (reset === true) {
                await table_03.resetTable(data_booking, table_03_time_loss, true)
                console.log(table_03_time_loss)
            } else if (continuetime === true) {
                table_03_time_loss = await table_03.continueTimerLoss(data_booking);
                console.log(table_03_time_loss)
            }
        }
    } else if (id_table === 'table004') {
        const table_04 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_04.stopTimer(table_04_time_loss, true)
        } else {
            if (start === true) {
                table_04_time_loss = await table_04.startTimer(data_booking);
                console.log(table_04_time_loss)
            } else if (reset === true) {
                await table_04.resetTable(data_booking, table_04_time_loss, true)
                console.log(table_04_time_loss)
            } else if (continuetime === true) {
                table_04_time_loss = await table_04.continueTimerLoss(data_booking);
                console.log(table_04_time_loss)
            }
        }
    }  else if (id_table === 'table005') {
        const table_05 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_05.stopTimer(table_05_time_loss, true)
        } else {
            if (start === true) {
                table_05_time_loss = await table_05.startTimer(data_booking);
                console.log(table_05_time_loss)
            } else if (reset === true) {
                await table_05.resetTable(data_booking, table_05_time_loss, true)
                console.log(table_05_time_loss)
            } else if (continuetime === true) {
                table_05_time_loss = await table_05.continueTimerLoss(data_booking);
                console.log(table_05_time_loss)
            }
        }
    }  else if (id_table === 'table006') {
        const table_06 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_06.stopTimer(table_06_time_loss, true)
        } else {
            if (start === true) {
                table_06_time_loss = await table_06.startTimer(data_booking);
                console.log(table_06_time_loss)
            } else if (reset === true) {
                await table_06.resetTable(data_booking, table_06_time_loss, true)
                console.log(table_06_time_loss)
            } else if (continuetime === true) {
                table_06_time_loss = await table_06.continueTimerLoss(data_booking);
                console.log(table_06_time_loss)
            }
        }
    }  else if (id_table === 'table007') {
        const table_07 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_07.stopTimer(table_07_time_loss, true)
        } else {
            if (start === true) {
                table_07_time_loss = await table_07.startTimer(data_booking);
                console.log(table_07_time_loss)
            } else if (reset === true) {
                await table_07.resetTable(data_booking, table_07_time_loss, true)
                console.log(table_07_time_loss)
            } else if (continuetime === true) {
                table_07_time_loss = await table_07.continueTimerLoss(data_booking);
                console.log(table_07_time_loss)
            }
        }
    } else if (id_table === 'table008') {
        const table_08 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_08.stopTimer(table_08_time_loss, true)
        } else {
            if (start === true) {
                table_08_time_loss = await table_08.startTimer(data_booking);
                console.log(table_08_time_loss)
            } else if (reset === true) {
                await table_08.resetTable(data_booking, table_08_time_loss, true)
                console.log(table_08_time_loss)
            } else if (continuetime === true) {
                table_08_time_loss = await table_08.continueTimerLoss(data_booking);
                console.log(table_08_time_loss)
            }
        }
    } else if (id_table === 'table009') {
        const table_09 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_09.stopTimer(table_09_time_loss, true)
        } else {
            if (start === true) {
                table_09_time_loss = await table_09.startTimer(data_booking);
                console.log(table_09_time_loss)
            } else if (reset === true) {
                await table_09.resetTable(data_booking, table_09_time_loss, true)
                console.log(table_09_time_loss)
            } else if (continuetime === true) {
                table_09_time_loss = await table_09.continueTimerLoss(data_booking);
                console.log(table_09_time_loss)
            }
        }
    }  else if (id_table === 'table010') {
        const table_10 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_10.stopTimer(table_10_time_loss, true)
        } else {
            if (start === true) {
                table_10_time_loss = await table_10.startTimer(data_booking);
                console.log(table_10_time_loss)
            } else if (reset === true) {
                await table_10.resetTable(data_booking, table_10_time_loss, true)
                console.log(table_10_time_loss)
            } else if (continuetime === true) {
                table_10_time_loss = await table_10.continueTimerLoss(data_booking);
                console.log(table_10_time_loss)
            }
        }
    }  else if (id_table === 'table011') {
        const table_11 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_11.stopTimer(table_11_time_loss, true)
        } else {
            if (start === true) {
                table_11_time_loss = await table_11.startTimer(data_booking);
                console.log(table_11_time_loss)
            } else if (reset === true) {
                await table_11.resetTable(data_booking, table_11_time_loss, true)
                console.log(table_11_time_loss)
            } else if (continuetime === true) {
                table_11_time_loss = await table_11.continueTimerLoss(data_booking);
                console.log(table_11_time_loss)
            }
        }
    } else if (id_table === 'table012') {
        const table_12 = new TablePersonal(id_table, arduino.path, win);
        if (stop === true) {
            table_12.stopTimer(table_12_time_loss, true)
        } else {
            if (start === true) {
                table_12_time_loss = await table_12.startTimer(data_booking);
                console.log(table_12_time_loss)
            } else if (reset === true) {
                await table_12.resetTable(data_booking, table_12_time_loss, true)
                console.log(table_12_time_loss)
            } else if (continuetime === true) {
                table_12_time_loss = await table_12.continueTimerLoss(data_booking);
                console.log(table_12_time_loss)
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

ipcMain.handle("getOpen", async(event) => {
    return await arduino.checkOpen(port);
});

ipcMain.handle("reconnectPort", async(event) => {
    return await arduino.reconnectPort();
});

ipcMain.handle("checkHarga", async(event, data) => {
    return await bill.checkHarga(data);
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

ipcMain.handle("inputPrice", async (event, data_booking, shift_now) => {
    return await bill.inputPrice(data_booking, shift_now);
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
});

ipcMain.handle("newBookStok", async (event, day) => {
    return await StokSystem.newBookStok(day);
});

ipcMain.handle("getStok", async(event, day) => {
    return await StokSystem.getStok(day);
});

ipcMain.handle("fetchStokMenu", async(event, data) => {
    return await StokSystem.fetchStokMenu(data);
});

ipcMain.handle("addStokMasuk", async(event, data) => {
    return await StokSystem.addStokMasuk(data);
});

ipcMain.handle("getStokMasuk", async (event) => {
    return await StokSystem.getStokMasuk();
});

ipcMain.handle("getStokKeluar", async (event) => {
    return await StokSystem.getStokKeluar();
});

ipcMain.handle("setShift", async(event, data_shift) => {
    return await System.setShift(data_shift);
});

ipcMain.handle("api", async(event, update, get, data) => {
    if (update === true) {
        return await System.setApi(data);
    } else if (get === true) {
        return await System.getApi();
    } else {
        return {response: false, data: "invalid"};
    }
});


ipcMain.handle("api_printer", async(event, update, get, data) => {
    if (get === true) {
        const printer_list = await win.webContents.getPrintersAsync();
        return await System.getPrinter(printer_list);
    } else if (update === true) {
        return await System.setPrinter(data);
    } else {
        return {response: false, data: "invalid"};
    }
});

ipcMain.handle("getHarga", async(event) => {
    return await BillingOperation.getHarga();
});

ipcMain.handle("checkMember", async(event, data_member) => {
    return await MemberSystem.checkMember(data_member);
});

ipcMain.handle("checkVoucher", async(event, data_voucher) => {
    return await VoucherSystem.checkVoucher(data_voucher);
});

ipcMain.handle("reducePlaying", async(event, data) => {
    return await MemberSystem.reducePlaying(data);
});

ipcMain.handle("getComPort", async (event) => {
    return await SerialPort.list();
});

ipcMain.handle("api_port", async(event, get_data, set_data, data) => {
    if (get_data === true) {
        return await System.getSelectedPort();
    } else if (set_data === true) {
        return await System.setPort(data);
    } else {
        return {response: false, data: "invalid"};
    }
});

ipcMain.handle("lamp", async(event, turn_on, turn_off, id_table) => {
    const lamp = new LampSystem(id_table, arduino.path, win);
    if (turn_on === true) {
        return await lamp.turnOn();
    } else if (turn_off === true) {
        await lamp.turnOff().then((result) => {
            if (result === true) {
                return {response: true, data: "table " + id_table + "dimatikan"};
            } else {
                return {response: false, data: "table " + id_table + "gagal dimatikan"};
            }
        });
    } else {
        return {response: false, data: "invalid"};
    }
});

ipcMain.handle("getVersion", async(event) => {
    return await System.getVersion();
});

ipcMain.handle("printStruk", async(event, id_struk) => {
    return await StrukSystem.print(id_struk);
});

ipcMain.handle("printTemp", async(event, data) => {
    return await StrukSystem.printTemp(data);
})

ipcMain.handle("check_export", async(event, check_today, check_date, check_month, check_year, data) => {
    if (check_today === true) {
        return await FilterSystem.getToday(data);
    } else if (check_date === true) {
        return await FilterSystem.getDate(data);
    } else if (check_month === true) {
        return await FilterSystem.getMonth(data);
    } else if (check_year === true) {
        return await FilterSystem.getYear(data);
    } else {
        return {response: false, data: "invalid"};
    }
});


ipcMain.handle("export", async(event, pdf, struk, data) => {
    if (pdf === true) {
        return await ExportSystem.printPDF(data);
    }
});

ipcMain.handle("getShift", async(event, data) => {
    return await ShiftSystem.getShift(data);
});

ipcMain.handle("getLaporanReset", async(event) => {
    return await Laporan.getLaporanReset();
});

ipcMain.handle("getLaporanBelumBayar", async(event) => {
    return await Laporan.getLaporanBelumBayar();
});

ipcMain.handle("filterByDateBillingReset", async(event, data) => {
    return await FilterTransaksi.filterByDateBillingReset(data);
});

ipcMain.handle("filterByDateBillingBelumBayar", async(event, data) => {
    return await FilterTransaksi.filterByDateBillingBelumBayar(data);
});

ipcMain.handle("getLaporanSplitBill", async(event) => {
    return await SplitBillSystem.getLaporanSplitBill();
});

ipcMain.handle("getDetailSplitBill", async(event, data) => {
    return await SplitBillSystem.getDetailSplitBill(data);
});

ipcMain.handle("getFilterSplitBill", async(event, data) => {
    return await SplitBillSystem.getFilterSplitBill(data);
});

ipcMain.handle("getDetailSplitBooking", async(event, data) => {
    return await SplitBillSystem.getDetailSplitBooking(data);
});

ipcMain.handle("getDetailSplitCafe", async(event, data) => {
    return await SplitBillSystem.getDetailSplitCafe(data);
});

ipcMain.handle("getFilterMonthSplitBill", async(event, data) => {
    return await SplitBillSystem.getFilterMonthSplitBill(data);
});

ipcMain.handle("filterByMonthBilling", async(event, data) => {
    return await FilterTransaksi.filterByMonthBilling(data);
});

ipcMain.handle("filterByMonthCafe", async(event, data) => {
    return await FilterTransaksi.filterByMonthCafe(data);
});

ipcMain.handle("filterByMonthBillingReset", async(event, data) => {
    return await FilterTransaksi.filterByMonthBillingReset(data);
});

ipcMain.handle("filterByMonthBillingBelumBayar", async(event, data) => {
    return await FilterTransaksi.filterByMonthBillingBelumBayar(data);
});

ipcMain.handle("printStok", async(event, data) => {
    return await ExportSystem.printStok(data);
});

ipcMain.handle("changeName", async(event, data) => {
    return await BillingOperation.changeName(data);
});

ipcMain.handle("getShiftAdmin", async(event) => {
    return await AdminSystem.getShiftAdmin();
});

ipcMain.handle("updateShift", async(event, data) => {
    return await AdminSystem.updateShift(data);
});

ipcMain.handle("getHargaBilling", async(event) => {
    return await AdminSystem.getHargaBilling();
});

ipcMain.handle("updateHargaBilling", async(event, data) => {
    return await AdminSystem.updateHargaBilling(data);
});

ipcMain.handle("getHargaMember", async(event) => {
    return await AdminSystem.getHargaMember();
});

ipcMain.handle("updateHargaMember", async(event, data) => {
    return await AdminSystem.updateHargaMember(data);
});

ipcMain.handle("getKeterangan", async(event, data) => {
    return await StokSystem.getKeterangan(data);
});

ipcMain.handle("getRefresh", async(event, data) => {
    return await StokSystem.getRefresh(data);
});

ipcMain.handle("loginAdmin", async(event, data) => {
    return await AdminSystem.loginAdmin(data);
});

ipcMain.handle("getAktivitas", async(event) => {
    return await AktivitasSystem.getAktivitas();
});

ipcMain.handle("addAktivitas", async(event, data) => {
    return await AktivitasSystem.addAktivitas(data);
});

ipcMain.handle("checkingPayTable", async(event, data) => {
    return await BillingOperation.checkingPayTable(data);
});

ipcMain.handle("getStruk", async(event, data) => {
    return await BillingOperation.getStruk(data);
});

ipcMain.handle("fixList", async(event, data) => {
    return await BillingOperation.fixList(data);
});
//endopration