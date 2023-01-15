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
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export default ExportSystem;