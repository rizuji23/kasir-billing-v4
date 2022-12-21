import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";


@Entity()
export class Stok_Keluar {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    id_stok_keluar: string

    @Column()
    id_stok_main: string

    @Column()
    id_menu: string

    @Column()
    stok_keluar: number

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
        this.created_at = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
        this.updated_at = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
    }

    @BeforeUpdate()
    insertUpdated() {
        this.updated_at = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")
    }
    

}