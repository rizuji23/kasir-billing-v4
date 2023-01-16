import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Detail_Booking {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_detail_booking:string

    @Column()
    id_booking:string

    @Column()
    harga:number

    @Column()
    durasi:number

    @Column()
    status:string

    @Column()
    start_duration:string

    @Column()
    end_duration:string

    @Column()
    created_at:string

    @Column()
    updated_at:string


    @BeforeInsert()
    insertCreated() {
        this.start_duration = moment().tz("Asia/Jakarta").format("HH:mm:ss")
        this.created_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }

    @BeforeUpdate()
    insertUpdated() {
        this.end_duration = moment().tz("Asia/Jakarta").format("HH:mm:ss")
        this.updated_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }
}