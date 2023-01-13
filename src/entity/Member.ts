import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import 'moment-timezone'
import moment from "moment";

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_member:string

    @Column()
    kode_member:string

    @Column()
    nama_member:string

    @Column()
    no_telp: number

    @Column()
    email:string

    @Column()
    no_ktp:number

    @Column()
    alamat:string

    @Column()
    tipe_member:string

    @Column({nullable: true})
    playing: number

    @Column({nullable: true})
    potongan: string

    @Column()
    status_member:string

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