import React from "react";
import { ModalBooking, ModalBookingActive } from "../IndexModal";
import { ipcRenderer } from "electron";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DotAdded from "../../../system/DotAdded";
import swal from 'sweetalert';

import { turnon, showLoading } from "../ContinueTimer";
import TimeConvert from "../../../system/TimeConvert";
import { Dot } from "recharts";
import moment from "moment";
import 'moment-timezone';

class Table_01 extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            timer: "00:00:00",
            jam: "",
            disabled: true,
            disabled_add: true,
            isUse: false,
            nama: "",
            price: 0,
            table_name: "Table 01",
            mode: "Regular",
            table_id: "table001",
            modal_close: false,
            harga_detail: "",
            total_harga: 0,
            jam_add: 0,
            total_harga_add: 0,
            blink: '',
            raw_detail_h: [],
            pindah: "",
            id_booking: "",
            list_billing: "",
            isOpen: false,
            blink_add: false,
            time_running: false,
            member: false,
            nama_member: "",
            id_member: "",
            disabled_voucher: true,
            voucher: "",
            potongan: 0,
            playing: "",
            loading: false,
            list_menu: "",
            list_menu_raw: "",
            disabled_menu: true,
            loading_menu: false,
            data_menu: {
                id_menu: "",
                qty: "",
            },
            disabled_addOn: true,
            info_badges: "",
        }

        this.handleMode = this.handleMode.bind(this);
        this.handleJam = this.handleJam.bind(this);
        this.handleJamAdd = this.handleJamAdd.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.getTimeString = this.getTimeString.bind(this);
        this.handleNama = this.handleNama.bind(this);
        this.handleBlink = this.handleBlink.bind(this);
        this.handlePindah = this.handlePindah.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleBlinkAdd = this.handleBlinkAdd.bind(this);
        this.addOn = this.addOn.bind(this);
        this.resetTable = this.resetTable.bind(this);
        this.startTimerLoss = this.startTimerLoss.bind(this);
        this.stopTimerLoss = this.stopTimerLoss.bind(this);
        this.continueTimer = this.continueTimer.bind(this);
        this.handleMember = this.handleMember.bind(this);
        this.handleInputMember = this.handleInputMember.bind(this);
        this.handleVoucher = this.handleVoucher.bind(this);
        this.handleCheckVoucher = this.handleCheckVoucher.bind(this);
        this.handlePindahTable = this.handlePindahTable.bind(this);
    }

    validation() {
        setTimeout(() => {
            const jam = this.state.jam;
            const mode = this.state.mode;
            const nama = this.state.nama;
            const blink = this.state.blink;

            if (jam.length === 0 || mode.length === 0 || nama.length === 0 || blink.length === 0) {
                this.setState({ disabled: true });
                console.log("belum")
            } else {
                this.setState({ disabled: false });
                console.log("Sudah")
            }
        }, 500)
    }

    clearAllState() {
        this.setState({
            timer: "00:00:00",
            jam: "",
            disabled: true,
            disabled_add: true,
            isUse: false,
            nama: "",
            price: 0,
            mode: "Regular",
            modal_close: false,
            harga_detail: "",
            total_harga: 0,
            jam_add: 0,
            total_harga_add: 0,
            blink: '',
            raw_detail_h: [],
            pindah: "",
            id_booking: "",
            list_billing: "",
            isOpen: false,
            blink_add: false,
            time_running: false,
            mode_loss: false,
            member: false,
            nama_member: "",
            disabled_voucher: true,
            voucher: "",
            potongan: 0,
            playing: "",
            loading_addon: false,

        });
    }

    handleMode(e) {
        if (e.target.value.length === 0) {
            toast.error("Mode wajib diisi!")
            this.setState({ mode: "", modal_close: false });
            this.validation();
        } else {
            if (e.target.value === 'Loss') {
                this.setState({ mode_loss: true });
            } else {
                this.setState({ mode_loss: false });
                this.validation();

            }
            this.setState({ mode: e.target.value, modal_close: false })
        }
    }

    handleJam(e) {
        const dot = new DotAdded();
        if (e.target.value.length === 0) {
            toast.error("Jam wajib diisi!")
            this.setState({ jam: "", harga_detail: "", total_harga: "0", raw_detail_h: [], modal_close: false });
            this.validation()

        } else {
            this.setState({ jam: e.target.value, modal_close: false });
            const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
            const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

            const hours = moment().tz("Asia/Jakarta").format("HH");
            var shift_now;

            if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
                shift_now = {
                    shift: "pagi",
                    durasi: e.target.value,
                    start_jam: shift_pagi.start_jam.split(':')[0],
                    end_jam: shift_pagi.end_jam.split(':')[0]
                }
                console.log(shift_now)
                console.log("Pagi")
            } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
                shift_now = {
                    shift: "malam",
                    durasi: e.target.value,
                    start_jam: shift_malam.start_jam.split(':')[0],
                    end_jam: shift_malam.end_jam.split(':')[0]
                }
                console.log("malam")
                console.log(shift_now)
            }

            ipcRenderer.invoke("checkHarga", shift_now).then((result) => {
                console.log(result);
                var data_new = ""
                if (result.response) {
                    result.harga_detail.map(el => {
                        const final = el.harga * ((100 - parseFloat(this.state.potongan)) / 100);
                        el['harga'] = final;
                    });

                    result.harga_detail.forEach(element => {
                        data_new += `<li>(${element.end_duration}) ${element.tipe} = Rp. ${dot.parse(element.harga)}</li>`
                    });

                    const total_harga = result.total_harga * ((100 - parseFloat(this.state.potongan)) / 100);

                    console.log(this.state.potongan)

                    this.setState({ harga_detail: data_new, total_harga: dot.parse(total_harga), raw_detail_h: result.harga_detail })
                    this.validation()
                } else {
                    toast.error("Terjadi kesalahan pada mengitung jam!")
                }
            });
        }
    }

    handleJamAdd(e) {
        const dot = new DotAdded();
        if (e.target.value.length === 0) {
            toast.error("Jam wajib diisi!")
            this.setState({ harga_detail: '', total_harga_add: '', raw_detail_h: '', jam_add: '', modal_close: false, disabled_add: true })

            this.validation()

        } else {
            this.setState({ jam_add: e.target.value, modal_close: false });
            const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
            const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

            const hours = moment().tz("Asia/Jakarta").format("HH");
            var shift_now;

            if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
                shift_now = {
                    shift: "pagi",
                    durasi: e.target.value,
                    start_jam: shift_pagi.start_jam.split(':')[0],
                    end_jam: shift_pagi.end_jam.split(':')[0]
                }
                console.log(shift_now)
                console.log("Pagi")
            } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
                shift_now = {
                    shift: "malam",
                    durasi: e.target.value,
                    start_jam: shift_malam.start_jam.split(':')[0],
                    end_jam: shift_malam.end_jam.split(':')[0]
                }
                console.log("malam")
                console.log(shift_now)
            }
            ipcRenderer.invoke("checkHarga", shift_now).then((result) => {
                console.log(result);
                var data_new = ""
                if (result.response) {
                    result.harga_detail.forEach(element => {
                        data_new += `<li>${element.tipe} = Rp. ${dot.parse(element.harga)}</li>`
                    });

                    this.setState({ harga_detail: data_new, total_harga_add: dot.parse(result.total_harga), raw_detail_h: result.harga_detail, disabled_add: false })
                    this.validation()
                } else {
                    toast.error("Terjadi kesalahan pada mengitung jam!")
                }
            })
            setTimeout(() => {
                console.log(this.state.total_harga_add)

            }, 1000)
        }
    }



    handlePindah(e) {
        console.log(e.target.value);

        if (e.target.value.length === 0) {
            toast.error("Nama wajib diisi!");
        } else {
            this.setState({ pindah: e.target.value });
            console.log(e.target.value);
        }
    }

    handleNama(e) {
        if (e.target.value.length === 0) {
            toast.error("Nama wajib diisi!")
            this.setState({ nama: "", modal_close: false });
            this.validation()
        } else {
            if (this.state.mode === 'Regular') {
                this.setState({ nama: e.target.value, modal_close: false });
                this.validation();
            } else if (this.state.mode === 'Loss') {
                this.setState({ nama: e.target.value, modal_close: false, disabled: false });
            }
        }
    }

    handleBlink(e) {
        console.log(e.target.value)
        if (e.target.value.length === 0) {
            toast.error("Blink wajib diisi!")
            this.setState({ blink: "", modal_close: false });
            this.validation()

        } else {
            var blink;
            if (e.target.value === 'Iya') {
                blink = true;
            } else {
                blink = false;
            }
            this.setState({ blink: blink, modal_close: false });
            this.validation()
        }
    }

    handleBlinkAdd(e) {
        if (e.target.value.length === 0) {
            toast.error("Blink wajib diisi!")
            this.setState({ blink: "", modal_close: false, disabled_add: true });
            this.validation()

        } else {
            var blink;
            if (e.target.value === 'Iya') {
                blink = true;
            } else {
                blink = false;
            }
            this.setState({ blink_add: blink, modal_close: false, disabled_add: false });
            this.validation()
        }
    }

    startTimer(): void {
        swal({
            title: "Apa kamu yakin?",
            text: "Data tidak akan bisa diubah..",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                this.setState({
                    loading: true,
                    disabled: true,
                });

                toast.success("Progress: Menyimpan Data... (30%)");

                setTimeout(() => {
                    toast.success("Progress: Menyimpan Table Lampu... (80%)");
                }, 1000)

                if (this.state.jam !== '' && this.state.mode !== '') {
                    this.setState({ disabled: true })
                    setTimeout(() => {
                        const durasi_minute = this.state.jam * 60;
                        const minutetoms = durasi_minute * 60000;

                        const data_booking = {
                            nama: this.state.nama,
                            durasi_booking: this.state.jam,
                            total_harga: this.state.total_harga,
                            tipe_booking: this.state.mode,
                            user_in: sessionStorage.getItem('username'),
                            raw_detail_h: this.state.raw_detail_h,
                            potongan: this.state.potongan,
                            id_member: this.state.member === true ? this.state.id_member : "",
                        }

                        if (this.state.member === true) {
                            const reduce = this.state.playing - 1;
                            const data = {
                                reduce: reduce,
                                id_member: this.state.id_member
                            }
                            ipcRenderer.invoke("reducePlaying", data).then((result) => {
                                if (result.response === true) {
                                    toast.success("Member berhasil dikurangi.");
                                } else {
                                    toast.error("Member gagal dikurangi.");
                                }
                            })
                        }

                        if (this.state.mode === 'Regular') {
                            ipcRenderer.invoke("start", this.state.table_id, minutetoms, 0, this.state.blink, false, false, 0, 0, data_booking, false, false, true)
                                .then(() => {
                                    console.log("start 01 is created");
                                    toast.success(`Progress: ${this.state.table_name} berhasil dinyalakan. (100%)`);
                                    this.getDataTable();
                                    this.setState({ disabled: false, isUse: true, isOpen: false, loading: false, info_badges: "terpakai" });
                                });
                        }
                    }, 3000);
                } else {
                    console.log("table 01 error")
                }
            }
        })
    }

    addOn(): void {
        if (this.state.jam_add !== 0 || this.state.jam_add.length !== 0 || this.state.total_harga_add.length !== 0 && this.state.time_running !== false) {
            this.setState({ disabled_add: true, loading_addon: true })
            toast.info("Tunggu sebentar...");
            setTimeout(() => {
                var data = localStorage.getItem(this.state.table_id).replace(/\[|\]/g, '').split(',');
                const time_before = TimeConvert.textToMS(data, this.state.table_id);
                const convert_minute = time_before.seconds / 60;
                const durasi_minute = this.state.jam_add * 60;
                const minutetoms = (durasi_minute + convert_minute) * 60000;

                const data_booking = {
                    nama: this.state.nama,
                    durasi_booking: this.state.jam_add,
                    total_harga: this.state.total_harga_add,
                    tipe_booking: this.state.mode,
                    user_in: sessionStorage.getItem('username'),
                    raw_detail_h: this.state.raw_detail_h,
                    id_booking: this.state.id_booking,
                }

                if (this.state.mode === 'Regular') {
                    ipcRenderer.invoke("start", this.state.table_id, 0, 0, this.state.blink_add, false, true, 0, minutetoms, data_booking, false, false, false).then((result) => {
                        console.log("start 01 is addon");
                        this.setState({ disabled_add: false, isUse: true, loading_addon: false, disabled_addOn: true, info_badges: "terpakai" })
                        this.getDataTable()
                        toast.success(this.state.table_name + " berhasil ditambah durasi.");
                    });
                }
            }, 3000)
        } else {
            console.log("table 01 error")
        }
    }

    resetTable(): void {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data_booking = {
                        id_booking: this.state.id_booking,
                    }

                    if (this.state.mode === 'Regular') {
                        console.log(data_booking)

                        ipcRenderer.invoke("start", this.state.table_id, 0, 0, true, false, false, 0, 0, data_booking, false, true, false).then((result) => {
                            console.log("table 01 is reset " + result);
                            this.clearAllState();
                            localStorage.setItem(this.state.table_id, `[not_active,00:00]`);
                            toast.success(this.state.table_name + " direset");
                        });
                    } else if (this.state.mode === 'Loss') {
                        console.log(data_booking)
                        ipcRenderer.invoke("start_loss", this.state.table_id, false, false, data_booking, true, false).then((result) => {
                            console.log(`${this.state.table_name} is reset ${result}`);
                            this.clearAllState();
                            localStorage.setItem(this.state.table_id, `[not_active,00:00]`)
                            toast.success(`${this.state.table_name} direset (Loss)`);
                        })
                    }
                }
            });

    }

    stopTimer(): void {
        ipcRenderer.invoke("start", this.state.table_id, 0, 0, true, true, 0, 0, 0, {}, false, false, false).then(() => {
            console.log("stop 01 is done")
            this.clearAllState();
            localStorage.setItem(this.state.table_id, `[not_active,00:00]`)
            toast.success(this.state.table_name + " di stop.");
        });
    }

    stopTimerLoss(): void {
        ipcRenderer.invoke("start_loss", this.state.table_id, false, false, {}, true, false).then((result) => {
            console.log(`${this.state.table_name} is reset ${result}`);
            this.clearAllState();
            localStorage.setItem(this.state.table_id, `[not_active,00:00]`)
            toast.success(`${this.state.table_name} direset (Loss)`);
        })
    }

    componentDidMount(): void {
        console.log('componentDidMount is called')
        this.getTimeString()
        this.getDataTable()
        this.setState({ modal_close: false })
        console.log(this.state.mode)
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.state.id_booking !== prevState.id_booking) {
            this.getDataTable();
        }
    }

    startTimerLoss() {
        if (this.state.mode !== '' && this.state.nama !== '') {
            swal({
                title: "Apa kamu yakin?",
                text: "Data tidak akan bisa diubah..",
                icon: "warning",
                buttons: ["Batal", true],
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    this.setState({
                        loading: true,
                        disabled: true,
                    });

                    toast.success("Progress: Menyimpan Data... (30%)");

                    setTimeout(() => {
                        toast.success("Progress: Menyimpan Table Lampu... (80%)");
                    }, 1000)

                    setTimeout(() => {
                        const durasi_minute = 1 * 60;
                        const minutetoms = durasi_minute * 60000;

                        const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
                        const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

                        const hours = moment().tz("Asia/Jakarta").format("HH");
                        var shift_now;

                        if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
                            shift_now = {
                                shift: "pagi",
                                durasi: 1,
                                start_jam: shift_pagi.start_jam.split(':')[0],
                                end_jam: shift_pagi.end_jam.split(':')[0]
                            }
                            console.log(shift_now)
                            console.log("Pagi")
                        } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
                            shift_now = {
                                shift: "malam",
                                durasi: 1,
                                start_jam: shift_malam.start_jam.split(':')[0],
                                end_jam: shift_malam.end_jam.split(':')[0]
                            }
                            console.log("malam")
                            console.log(shift_now)
                        }

                        const data_booking = {
                            nama: this.state.nama,
                            durasi_booking: 1,
                            total_harga: this.state.total_harga,
                            tipe_booking: this.state.mode,
                            user_in: sessionStorage.getItem('username'),
                            shift: shift_now,
                        }

                        if (this.state.mode === 'Loss') {
                            ipcRenderer.invoke("start_loss", this.state.table_id, true, false, data_booking, false, false).then(() => {
                                console.log("start loss 01 is created");
                                toast.success(`Progress: ${this.state.table_name} berhasil dinyalakan. (100%)`);
                                this.getDataTable();
                                this.setState({ disabled: false, isUse: true, isOpen: false, modal_close: true, loading: false, info_badges: "terpakai" })
                            });
                        }
                    }, 3000);
                }
            })
        } else {
            toast.error('Nama atau Mode harus diisi!');
        }
    }

    getDataTable(): void {
        const dot = new DotAdded();
        ipcRenderer.invoke("getDataTable", this.state.table_id).then((result) => {
            console.log(result)
            if (result.response === true) {
                if (result.data[0].status_booking === 'lunas') {
                    this.clearAllState();
                } else {
                    var blnk;
                    if (result.data[0].tipe_booking === 'Regular') {
                        blnk = true
                    } else {
                        blnk = false
                    }
                    const get_local = localStorage.getItem(this.state.table_id).replace(/\[|\]/g, '').split(',');
                    console.log(get_local);

                    if (result.data[0].status_booking !== 'not_active') {
                        console.log(result.data[0].id_booking)

                        this.setState({
                            nama: result.data[0].nama_booking,
                            total_harga: dot.parse(result.data[0].total_harga),
                            blink: blnk,
                            mode: result.data[0].tipe_booking,
                            isUse: true,
                            id_booking: result.data[0].id_booking,
                            info_badges: get_local[0] === 'not_active' ? 'berakhir' : 'terpakai'
                        })
                    } else {
                        this.setState({
                            nama: '',
                            total_harga: '0',
                            blink: false,
                            isUse: false,
                            id_booking: '',
                            info_badges: "tersedia",
                        })
                    }
                }
            } else {
                this.clearAllState();
            }
        })
    }

    getTimeString(): void {
        const get_local = localStorage.getItem(this.state.table_id).replace(/\[|\]/g, '').split(',');
        console.log(get_local);
        if (get_local[0] === 'not_active') {
            this.setState({ time_running: false, timer: 'tidak aktif', disabled_addOn: false, info_badges: "berakhir" })
        }
        ipcRenderer.on(this.state.table_id, (event, msg) => {
            this.setState({ timer: msg.data });
            if (msg.reponse === true) {
                if (msg.mode === 'loss') {
                    localStorage.setItem(this.state.table_id, `[active,${msg.data.split(':')[0]}:${msg.data.split(':')[1]}, Loss]`)
                    this.setState({ disabled: true, isUse: true, time_running: true, disabled_add: true, info_badges: "terpakai" })
                    if (msg.data.split(':')[1] === '59' && msg.data.split(':')[2] === '00') {
                        console.log('test loss')

                        const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
                        const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

                        const hours = moment().tz("Asia/Jakarta").format("HH");
                        var shift_now;

                        if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
                            shift_now = {
                                shift: "pagi",
                                durasi: 1,
                                start_jam: shift_pagi.start_jam.split(':')[0],
                                end_jam: shift_pagi.end_jam.split(':')[0]
                            }
                            console.log(shift_now)
                            console.log("Pagi")
                        } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
                            shift_now = {
                                shift: "malam",
                                durasi: 1,
                                start_jam: shift_malam.start_jam.split(':')[0],
                                end_jam: shift_malam.end_jam.split(':')[0]
                            }
                            console.log("malam")
                            console.log(shift_now)
                        }

                        const data_booking = {
                            nama: this.state.nama,
                            total_harga: this.state.total_harga_add,
                            user_in: sessionStorage.getItem('username'),
                            id_booking: this.state.id_booking,
                        }

                        ipcRenderer.invoke('inputPrice', data_booking, shift_now).then((result) => {
                            if (result.response === true) {
                                this.getDataTable();
                            } else {
                                toast.error(`${this.state.table_name} gagal menambah harga (loss)`);
                            }
                        })
                    }


                } else if (msg.mode === 'regular') {
                    localStorage.setItem(this.state.table_id, `[active,${msg.data.split(':')[0]}:${msg.data.split(':')[1]}, Regular]`)
                    this.setState({ disabled: true, isUse: true, time_running: true, disabled_add: true });
                    // disabled_addOn
                    if (msg.data.split(':')[0] === '00' && msg.data.split(':')[1] === '15' && msg.data.split(':')[2] === '00') {
                        this.setState({
                            disabled_addOn: false,
                            info_badges: "hampir_habis",
                        });
                    } else {
                        this.setState({
                            info_badges: "terpakai"
                        })
                    }
                    if (msg.data.split(':')[0] === '00' && msg.data.split(':')[1] <= '15') {
                        this.setState({
                            disabled_addOn: false,
                            info_badges: "hampir_habis",
                            disabled_add: false
                        });
                    }
                }
            } else {
                localStorage.setItem(this.state.table_id, `[not_active,00:00]`)
                this.setState({ time_running: false, timer: 'tidak aktif', disabled_addOn: false, info_badges: "berakhir" })
            }
        })
    }

    openModal(): any {
        this.setState({ isOpen: true });
    }

    closeModal() {
        if (this.state.isUse === false) {
            this.setState({ isOpen: false });
            this.clearAllState();
        } else {
            this.setState({
                isOpen: false,
            });
        }
    }

    continueTimer() {
        swal({
            title: "Apa kamu yakin?",
            text: "Jika tidak error/waktu berhenti maka klik Ok",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                var data = localStorage.getItem(this.state.table_id).replace(/\[|\]/g, '').split(',');

                if (data[0] !== 'not_active') {
                    let current = 1;
                    if (data[2] === ' Regular') {
                        console.log(TimeConvert.textToMS(data, this.state.table_id))
                        turnon(TimeConvert.textToMS(data, this.state.table_id)).then(() => showLoading(current++, 1))
                    } else {
                        turnon(TimeConvert.textToTime(data, this.state.table_id)).then(() => showLoading(current++, 1))

                    }
                }
            }
        });

    }

    handleMember(e) {
        this.setState({
            member: e.target.checked
        });
        console.log(e.target.checked)
    }

    handleInputMember(e) {
        ipcRenderer.invoke("checkMember", { kode_member: e.target.value }).then((result) => {
            if (result.response === true) {
                console.log(result.data[0].playing)
                if (result.data[0].playing === 0 || result.data[0].playing === null || result.data[0].playing.length === 0) {
                    toast.error("Jumlah batas main tidak ada.");
                } else {
                    this.setState({
                        nama_member: result.data[0].nama_member,
                        nama: result.data[0].nama_member,
                        id_member: result.data[0].id_member,
                        potongan: result.data[0].potongan,
                        playing: result.data[0].playing
                    });
                }
            } else {
                this.setState({
                    nama_member: "Member tidak ditemukan...",
                    nama: "",
                })
            }
        })
    }

    handleVoucher(e) {
        if (e.target.value.length === 0) {
            this.setState({
                disabled_voucher: true,
            });
        } else {
            this.setState({
                disabled_voucher: false,
                voucher: e.target.value,
            });
        }
    }

    handleCheckVoucher() {
        ipcRenderer.invoke("checkVoucher", { kode_voucher: this.state.voucher }).then((result) => {
            console.log(result);
            if (result.response === true) {
                var data_new = "";
                const total_harga = new DotAdded().decode(this.state.total_harga) * ((100 - parseFloat(result.data[0].potongan)) / 100);

                this.state.raw_detail_h.map((el) => {
                    const final = el.harga * ((100 - parseFloat(result.data[0].potongan)) / 100);
                    el['harga'] = final;
                });

                this.state.raw_detail_h.forEach(element => {
                    data_new += `<li>(${element.end_duration}) ${element.tipe} = Rp. ${new DotAdded().parse(element.harga)}</li>`
                });

                this.setState({
                    total_harga: new DotAdded().parse(total_harga),
                    raw_detail_h: this.state.raw_detail_h,
                    harga_detail: data_new,
                    potongan: result.data[0].potongan,
                });

                toast.success("Voucher Digunakan");
            } else {
                const dot = new DotAdded();
                ipcRenderer.invoke("checkHarga", this.state.jam).then((result) => {
                    console.log(result);
                    var data_new = ""
                    if (result.response) {
                        result.harga_detail.map(el => {
                            const final = el.harga * ((100 - parseFloat("0")) / 100);
                            el['harga'] = final;
                        });

                        result.harga_detail.forEach(element => {
                            data_new += `<li>(${element.end_duration}) ${element.tipe} = Rp. ${dot.parse(element.harga)}</li>`
                        });

                        const total_harga = result.total_harga * ((100 - parseFloat("0")) / 100);

                        this.setState({ harga_detail: data_new, total_harga: dot.parse(total_harga), raw_detail_h: result.harga_detail, potongan: 0, })
                        this.validation()
                    } else {
                        toast.error("Terjadi kesalahan pada mengitung jam!")
                    }
                });
                toast.error("Voucher tidak berlaku.");
            }
        });
    }

    handlePindahTable() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data tidak akan bisa diubah..",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data = {
                    id_booking: this.state.id_booking,
                    id_table_1: this.state.table_id,
                    blink: this.state.blink,
                    pindah: this.state.pindah,
                }
                var data_time = localStorage.getItem(this.state.table_id).replace(/\[|\]/g, '').split(',');
                const time = TimeConvert.textToMS(data_time, this.state.table_id);

                console.log(time.milliseconds);

                if (this.state.mode === "Regular") {
                    ipcRenderer.invoke("start", this.state.table_id, time.milliseconds, 0, this.state.blink, false, false, 0, 0, data, false, false, false, true)
                        .then((result) => {
                            console.log(result);
                            if (result.response === true) {
                                setTimeout(() => {
                                    localStorage.setItem(this.state.table_id, "[not_active,00:00]");
                                    window.location.reload();
                                }, 2000)
                            } else {
                                toast.error("Terjadi kesalahan");
                            }
                        });
                } else {
                    swal("Infomasi", "Pindah meja tidak bisa untuk mode Loss, tunggu diversi 3.0.1 :'>", "info");
                }
                // ipcRenderer.invoke("pindahMeja", this.state.pindah, time.milliseconds, 0, data).then((result) => {
                //     console.log(result);
                //     if (result.response === true) {
                //         localStorage.setItem(this.state.table_id, "[not_active,00:00]");
                //         window.location.reload();
                //     } else {
                //         toast.error("Terjadi kesalahan");
                //     }
                // })
            }
        });
    }

    render(): React.ReactNode {
        let modal, badges, badges_mode;
        if (this.state.isUse === false) {
            modal = <ModalBooking table_name={this.state.table_name} handleMode={this.handleMode} mode={this.state.mode} handleJam={this.handleJam} startTimer={this.startTimer} handleNama={this.handleNama} disableSubmit={this.state.disabled} harga_detail={this.state.harga_detail} total_harga={this.state.total_harga} jam={this.state.jam} handleBlink={this.handleBlink} table_id={this.state.table_id} isOpen={this.state.isOpen} closeModal={this.closeModal} mode_loss={this.state.mode_loss} startTimerLoss={this.startTimerLoss} handleMember={this.handleMember} member={this.state.member} handleInputMember={this.handleInputMember} nama_member={this.state.nama_member} disabled_voucher={this.state.disabled_voucher} handleVoucher={this.handleVoucher} handleCheckVoucher={this.handleCheckVoucher} potongan={this.state.potongan} loading={this.state.loading} />
        } else if (this.state.isUse === true) {
            modal = <ModalBookingActive table_name={this.state.table_name} name_customer={this.state.nama} id_booking={this.state.id_booking} table_id={this.state.table_id} stopTimer={this.stopTimer} stopTimerLoss={this.stopTimerLoss} handlePindah={this.handlePindah} jam={this.state.jam_add} harga_detail={this.state.harga_detail} total_harga_add={this.state.total_harga_add} total_harga={this.state.total_harga} handleJam={this.handleJamAdd} isOpen={this.state.isOpen} closeModal={this.closeModal} handleBlinkAdd={this.handleBlinkAdd} addOn={this.addOn} disabled_add={this.state.disabled_add} resetTable={this.resetTable} mode={this.state.mode} time_running={this.state.time_running} continueTimer={this.continueTimer} loading_addon={this.state.loading_addon} getDataTable={this.getDataTable} handlePindahTable={this.handlePindahTable} disabled_addOn={this.state.disabled_addOn} />
        }

        if (this.state.isUse) {
            if (this.state.info_badges === "terpakai") {
                badges = <span className="badge rounded-pill text-bg-danger mb-2">Terpakai</span>
            } else if (this.state.info_badges === "hampir_habis") {
                badges = <span className="badge rounded-pill text-bg-warning mb-2">Hampir Habis</span>
            } else if (this.state.info_badges === "berakhir") {
                badges = <span className="badge rounded-pill text-bg-info mb-2">Berakhir</span>
            }
        } else {
            badges = <span className="badge rounded-pill text-bg-success mb-2">Tersedia</span>
        }

        if (this.state.mode === 'Regular') {
            badges_mode = <span className="badge rounded-pill mr-2 text-bg-light">Regular</span>
        } else if (this.state.mode === 'Loss') {
            badges_mode = <span className="badge rounded-pill mr-2 text-bg-light">Loss</span>
        }

        return (
            <>
                <div className="col" onClick={this.openModal} data-bs-toggle="modal" data-bs-target={this.state.isUse === true ? "#bookingActive" + this.state.table_id : "#booking" + this.state.table_id}>
                    <ToastContainer
                        position="bottom-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                    <div className="card card-custom-dark h-100 card-table">
                        {/* <img src="assets/img/billiard-dark.png" className="img-billiard" alt="..." /> */}
                        <div className="card-body">
                            <div className="container-biliiard">
                                {badges}
                                &nbsp;{badges_mode}
                                <h4>{this.state.table_name}</h4>
                                <small>Nama pemesan</small>
                                <p><b>{this.state.nama}</b></p>
                                <div className="d-flex mt-2">
                                    <div className="p-1">
                                        <img src="assets/img/icon/rp_2.png" alt="" />
                                    </div>
                                    <div className="p-1">
                                        <p id="">Rp. {this.state.total_harga}</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="p-1">
                                        <img src="assets/img/icon/clock.png" alt="" />
                                    </div>
                                    <div className="p-1">
                                        <p>{this.state.timer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {modal}
            </>


        )
    }
}



export default Table_01;