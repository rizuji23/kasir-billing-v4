import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from "typeorm";
import 'moment-timezone';
import moment from "moment";
import { Detail_Booking } from "./Detail_Booking";


@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_booking:string

    @Column()
    id_member:string

    @Column()
    nama_booking:string

    @Column()
    id_table:string

    @Column()
    durasi_booking:number

    @Column()
    total_harga:number

    @Column()
    uang_cash:number

    @Column({nullable: true})
    potongan: number

    @Column()
    tipe_booking:string

    @Column()
    status_booking:string

    @Column()
    user_in:string

    @Column()
    created_at:string

    @Column()
    updated_at:string


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