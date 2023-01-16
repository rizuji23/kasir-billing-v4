import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from "typeorm"
import 'moment-timezone';
import moment from "moment";
import { Cart } from "./Cart";

@Entity()
export class Pesanan {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_pesanan:string

    @Column()
    id_cart:string

    @Column()
    total:number

    @Column()
    uang_cash:number

    @Column()
    uang_kembalian:number

    @Column()
    id_booking:string

    @Column()
    status:string

    @Column()
    user_in:string

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