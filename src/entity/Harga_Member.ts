import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import 'moment-timezone'
import moment from "moment";

@Entity()
export class Harga_Member {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_harga_member: string

    @Column()
    harga_member: number

    @Column()
    potongan: number

    @Column({nullable: true})
    playing: number

    @Column()
    jenis_member: string

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