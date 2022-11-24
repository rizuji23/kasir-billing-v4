import { dataSource } from "./data-source";
import shortid from 'shortid';
import { Split_Bill } from "../entity/Split_Bill";
import moment from "moment";
import { Split_Bill_Detail } from "../entity/Split_Bill_Detail";

const date_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");

class SplitBillSystem {
    static async addSplit(data_bill) {
        try {
            let service = await dataSource;
            const id_split_bill = shortid.generate();

            const add_bill = await service.manager.getRepository(Split_Bill).createQueryBuilder().insert().values({
                id_split_bill: id_split_bill,
                nama_bill: data_bill.nama,
                total_bill: data_bill.total,
                type_bill: data_bill.type_bill,
                created_at: date_now,
                updated_at: date_now
            }).execute();

            if (add_bill) {
                const data_billing = Array<any>();
                data_bill.data_billing.forEach(el => {
                    const id_split_bill_detail = shortid.generate();
                    data_billing.push({
                        id_split_bill_detail: id_split_bill_detail,
                        id_split_bill: id_split_bill,
                        id_cart: '',
                        id_detail_booking: el.id_detail_booking,
                        sub_total: el.harga,
                        status_bill: 'lunas',
                        created_at: date_now,
                        updated_at: date_now
                    });
                });

                
                const data_menu = Array<any>();
                data_bill.data_menu.forEach(el => {
                    const id_split_bill_detail = shortid.generate();
                    data_billing.push({
                        id_split_bill_detail: id_split_bill_detail,
                        id_split_bill: id_split_bill,
                        id_cart: el.id_cart,
                        id_detail_booking: '',
                        sub_total: el.sub_total,
                        status_bill: 'lunas',
                        created_at: date_now,
                        updated_at: date_now
                    });
                });

                const data_all = data_billing.concat(data_menu);
                
                const insert_detail = await service.manager.createQueryBuilder().insert().into(Split_Bill_Detail).values(data_all).execute();

                if (insert_detail) {
                    return {response: true, data: 'split bill is done'};
                } else {
                    return {response: false, data: 'split bill is not done'};
                }
            }

        } catch (err) {
            console.log(err);
        }
    }
}

export default SplitBillSystem;