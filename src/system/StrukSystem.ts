import {BrowserWindow, ipcMain} from 'electron'
import * as url from 'url'
import * as path from 'path'
import { dataSource } from './data-source'
import { Struk } from '../entity/Struk';
import { Cart } from '../entity/Cart';
import { Detail_Booking } from '../entity/Detail_Booking';
import { Booking } from '../entity/Booking';
import moment from 'moment';
import 'moment-timezone';
import System from './System';
import { Pesanan } from '../entity/Pesanan';

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

                const billing = await service.manager.query("SELECT * FROM booking LEFT OUTER JOIN detail_booking ON booking.id_booking = detail_booking.id_booking WHERE booking.id_booking=? AND detail_booking.status=? ORDER BY booking.id DESC", [check_struk[0].id_booking, 'active']);

                    const data_struk = {
                        response: true,
                        cart: cart,
                        struk: check_struk,
                        billing: billing
                    }

                    printWindow.loadFile('../../public/struk.html');
                    printWindow.webContents.on('did-finish-load', () => {
                        
                        printWindow.webContents.send('message', JSON.stringify(data_struk));
                        System.getPrinter([]).then((result) => {
                            printWindow.webContents.print({
                                silent: true,
                                printBackground: true,
                                copies: 1,
                                deviceName: result.data[0].url,
                                margins: {
                                marginType: "none",
                                },
                            });
                        });
                    });
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async printBilling(id_struk, data_pay):Promise<any> {
        try {
            let printWindow = new BrowserWindow({
                show: true,
                webPreferences: {
                  nodeIntegration: true,
                  contextIsolation: false,
                },
            });
            const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");

            let service = await dataSource;
            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_struk: id_struk
                }
            });

            if (check_struk.length !== 0) {
                const cart = await service.manager.query("SELECT * FROM cart LEFT OUTER JOIN menu ON cart.id_menu = menu.id_menu WHERE cart.id_pesanan=? AND cart.status=? ORDER BY cart.id DESC", [check_struk[0].id_pesanan, 'belum dibayar']);

                const billing = await service.manager.query("SELECT * FROM booking LEFT OUTER JOIN detail_booking ON booking.id_booking = detail_booking.id_booking WHERE booking.id_booking=? AND detail_booking.status=? ORDER BY booking.id DESC", [check_struk[0].id_booking, 'active']);

                    const data_struk = {
                        response: true,
                        cart: cart,
                        struk: check_struk,
                        billing: billing
                    }

                    const update_detail_booking = await service.manager.createQueryBuilder().update(Detail_Booking).set({
                        status: 'lunas',
                        updated_at: date_now,
                    }).where('id_booking = :id', {id: data_pay.id_booking}).execute();
    
                    const update_booking = await service.manager.createQueryBuilder().update(Booking).set({
                        status_booking: 'lunas',
                        updated_at: date_now,
                    }).where('id_booking = :id', {id: data_pay.id_booking}).execute();

                    const update_cart = await service.manager.createQueryBuilder().update(Cart).set({
                        status: 'lunas',
                        updated_at: date_now,
                    }).where('id_pesanan = :id', {id: data_pay.id_pesanan}).execute();
        
                    const update_pesanan = await service.manager.createQueryBuilder().update(Pesanan).set({
                        status: 'lunas',
                        updated_at: date_now
                    }).where('id_pesanan = :id', {id: data_pay.id_pesanan}).execute();

                    printWindow.loadFile('../../public/struk.html');
                    printWindow.webContents.on('did-finish-load', () => {
                        printWindow.webContents.send('message', JSON.stringify(data_struk));
                        System.getPrinter([]).then((result) => {
                            printWindow.webContents.print({
                                silent: true,
                                printBackground: true,
                                copies: 1,
                                deviceName: result.data[0].url,
                                margins: {
                                marginType: "none",
                                },
                            });
                        });
                    });
            }
            
        } catch (err) {
            console.log(err);
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