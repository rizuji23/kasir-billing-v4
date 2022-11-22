import {BrowserWindow, ipcMain} from 'electron'
import * as url from 'url'
import * as path from 'path'
import { dataSource } from './data-source'
import { Struk } from '../entity/Struk';
import { Cart } from '../entity/Cart';

class StrukSystem {
    static async print(id_struk:string) {
        try {
            let printWindow = new BrowserWindow({
                show: true,
                webPreferences: {
                  nodeIntegration: true,
                  contextIsolation: false,
                },
            });
            let service = await dataSource;
            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_struk: id_struk
                }
            });

            if (check_struk.length !== 0) {
                const cart = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu WHERE cart.id_pesanan=? ORDER BY cart.id DESC", [check_struk[0].id_pesanan]);

                if (cart.length !== 0) {
                    const data_struk = {
                        response: true,
                        cart: cart,
                        struk: check_struk
                    }

                    printWindow.loadFile('../../public/struk.html');
                    printWindow.webContents.on('did-finish-load', () => {
                        printWindow.webContents.send('message', JSON.stringify(data_struk));
                        printWindow.webContents.print({
                            silent: false,
                            printBackground: true,
                            copies: 1,
                            margins: {
                            marginType: "none",
                            },
                        });
                    });
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async getPrintData(id_struk:string):Promise<any> {
        try {
            let service = await dataSource;
            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_struk: id_struk
                }
            });

            if (check_struk.length !== 0) {
                const cart = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu WHERE cart.id_pesanan=? ORDER BY cart.id DESC", [check_struk[0].id_pesanan]);

                if (cart.length !== 0) {
                    const data_struk = {
                        response: true,
                        cart: cart,
                        struk: check_struk
                    }
            

                    return JSON.stringify(data_struk);

                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    
}

export default StrukSystem