import moment from "moment";
import 'moment-timezone';

class Cozy {
    static async filterByHour(data_billing, data_cafe):Promise<any> {
        return new Promise((res, rej) => {
            // for billing
            data_billing.map((el) => {
                el['hour'] = moment(el.created_at, "DD-MM-YYYY HH:mm:ss").format("HH");
            });

            const final_billing = Array.from(
                data_billing.reduce((a, {hour, total_harga}) => {
                  return a.set(hour, (a.get(hour) || 0) + total_harga)
              }, new Map())
            ).map(([hour, total_billing]) => ({hour, total_billing}));

            // for cafe
            data_cafe.map((el) => {
                el['hour'] = moment(el.created_at, "DD-MM-YYYY HH:mm:ss").format("HH");
               
            });

            const final_cafe = Array.from(
                data_cafe.reduce((a, {hour, total}) => {
                  return a.set(hour, (a.get(hour) || 0) + total)
              }, new Map())
            ).map(([hour, total_cafe]) => ({hour, total_cafe}));

            const final = final_billing.map(item => ({...item, ...final_cafe.find(elm => elm.hour === item.hour)}));

            res({response: true, data: final});
        })
    }

    static async filterByMonth(data_billing, data_cafe):Promise<any> {
        return new Promise((res, rej) => {
            // for billing
            data_billing.map((el) => {
                el['month'] = moment(el.created_at, "DD-MM-YYYY HH:mm:ss").format("dddd");
            });

            const final_billing = Array.from(
                data_billing.reduce((a, {month, total_harga}) => {
                  return a.set(month, (a.get(month) || 0) + total_harga)
              }, new Map())
            ).map(([month, total_billing]) => ({month, total_billing}));

            // for cafe
            data_cafe.map((el) => {
                el['month'] = moment(el.created_at, "DD-MM-YYYY HH:mm:ss").format("dddd");
            });

            const final_cafe = Array.from(
                data_cafe.reduce((a, {month, total}) => {
                  return a.set(month, (a.get(month) || 0) + total)
              }, new Map())
            ).map(([month, total_cafe]) => ({month, total_cafe}));

            const final = final_billing.map(item => ({...item, ...final_cafe.find(elm => elm.month === item.month)}));

            res({response: true, data: final});
        })
    }

    static async filterByKuartal(data_billing, data_cafe):Promise<any> {
        return new Promise((res, rej) => {
            const final_billing = Array.from(
                data_billing.reduce((a, {kuartal, total_harga}) => {
                  return a.set(kuartal, (a.get(kuartal) || 0) + total_harga)
              }, new Map())
            ).map(([kuartal, total_billing]) => ({kuartal, total_billing}));

            const final_cafe = Array.from(
                data_cafe.reduce((a, {kuartal, total}) => {
                  return a.set(kuartal, (a.get(kuartal) || 0) + total)
              }, new Map())
            ).map(([kuartal, total_cafe]) => ({kuartal, total_cafe}));

            const final = final_billing.map(item => ({...item, ...final_cafe.find(elm => elm.kuartal === item.kuartal)}));

            res({response: true, data: final});
        })
    }

    static async filterByYear(data_billing, data_cafe):Promise<any> {
        return new Promise((res, rej) => {
            // for billing
            data_billing.map((el) => {
                el['month'] = moment(el.created_at, "DD-MM-YYYY HH:mm:ss").format("MMMM");
            });

            const final_billing = Array.from(
                data_billing.reduce((a, {month, total_harga}) => {
                  return a.set(month, (a.get(month) || 0) + total_harga)
              }, new Map())
            ).map(([month, total_billing]) => ({month, total_billing}));

            // for cafe
            data_cafe.map((el) => {
                el['month'] = moment(el.created_at, "DD-MM-YYYY HH:mm:ss").format("MMMM");
            });

            const final_cafe = Array.from(
                data_cafe.reduce((a, {month, total}) => {
                  return a.set(month, (a.get(month) || 0) + total)
              }, new Map())
            ).map(([month, total_cafe]) => ({month, total_cafe}));

            const final = final_billing.map(item => ({...item, ...final_cafe.find(elm => elm.month === item.month)}));

            res({response: true, data: final});
        })
    }
}

export default Cozy;