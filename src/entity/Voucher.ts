import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Voucher {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_voucher: string

    @Column()
    kode_voucher: string

    @Column()
    desc_voucher: string

    @Column()
    potongan: number

    @Column()
    start_masa: string
    
    @Column()
    end_masa: string

    @Column()
    status_voucher: string

    @Column()
    created_at: string

    @Column()
    updated_at: string

    @BeforeInsert()
    insertCreated() {
        this.created_at = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
        this.updated_at = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
    }

    @BeforeUpdate()
    insertUpdated() {
        this.updated_at = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
    }
}