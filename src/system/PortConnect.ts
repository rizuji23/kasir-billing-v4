import { SerialPort } from 'serialport';
import { Notification } from 'electron';
import * as path from 'path';

class PortConnect {
    path:any;
    baudRate:number;
    parity:any;
    autoOpen:boolean;
    lock:boolean;
    port:string;

    constructor(path:any, baudRate:number, parity:any, autoOpen:boolean, lock:boolean, port:string) {
        this.path = path;
        this.baudRate = baudRate;
        this.parity = parity;
        this.autoOpen = autoOpen;
        this.lock = lock
        this.port = port
    }

   getConnect(): any{
        this.path = new SerialPort({
            path: this.port,
            baudRate: this.baudRate,
            parity: this.parity,
            autoOpen: this.autoOpen,
            lock: this.lock
        });

        this.isOpen();
        this.isClose();
        this.isError();
        return this.path;
    }

    async checkOpen(port) {
        let ports = await SerialPort.list();
        console.log(port);
        const scanner = ports.filter((port: any) => port.path === port);

        if (scanner.length !== 0) {
            return true;
        } else {
            return false;
        }
    }

    isOpen() {
        const notif = new Notification({
            title: "Checking Koneksi...",
            subtitle: `${this.port}`,
            body: `Check Koneksi di port ${this.port}`,
            silent: true,
            icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
        });

        this.path.on("open", () => {
            notif.show();
            setTimeout(() => {
                console.log(this.path.isOpen)
                if (this.path.isOpen === true) {
                    const notif = new Notification({
                        title: "Berhasil terkoneksi...",
                        subtitle: `${this.port}`,
                        body: `Box Billing berhasil terkoneksi di port ${this.port}`,
                        silent: true,
                        icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
                    });

                    notif.show();
                    return true;
                } else {
                    const notif = new Notification({
                        title: "Gagal terkoneksi...",
                        subtitle: `${this.port}`,
                        body: `Box Billing gagal terkoneksi di port ${this.port}`,
                        silent: true,
                        icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
                    });

                    notif.show();
                    return false;
                }
            }, 2000)
        })
        // try {
        //     this.path.on("open", () => {
        //         console.log(`Serial port is connected on ${this.port}`);

        //         return true;
        //     })
        // } catch (err) {
        //     console.log("Port Error ", err);
        // }   
    }

    isClose() {
        this.path.on("close", () => {
            console.log(`Port ${this.port} disconnected`);
            const notif = new Notification({
                title: "Koneksi Terputus...",
                subtitle: `${this.port}`,
                body: `Box Billing terputus port ${this.port}`,
                silent: true,
                icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
            });

            notif.show();
            return true;
        })
    }

    isError() {
        this.path.on("error", (err:any) => {
            console.log("error", err);
            const notif = new Notification({
                title: "Port Error...",
                subtitle: `${this.port}`,
                body: `Box Billing terjadi error ${err}`,
                silent: true,
                icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
            });

            notif.show();
            return true;
        })
    }

    closePort(){
        console.log("this.path.port.close()", this.path.port.close())
        return this.path.port.close();
    }

    reconnectPort() {
        console.log("INITIATING RECONNECT");
            const notif = new Notification({
                title: "INITIATING RECONNECT",
                subtitle: `${this.port}`,
                body: `INITIATING RECONNECT ${this.port}`,
                silent: true,
                icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
            });

            notif.show();
            this.closePort();
            setTimeout(() => {
                const data = this.getConnect();
                console.log("data", data);
                return data;

            }, 2000)
    }

    // onLamp(code:string) {
    //     this.path.write(code, (err:any, result:any) => {
    //         if (err) throw err;
    //         console.log(result);
    //     });
    // }
}

export default PortConnect;