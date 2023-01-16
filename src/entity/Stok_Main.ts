import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Stok_Main {
    
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_stok_main: string

    @Column()
    id_menu: string

    @Column()
    stok_awal: number

    @Column()
    stok_masuk: number

    @Column()
    terjual: number

    @Column()
    sisa: number

    @Column()
    stok_akhir: number

    @Column()
    keterangan: string

    @Column()
    shift: string

    @Column()
    user_in: string

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