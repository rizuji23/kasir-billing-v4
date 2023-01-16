import { Shift } from "../entity/Shift";
import { dataSource } from "./data-source";

class ShiftSystem {
    static async getShift(kategori):Promise<any> {
        try {
            let service = await dataSource;

            const get_shift = await service.manager.find(Shift, {
                where: {
                    shift: kategori,
                }
            });

            if (get_shift.length !== 0) {
                return {response: true, data: get_shift};
            } else {
                return {response: false, data: "data is empty"}
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default ShiftSystem;