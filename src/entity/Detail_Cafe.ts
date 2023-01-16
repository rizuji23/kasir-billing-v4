import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Detail_Cafe {

    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    id_detail_cafe:string

    @Column()
    id_menu:string

    @Column()
    harga_jual:number

    @Column()
    modal:number

    @Column()
    keuntungan:number

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