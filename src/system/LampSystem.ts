
class LampSystem {
    id_table:string
    port:any
    win:any
    table_number:string
    constructor(id_table:string, port:any, win:any) {
        this.id_table = id_table;
        this.port = port;
        this.win = win;
        this.table_number = this.id_table.split('table0').join('');
    }

    async turnOn():Promise<any> {
        return new Promise((res, rej) => {
            try {
                const turnon = this.port.write(`on ${this.table_number}`);
                if (turnon) {
                    res(true);
                } else {
                    res(false);
                }
            } catch (err) {
                rej(err);
            }
        })
    }

    async turnOff():Promise<any> {
        return new Promise((res, rej) => {
            try {
                const turnoff = this.port.write(`of ${this.table_number}`);
                if (turnoff) {
                    res(true);
                } else {
                    res(false);
                }
            } catch (err) {
                rej(err);
            }
        })
    }
}

export default LampSystem;