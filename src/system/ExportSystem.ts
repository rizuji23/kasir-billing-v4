import { BrowserWindow } from "electron";
import moment from "moment";
import 'moment-timezone';

class ExportSystem {
    static async printPDF(data_transaksi):Promise<any> {
        try {
            let printWindow = new BrowserWindow({
                show: true,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            });

            printWindow.loadFile('../../public/printPdf.html');
            printWindow.webContents.on('did-finish-load', () => {
                printWindow.webContents.send("message", JSON.stringify(data_transaksi));
                printWindow.webContents.print({
                    silent: false,
                    printBackground: true,
                    copies: 1,
                    margins: {
                        marginType: "none"
                    },
                    pageSize: 'A4'
                }, () => {
                    return {response: true, data: "printed"};  
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    static async printStok(data_stok):Promise<any> {
        try {
            let printWindow = new BrowserWindow({
                show: true,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            });

            printWindow.loadFile('../../public/printStok.html');
            printWindow.webContents.on('did-finish-load', () => {
                printWindow.webContents.send("message", JSON.stringify(data_stok));
                printWindow.webContents.print({
                    silent: false,
                    printBackground: true,
                    copies: 1,
                    margins: {
                        marginType: "none"
                    },
                    pageSize: 'A4',
                    landscape: true,
                }, () => {
                    return {response: true, data: "printed"};  
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export default ExportSystem;