import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Harga_Billing {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_harga_billing:string

    @Column()
    harga:number

    @Column()
    durasi:number

    @Column()
    tipe_durasi:string

    @Column()
    status:string

    @Column()
    created_at: string

    @Column()
    updated_at: string

    @BeforeInsert()
    insertCreated() {
        this.created_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }

    @BeforeUpdate()
    insertUpdated() {
        this.updated_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }

}