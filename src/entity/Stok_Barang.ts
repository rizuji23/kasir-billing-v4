import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Stok_Barang {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_stok_barang:string

    @Column()
    id_menu:string

    @Column()
    stok_awal:number
    
    @Column()
    id_cart:string

    @Column()
    terjual:number

    @Column()
    sisa:number

    @Column()
    shift:string

    @Column()
    stok_akhir:string

    @Column()
    user_in:string
    
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