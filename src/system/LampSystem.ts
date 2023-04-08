
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
            try {
                const isOpen = this.port.open();
                this.port.write(`on ${this.table_number}`);
                return ({response: true, data: true});
            } catch (err) {
                return (err);
            }
    }

    async turnOff():Promise<any> {
        try {
            const isOpen = this.port.open();
            this.port.write(`on ${this.table_number}`);
            return ({response: true, data: true});
        } catch (err) {
            return (err);
        }
    }
}

export default LampSystem;