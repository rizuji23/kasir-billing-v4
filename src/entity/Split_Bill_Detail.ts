import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import 'moment-timezone';
import moment from "moment";

@Entity()
export class Split_Bill_Detail {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    id_split_bill_detail:string

    @Column()
    id_split_bill:string

    @Column()
    id_cart:string
    
    @Column()
    id_detail_booking:string

    @Column()
    sub_total:number

    @Column()
    status_bill: string

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