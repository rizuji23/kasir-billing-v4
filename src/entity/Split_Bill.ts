import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Split_Bill {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_split_bill:string

    @Column()
    id_booking: string
    
    @Column()
    nama_bill: string

    @Column()
    total_bill: number

    @Column()
    type_bill: string

    @Column({nullable: true})
    user_in: string

    @Column()
    created_at: string

    @Column()
    updated_at: string

    @BeforeInsert()
    insertCreated() {
        this.created_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        this.updated_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    @BeforeUpdate()
    insertUpdated() {
        this.updated_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }
}