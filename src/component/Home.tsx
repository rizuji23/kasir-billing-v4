import { throws } from "assert";
import { ipcRenderer } from "electron";
import { resolve } from "path";
import React from "react";
import swal from 'sweetalert';
import TimeConvert from '../system/TimeConvert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Table_01, Table_02 } from './table/Tables';
import Loading from "./Loading";
import moment from "moment";
import 'moment-timezone';
import Table_03 from "./table/table_sys/Table_03";
import Table_04 from "./table/table_sys/Table_04";
import Table_05 from "./table/table_sys/Table_05";
import Table_06 from "./table/table_sys/Table_06";
import Table_07 from "./table/table_sys/Table_07";
import Table_08 from "./table/table_sys/Table_08";
import Table_09 from "./table/table_sys/Table_09";
import Table_10 from "./table/table_sys/Table_10";
import Table_11 from "./table/table_sys/Table_11";
import Table_12 from "./table/table_sys/Table_12";

async function turnon(id) {
    return new Promise((res) => {
        if (id.mode === 'Regular') {
            const id_table = id.table;
            const ms = id.milliseconds;

            ipcRenderer.invoke('start', id_table, ms, 0, true, false, false, 0, 0, {}, true, false).then((result) => {
                console.log("called regular")
                res(result);
            });
        } else if (id.mode === 'Loss') {
            const id_table = id.table;

            ipcRenderer.invoke("start_loss", id_table, false, false, id, false, true).then((result) => {
                console.log("called loss")
                res(result);
            });
        }
    })
}

class Home extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading_show: false,
            loading_title: '',
            timer: {
                table001: "",
                table002: "",
                table003: "",
                table004: "",
                table005: "",
                table006: "",
                table007: "",
                table008: "",
                table009: "",
                table010: "",
                table011: "",
                table012: "",
            },
            isUse: {
                table001: "",
                table002: "",
                table003: "",
                table004: "",
                table005: "",
                table006: "",
                table007: "",
                table008: "",
                table009: "",
                table010: "",
                table011: "",
                table012: "",
            },
            booking_aktif: "Loading...",
            perhatian_stok: false,
            isConnected: "",
            time: "Loading...",
            shift: false,
            shift_content: "",
            shift_text: "",
        }

        // this.getTime = this.getTime.bind(this);
        this.getAllTable = this.getAllTable.bind(this);
        this.getPerhatian = this.getPerhatian.bind(this);
        this.getTime = this.getTime.bind(this);
        this.getOpen = this.getOpen.bind(this);
    }

    getTime() {
        setInterval(() => {
            this.setState({
                time: moment().tz("Asia/Jakarta").format("HH:mm:ss")
            });

            const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
            const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

            const hours = moment().tz("Asia/Jakarta").format("HH");

            if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
                this.setState({
                    shift_text: "Pagi",
                });
            } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
                this.setState({
                    shift_text: "Malam",
                });
            }

            if (hours === shift_pagi.start_jam.split(':')[0]) {
                this.setState({
                    shift: true,
                    shift_content: "Saatnya Pergantian shift ke Pagi.",
                });
            } else {
                this.setState({
                    shift: false,
                })
            }

            if (hours === shift_malam.start_jam.split(':')[0]) {
                this.setState({
                    shift: true,
                    shift_content: "Saatnya Pergantian shift ke Malam.",
                });
            } else {
                this.setState({
                    shift: false,
                })
            }

        }, 1000);
    }

    continueTimer() {
        console.log('continue');
        swal({
            title: "Apa kamu yakin?",
            text: "Jika waktu ada yang berjalan, maka klik Batal",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const arr = Array<string>('table001', 'table002', 'table003', 'table004', 'table005', 'table006', 'table007', 'table008', 'table009', 'table010', 'table011', 'table012');

                    const arr_null = Array<string>();
                    const arr_fine_regular = Array<any>();

                    arr.forEach(el => {
                        if (localStorage.getItem(el) !== null) {
                            var data = localStorage.getItem(el).replace(/\[|\]/g, '').split(',');
                            console.log(data);
                            console.log(data[1])
                            if (data[0] !== 'not_active' && data[1] !== "00:00") {
                                console.log("IN")
                                if (data[2] === ' Regular') {
                                    arr_fine_regular.push(TimeConvert.textToMS(data, el));
                                } else {
                                    arr_fine_regular.push(TimeConvert.textToTime(data, el));
                                }
                            }
                        } else {
                            console.log(`${el} is null`);
                            arr_null.push(el);
                        }
                    });

                    let current = 1;
                    if (arr_fine_regular.length !== 0) {
                        Promise.all(arr_fine_regular.map(async (val, i) => {
                            setTimeout(() => {
                                turnon(val).then(() => toast.success("Progress " + Math.ceil(current++ * 100 / arr_fine_regular.length)));
                            }, 2000 * current++);
                        }));
                    } else {
                        toast.info(`Tidak ada waktu yang dijalankan.`);
                    }
                }
            });
    }

    // getTime(time, isUse, table_id) {
    //     console.log(table_id)
    //     if (table_id === "table001") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table001: time,
    //             }
    //         }));

    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table001: isUse
    //             }
    //         }))
    //     } else if (table_id === "table002") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table002: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table002: isUse
    //             }
    //         }));
    //     } else if (table_id === "table003") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table003: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table003: isUse
    //             }
    //         }));
    //     } else if (table_id === "table004") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table004: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table004: isUse
    //             }
    //         }));
    //     } else if (table_id === "table005") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table005: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table005: isUse
    //             }
    //         }));
    //     } else if (table_id === "table006") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table006: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table006: isUse
    //             }
    //         }));
    //     } else if (table_id === "table007") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table007: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table007: isUse
    //             }
    //         }));
    //     } else if (table_id === "table008") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table008: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table008: isUse
    //             }
    //         }));
    //     } else if (table_id === "table009") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table009: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table009: isUse
    //             }
    //         }));
    //     } else if (table_id === "table010") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table010: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table010: isUse
    //             }
    //         }));
    //     } else if (table_id === "table011") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table011: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table011: isUse
    //             }
    //         }));
    //     } else if (table_id === "table012") {
    //         this.setState(prevState => ({
    //             timer: {
    //                 ...prevState.timer,
    //                 table012: time,
    //             }
    //         }));
    //         this.setState(prevState => ({
    //             isUse: {
    //                 ...prevState.isUse,
    //                 table012: isUse
    //             }
    //         }));
    //     }
    // }

    componentDidMount(): void {
        this.getAllTable();
        this.getPerhatian();
        this.getTime();
        this.getOpen();
    }

    getAllTable(): void {
        ipcRenderer.invoke("getAllTable", true).then((result) => {
            var active = 0;
            const all = result.data.length;
            result.data.forEach(el => {
                if (el.status === "active") {
                    active += 1;
                }
            });

            this.setState({
                booking_aktif: `${active} / ${all}`,
            });
        });
    }

    getPerhatian() {
        const day = {
            tanggal: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
        }

        ipcRenderer.invoke("getStok", day).then((result) => {
            if (result.response === true) {
                this.setState({
                    perhatian_stok: false,
                });
            } else {
                this.setState({
                    perhatian_stok: true,
                });
            }
        })
    }

    getOpen() {
        setInterval(() => {
            ipcRenderer.invoke("getOpen").then((result) => {
                if (result === false) {
                    this.setState({
                        isConnected: false,
                    });
                } else {
                    this.setState({
                        isConnected: true,
                    });
                }
            });
        }, 1000);
    }

    render(): React.ReactNode {

        return (
            <>
                <div className="overview-pemb mb-5">
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


                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex mb-2">
                                <div className="p-1">
                                    <div className="title-header-box">
                                        <h3>Table List</h3>
                                    </div>
                                </div>

                                {/* <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">Home</a>
                                </div>

                                <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">List
                                        Transaksi</a>
                                </div> */}
                            </div>

                        </div>
                        <div className="col-sm">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)" onClick={() => window.location.reload()}
                                        className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10"
                                        id="refresh_table"><img src="assets/img/icon/refresh-ccw.png" alt="" /></a>
                                </div>
                                <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"
                                        onClick={this.continueTimer}>Lanjutkan Timer</a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="d-flex">
                        <div className="p-2 me-auto w-100 table-box">
                            <div className="row row-cols-1 row-cols-5 g-3 " id="table_billiard">
                                <Table_01 />
                                <Table_02 />
                                <Table_03 />
                                <Table_04 />
                                <Table_05 />
                                <Table_06 />
                                <Table_07 />
                                <Table_08 />
                                <Table_09 />
                                <Table_10 />
                                <Table_11 />
                                <Table_12 />
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="side-home">
                                <div className="booking-count">
                                    <h4>Total Booking Aktif</h4>
                                    <h1>{this.state.booking_aktif}</h1>
                                </div>

                                <div className="mt-3 text-light">
                                    <div className="booking-count">
                                        <h4 className="text-center mb-3">Jam</h4>
                                        <h4 style={{ color: "#ff8a00", fontSize: 23 }}>{this.state.time}</h4>

                                        <h4 className="text-center mb-3 mt-3">Shift</h4>
                                        <h4 style={{ color: "#ff8a00", fontSize: 23 }}>{this.state.shift_text}</h4>
                                    </div>
                                </div>
                                <div className="perhatian-box">
                                    <h5>Perhatian: </h5>
                                    <div className="status-box mb-3">
                                        <h6 style={{ color: 'white' }}>Info Status Table</h6>
                                        <div className="row">

                                            <div className="col-sm">
                                                <div className="status-container">
                                                    <div className="status s-tersedia"></div>
                                                    <div><p>Tersedia</p></div>
                                                </div>
                                            </div>
                                            <div className="col-sm">
                                                <div className="status-container">
                                                    <div className="status s-terpakai"></div>
                                                    <div><p>Terpakai</p></div>
                                                </div>
                                            </div>
                                            <div className="col-sm">
                                                <div className="status-container">
                                                    <div className="status s-hampir-habis"></div>
                                                    <div><p>Hampir Habis</p></div>
                                                </div>
                                            </div>
                                            <div className="col-sm">
                                                <div className="status-container">
                                                    <div className="status s-berakhir"></div>
                                                    <div><p>Berakhir</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h5>Notifikasi: </h5>
                                    {this.state.perhatian_stok && <div className="alert alert-danger"><span style={{ fontSize: 15 }}>Laporan Stok masih kosong!.</span></div>}
                                    {this.state.isConnected === false && <div className="alert alert-danger">
                                        <span>Box Billing <b>Tidak Tersambung</b>!.</span>
                                    </div>}
                                    {this.state.shift && <div className="alert alert-info"><span style={{ fontSize: 15 }}>{this.state.shift_content}</span></div>}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </>
        )
    }
}



export default Home