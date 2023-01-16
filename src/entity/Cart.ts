import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_cart:string

    @Column()
    id_menu:string

    @Column()
    qty:number

    @Column()
    sub_total:number

    @Column()
    status:string

    @Column()
    id_pesanan:string

    @Column()
    user_in:string

    @Column()
    created_at:string

    @Column()
    updated_at:string

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