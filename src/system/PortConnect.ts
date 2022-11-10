import { SerialPort } from 'serialport';
import { Notification } from 'electron';
import * as path from 'path'

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
        return this.path;
    }

    isOpen() {
        this.path.on("open", () => {
            console.log(`Serial port is connected on ${this.port}`);
            const notif = new Notification({
                title: "Berhasil terkoneksi...",
                subtitle: `${this.port}`,
                body: `Box Billing berhasil terkoneksi di port ${this.port}`,
                silent: true,
                icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
            });

            notif.show();
            return true;
        })
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
        setTimeout(() => {
            this.getConnect();
            console.log("RECONNECTING TO ARDUINO");
            const notif = new Notification({
                title: "RECONNECTING TO ARDUINO",
                subtitle: `${this.port}`,
                body: `RECONNECTING TO ARDUINO ${this.port}`,
                silent: true,
                icon: path.join(__dirname, '..', '/public/assets/img/icon-desktop.png'),
            });
    
            notif.show();
        }, 2000);
    }

    // onLamp(code:string) {
    //     this.path.write(code, (err:any, result:any) => {
    //         if (err) throw err;
    //         console.log(result);
    //     });
    // }
}

export default PortConnect;