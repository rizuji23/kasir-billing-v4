import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Menu {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_menu:string

    @Column()
    nama_menu:string

    @Column()
    harga_menu:number

    @Column()
    kategori_menu:string

    @Column()
    img_file:string

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