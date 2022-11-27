import { ipcRenderer } from "electron";
import { toast } from "react-toastify";

async function turnon(id) {
    return new Promise(res => {
        setTimeout(() => {
            if (id.mode === 'Regular') {
                const id_table = id.table;
                const ms = id.milliseconds;

                ipcRenderer.invoke('start', id_table, ms, 0, true, false, false, 0, 0, {}, true, false).then((result) => {
                    console.log("called regular")
                    res(result)
                });
            } else if (id.mode === 'Loss') {
                const id_table = id.table;

                ipcRenderer.invoke("start_loss", id_table, false, false, id, false, true).then((result) => {
                    console.log("called loss")
                    res(result)
                });
            }
        }, 1000);
    });
}

function showLoading(current, max) {
    toast.info(`Table dinyalakan tunggu sebentar ${current} - ${max}`);
    if (current === max) {
        toast.success('Semua table sudah dinyalakan...')
    }
}

export {turnon, showLoading};