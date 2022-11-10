import { ipcRenderer } from "electron";

const start01:any = document.getElementById("start01");
const start02:any = document.getElementById("start02");
const start03:any = document.getElementById("start03");

const stop01:any = document.getElementById("stop01");
const stop02:any = document.getElementById("stop02");
const stop03:any = document.getElementById("stop03");

const addon01:any = document.getElementById("addon01");
const addon02:any = document.getElementById("addon02");
const addon03:any = document.getElementById("addon03");

start01.onclick = () => {
    const input:any = document.getElementById("table001")

    const durasi_minute = input.value * 60;
    const minutetoms = durasi_minute * 60000;
    ipcRenderer.invoke("start", "table001", minutetoms, 0, true, false).then(() => {
        console.log("start01 berhasil dibuat")
    })
}

start02.onclick = () => {
    const input:any = document.getElementById("table002")

    const durasi_minute = input.value * 60;
    const minutetoms = durasi_minute * 60000;
    ipcRenderer.invoke("start", "table002", minutetoms, 0, true, false).then(() => {
        console.log("start02 berhasil dibuat")
    })
}

start03.onclick = () => {
    const input:any = document.getElementById("table003")

    const durasi_minute = input.value * 60;
    const minutetoms = durasi_minute * 60000;
    ipcRenderer.invoke("start", "table003", minutetoms, 0, true, false).then(() => {
        console.log("start03 berhasil dibuat")
    })
}

ipcRenderer.on("table001", (event, msg) => {
    console.log(msg)
    const timer01:any = document.getElementById("timer01");
    timer01.innerHTML = msg.data;
    if (msg.reponse === true) {
        start01.toggleAttribute("disabled", true);
    } else {
        start01.toggleAttribute("disabled", false);

    }
})

ipcRenderer.on("table002", (event, msg) => {
    const timer02:any = document.getElementById("timer02");
    timer02.innerHTML = msg.data;
    if (msg.reponse === true) {
        start02.toggleAttribute("disabled", true);
    } else {
        start02.toggleAttribute("disabled", false);

    }
})

ipcRenderer.on("table003", (event, msg) => {
    const timer03:any = document.getElementById("timer03");
    timer03.innerHTML = msg.data;
    if (msg.reponse === true) {
        start03.toggleAttribute("disabled", true);
    } else {
        start03.toggleAttribute("disabled", false);

    }
})

stop01.onclick = () => {
    ipcRenderer.invoke("start", "table001", 0, 0, true, true).then(() => {
        console.log("stop01 berhasil dibuat")
    })
}

stop02.onclick = () => {
    ipcRenderer.invoke("start", "table002", 0, 0, true, true).then(() => {
        console.log("stop02 berhasil dibuat")
    })
}

stop03.onclick = () => {
    ipcRenderer.invoke("start", "table003", 0, 0, true, true).then(() => {
        console.log("stop03 berhasil dibuat")
    })
}