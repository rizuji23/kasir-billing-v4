import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Struk {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_struk:string

    @Column()
    id_pesanan:string

    @Column()
    nama_customer:string

    @Column()
    total_struk:number

    @Column()
    cash_struk:number

    @Column()
    kembalian_struk:number

    @Column()
    status_struk:number

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