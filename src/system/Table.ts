import { dataSource } from "./data-source";
import { Table_Billiard } from "../entity/Table_Billiard";
import { Booking } from "../entity/Booking";
import { Detail_Booking } from "../entity/Detail_Booking";
import shortid from 'shortid'
import 'moment-timezone';
import moment from "moment";
import DotAdded from "./DotAdded";
import BillingOperation from "./BillingOpration";
import { Struk } from "../entity/Struk";
import { clear } from "console";
import AktivitasSystem from "./AktivitasSystem";

class TableRegular {
    private ms_all:number;
    private ms_delay:number;
    blink: boolean;
    id_table:string;
    port:any;
    table_timer:any;
    table_diff:any;
    win:any;
    table_number:string;
    date_now:string;

    constructor(id_table:string, ms_all:number, ms_delay:number, blink:boolean, port:any, win:any){
        this.ms_all = ms_all;
        this.ms_delay = ms_delay;
        this.blink = blink;
        this.id_table = id_table;
        this.port = port;
        this.win = win;
        this.table_number = this.id_table.split('table0').join('');
        this.date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }

    timerInit(diff:any, duration:any, start:any):void {
        this.table_timer = () => {
            diff = duration - (((Date.now() - start) / 1000) | 0);
            var hours:any = (diff / 3600) | 0;
            var min:any = ((diff % 3600) / 60) | 0;
            var sec:any = diff % 60 | 0;

            hours = hours < 10 ? "0" + hours : hours;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;

            console.log(`${this.id_table} => ${hours}:${min}:${sec}`);
            this.win.webContents.send(
                `${this.id_table}`,
                {reponse: true, data: `${hours}:${min}:${sec}`, mode: 'regular'},
            );

            this.table_diff += diff
            this.ms_all--;

            if (diff <= 0) {
                this.stopTimer(this.table_timer, true);
            }
        }
    }

    async startTimer(data_booking:any):Promise<any> {
        const turn_all = this.ms_all + this.ms_delay;
        const count_time = turn_all / 3600000;
        const duration = 3600 * count_time;
        let start = Date.now();
        let diff, min, sec;

        const dot = new DotAdded();
        const id_booking = shortid.generate();

        (await dataSource).createQueryBuilder().update(Table_Billiard).set({
            id_booking: id_booking,
            durasi: data_booking.durasi_booking,
            status: "active",
        }).where('id_table = :id', {id: this.id_table}).execute();
        
        (await dataSource).createQueryBuilder().insert().into(Booking).values({
            id_booking: id_booking,
            id_member: data_booking.id_member,
            nama_booking: data_booking.nama,
            id_table: this.id_table,
            durasi_booking: data_booking.durasi_booking,
            total_harga: dot.decode(data_booking.total_harga),
            uang_cash: 0,
            potongan: data_booking.potongan,
            tipe_booking: data_booking.tipe_booking,
            status_booking: "active",
            user_in: data_booking.user_in,
            created_at: this.date_now,
            updated_at: this.date_now
        }).execute();

        console.log(data_booking)

        const data = data_booking.raw_detail_h;
        const arr_detail_harga = []
        data.forEach(element => {
            const id_detail_booking = shortid.generate();
            arr_detail_harga.push({id_detail_booking: id_detail_booking, id_booking: id_booking, harga:element.harga, durasi:element.durasi, status:"active", start_duration:element.start_duration, end_duration:element.end_duration, created_at: this.date_now, updated_at: this.date_now});
        });


        console.log(arr_detail_harga);

        (await dataSource).createQueryBuilder().insert().into(Detail_Booking).values(arr_detail_harga).execute();

        const id_struk = shortid.generate();
        (await dataSource).createQueryBuilder().insert().into(Struk).values({
            id_struk: id_struk,
            id_pesanan: '',
            id_booking: id_booking,
            nama_customer: data_booking.nama,
            total_struk: dot.decode(data_booking.total_harga),
            cash_struk: 0,
            kembalian_struk: 0,
            status_struk: 'belum lunas',
            type_struk: 'table',
            user_in: data_booking.user_in,
            created_at: this.date_now,
            updated_at: this.date_now,
        }).execute();


        this.timerInit(diff, duration, start)
        this.table_timer = setInterval(this.table_timer, 1000);
        this.port.open();
        await this.port.write(`on ${this.table_number}`);
        return this.table_timer;
    }

    async addOn(ms_delay:number, ms_add:number, table_timer, data_booking:any):Promise<any> {
        this.stopTimer(this.table_timer, false);
        const turn_all = ms_add + ms_delay + this.ms_all;
        const count_time = turn_all / 3600000;
        const duration = 3600 * count_time;
        let start = Date.now();
        let diff, min, sec;

        const dot = new DotAdded();
        let service = await dataSource;
        const check_table = await service.manager.find(Table_Billiard, {
            where: {
                id_table: data_booking.id_table
            }
        });

        const check_booking = await service.manager.find(Booking, {
            where: {
                id_booking: data_booking.id_booking
            }
        });

        const check_struk = await service.manager.find(Struk, {
            where: {
                id_booking: data_booking.id_booking
            }
        });

        clearInterval(table_timer);

        if (check_table.length !== 0 && check_booking.length !== 0 && check_struk.length !== 0) {
            const durasi_add = check_table[0].durasi + parseInt(data_booking.durasi_booking)
            const update_table = await service.manager.createQueryBuilder().update(Table_Billiard).set({
                id_booking: data_booking.id_booking,
                durasi: durasi_add,
                status: "active",
            }).where('id_table = :id', {id: this.id_table}).execute();

            if (update_table) {
                const total_harga = check_booking[0].total_harga + dot.decode(data_booking.total_harga);
                const durasi_booking = check_booking[0].durasi_booking + parseInt(data_booking.durasi_booking);
                const update_booking = await service.manager.createQueryBuilder().update(Booking).set({
                    durasi_booking: durasi_booking,
                    total_harga: total_harga,
                    updated_at: this.date_now
                }).where('id_booking = :id', {id: data_booking.id_booking}).execute();

                if (update_booking) {
                    const data = data_booking.raw_detail_h;
                    const arr_detail_harga = []
                    data.forEach(element => {
                        const id_detail_booking = shortid.generate();
                        arr_detail_harga.push({id_detail_booking: id_detail_booking, id_booking: data_booking.id_booking, harga:element.harga, durasi:element.durasi, status:"active", start_duration:element.start_duration, end_duration:element.end_duration, created_at: this.date_now, updated_at: this.date_now});
                    });

                    const insert_detail = await service.manager.createQueryBuilder().insert().into(Detail_Booking).values(arr_detail_harga).execute();
                    if (insert_detail) {
                        const total_struk = check_struk[0].total_struk + dot.decode(data_booking.total_harga);
                        const update_struk = await service.manager.createQueryBuilder().update(Struk).set({
                            total_struk: total_struk,
                            updated_at: this.date_now
                        }).where('id_booking = :id', {id: data_booking.id_booking}).execute();
                        if (update_struk) {
                            this.timerInit(diff, duration, start);
                            this.table_timer = setInterval(this.table_timer, 1000);
                            this.port.open();
                            this.port.write(`on ${this.table_number}`);
                            return this.table_timer;
                        } 
                    }
                }
            }
        } else {
            return {response: false, data: 'data tidak complite'};
        }
    }

    async stopTimer(table_timer:any, turn_off:boolean):Promise<any> {
        clearInterval(table_timer)
        console.log('Time stoped');
        if (turn_off === true) {
            await this.port.write(`of ${this.table_number}`);
        }

        this.win.webContents.send(
            `${this.id_table}`,
            {reponse: false, data: `Time stoped`},
          );
    }

    // table_timer_1 = table mati, table_timer_2 = table nyala
    async pindahMeja(data_booking, table_timer_1):Promise<any> {
        try {
            console.log("data_booking", data_booking)
            let service = await dataSource;
            const turn_all = this.ms_delay + this.ms_all;
            const count_time = turn_all / 3600000;
            const duration = 3600 * count_time;
            let start = Date.now();
            let diff, min, sec;

            // update booking
            const update_booking = await service.manager.createQueryBuilder().update(Booking).set({
                id_table: this.id_table,
                updated_at: this.date_now,
            }).where("id_booking = :id", {id: data_booking.id_booking}).execute();

            if (update_booking) {
                // get table_booking 1
                const get_table_1 = await service.manager.find(Table_Billiard, {
                    where: {
                        id_table: data_booking.id_table_1,
                    }
                });

                // update table_booking 2
                const update_table_2 = await service.manager.createQueryBuilder().update(Table_Billiard).set({
                    id_booking: get_table_1[0].id_booking,
                    durasi: get_table_1[0].durasi,
                    status: "active",
                    created_at: this.date_now,
                    updated_at: this.date_now
                }).where("id_table = :id", {id: this.id_table}).execute();

                // update table_booking 1
                const update_table_1 = await service.manager.createQueryBuilder().update(Table_Billiard).set({
                    id_booking: "",
                    durasi: 0,
                    status: "not_active",
                    updated_at: this.date_now,
                }).where("id_table = :id", {id: data_booking.id_table_1}).execute();

                if (update_table_1 && update_table_2) {
                    // stop table 1
                    setTimeout(async() => {
                        const table_number_1 = data_booking.id_table_1.split('table0').join('');
                        clearInterval(table_timer_1);
                        console.log("table_timer_1", table_timer_1)
                        await this.port.write(`of ${table_number_1}`);
                    }, 1000);


                    // start table 1
                    const table_number_2 = this.id_table.split('table0').join('');
                    this.timerInit(diff, duration, start)
                    this.table_timer = setInterval(this.table_timer, 1000);
                    this.port.open();
                    await this.port.write(`on ${table_number_2}`);
                    return this.table_timer;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async continueTimer(ms_delay:number, ms_add:number):Promise<any> {
        const turn_all = ms_add + ms_delay + this.ms_all;
        const count_time = turn_all / 3600000;
        const duration = 3600 * count_time;
        let start = Date.now();
        let diff, min, sec;

        console.log(diff)

        this.timerInit(diff, duration, start)
        this.table_timer = setInterval(this.table_timer, 1000);
        await this.port.write(`on ${this.table_number}`);
        return this.table_timer;
    }

    async resetTable(data_booking, table_timer, turn_off):Promise<any> {
        try {
            let service = await dataSource;
            const check_table = await service.manager.find(Table_Billiard, {
                where: {
                    id_table: this.id_table
                }
            });

            const check_booking = await service.manager.find(Booking, {
                where: {
                    id_booking: data_booking.id_booking
                }
            });

            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_booking: data_booking.id_booking
                }
            })

            if (check_table.length !== 0 && check_booking.length !== 0 && check_struk.length !== 0) {
                const update_table = await service.manager.createQueryBuilder().update(Table_Billiard).set({
                    status: "not_active",
                    id_booking: "",
                    durasi: 0
                }).where('id_table = :id', {id: this.id_table}).execute();

                if (update_table) {
                    const update_booking = await service.manager.createQueryBuilder().update(Booking).set({
                        status_booking: 'reset'
                    }).where('id_booking = :id', {id: data_booking.id_booking}).execute();

                    if (update_booking) {
                        const update_detail = await service.manager.createQueryBuilder().update(Detail_Booking).set({
                            status: 'reset'
                        }).where('id_booking = :id', {id: data_booking.id_booking}).execute();
                        if (update_detail) {
                            if (check_struk[0].id_pesanan === '') {
                                await service.manager.createQueryBuilder().update(Struk).set({
                                    status_struk: 'reset',
                                }).where('id_booking = :id', {id: data_booking.id_booking}).execute();
                            }
                            this.stopTimer(table_timer, turn_off)
                            return this.table_timer;
                        }
                    }
                }
            } else {
                console.log('not found')
            }
        } catch (err) {
            console.log(err)
        }
    }

    get getTable():string {
        return this.id_table;
    }

    get getMsAll():number {
        return this.ms_all;
    }

    get getMsDelay():number {
        return this.ms_delay;
    }

    get getIdTable():string {
        return this.id_table;
    }
}



class TablePersonal extends TableRegular {
    table_timer_2:any;
    constructor(id_table:string, port:any, win:any) {
        super(id_table, 0, 0, false, port, win);
        this.id_table = id_table;
        this.port = port;
        this.win = win;
        this.table_number = this.id_table.split('table0').join('');
        this.date_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    timerInit(hh, mm, ss): void {
        var milliseconds = 0;
        var seconds = ss;
        var minutes = mm;
        var hours = hh;

        this.table_timer_2 = () => {
            milliseconds += 1000;
            if (milliseconds == 1000) {
              milliseconds = 0;
              seconds++;
              if (seconds == 60) {
                seconds = 0;
                minutes++;
                if (minutes == 60) {
                  minutes = 0;
                  hours++;
                }
              }
            }
            let h = hours < 10 ? "0" + hours : hours;
            let m = minutes < 10 ? "0" + minutes : minutes;
            let s = seconds < 10 ? "0" + seconds : seconds;

            this.win.webContents.send(
                `${this.id_table}`,
                {reponse: true, data: `${h}:${m}:${s}`, mode: 'loss'},
            );

            console.log(`${this.getIdTable} => ${h}:${m}:${s}`);
          };
    }

    async startTimer(data_booking:any) {
        const id_booking = shortid.generate();
        const bill = new BillingOperation();
        const harga = await bill.checkHarga(data_booking.shift);

        (await dataSource).createQueryBuilder().update(Table_Billiard).set({
            id_booking: id_booking,
            durasi: data_booking.durasi_booking,
            status: "active",
            created_at: this.date_now,
            updated_at: this.date_now
        }).where('id_table = :id', {id: this.id_table}).execute();
        
        (await dataSource).createQueryBuilder().insert().into(Booking).values({
            id_booking: id_booking,
            id_member: '',
            nama_booking: data_booking.nama,
            id_table: this.id_table,
            durasi_booking: 1,
            total_harga: harga.total_harga,
            uang_cash: 0,
            tipe_booking: data_booking.tipe_booking,
            status_booking: "active",
            user_in: data_booking.user_in,
            created_at: this.date_now,
            updated_at: this.date_now
        }).execute();

        const id_detail_booking = shortid.generate();
        (await dataSource).createQueryBuilder().insert().into(Detail_Booking).values({
            id_detail_booking: id_detail_booking,
            id_booking: id_booking,
            harga: harga.total_harga,
            durasi: 1,
            status: 'active',
            start_duration: harga.harga_detail[0].start_duration,
            end_duration: harga.harga_detail[0].end_duration,
            created_at: this.date_now,
            updated_at: this.date_now
        }).execute();

        const id_struk = shortid.generate();
        (await dataSource).createQueryBuilder().insert().into(Struk).values({
            id_struk: id_struk,
            id_pesanan: '',
            id_booking: id_booking,
            nama_customer: data_booking.nama,
            total_struk: harga.total_harga,
            cash_struk: 0,
            kembalian_struk: 0,
            status_struk: 'belum lunas',
            type_struk: 'table',
            user_in: data_booking.user_in,
            created_at: this.date_now,
            updated_at: this.date_now,
        }).execute();

       
        this.timerInit(0, 0, 0);
        this.table_timer_2 = setInterval(this.table_timer_2, 1000);
        this.port.open();
        await this.port.write(`on ${this.table_number}`);
        return this.table_timer_2;
    }

    async continueTimerLoss(data_booking): Promise<any> {
        this.timerInit(data_booking.hh, data_booking.mm, 0);
        this.table_timer_2 = setInterval(this.table_timer_2, 1000);
        this.port.open();
        await this.port.write(`on ${this.table_number}`);
        return this.table_timer_2;
    }

    async resetTable(data_booking, table_timer, turn_off):Promise<any> {
        try {
            let service = await dataSource;
            const check_table = await service.manager.find(Table_Billiard, {
                where: {
                    id_table: this.id_table
                }
            });

            const check_booking = await service.manager.find(Booking, {
                where: {
                    id_booking: data_booking.id_booking
                }
            });

            const check_struk = await service.manager.find(Struk, {
                where: {
                    id_booking: data_booking.id_booking
                }
            })

            if (check_table.length !== 0 && check_booking.length !== 0) {
                const update_table = await service.manager.createQueryBuilder().update(Table_Billiard).set({
                    status: "not_active",
                    id_booking: "",
                    durasi: 0
                }).where('id_table = :id', {id: this.id_table}).execute();

                if (update_table) {
                    const update_booking = await service.manager.createQueryBuilder().update(Booking).set({
                        status_booking: 'reset'
                    }).where('id_booking = :id', {id: data_booking.id_booking}).execute();

                    if (update_booking) {
                        const update_detail = await service.manager.createQueryBuilder().update(Detail_Booking).set({
                            status: 'reset'
                        }).where('id_booking = :id', {id: data_booking.id_booking}).execute();
                        if (update_detail) {
                            if (check_struk[0].id_pesanan === '') {
                                await service.manager.createQueryBuilder().update(Struk).set({
                                    status_struk: 'reset',
                                }).where('id_booking = :id', {id: data_booking.id_booking}).execute();
                            }
                            this.stopTimer(table_timer, turn_off)
                            return this.table_timer_2;
                        }
                    }
                }
            } else {
                console.log('not found')
            }
        } catch (err) {
            console.log(err)
        }
    }

    async stopTimer(table_timer:any, turn_off:boolean):Promise<any> {
        clearInterval(table_timer);
        if (turn_off === true) {
            this.port.open();
            await this.port.write(`of ${this.table_number}`);
        }

        this.win.webContents.send(
            `${this.id_table}`,
            {reponse: false, data: `Time stoped`},
          );
        console.log("Timer is stoped");
    }
}


// const table = new TableRegular("Table 01", 5000, 3000, false, "dawd", "Testing", false);
// console.log(table.startTimer());

// setTimeout(() => {
//     table.stopTimer();
// }, 3000)

// const table_2 = new TableSettings("Table 02", 7000, 5000, true, "ddd");
// console.log(table_2.startTimer());
// console.log(table_2.table_diff);

export {TableRegular, TablePersonal}