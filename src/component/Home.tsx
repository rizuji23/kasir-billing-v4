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
        }

        this.getTime = this.getTime.bind(this);
        this.getAllTable = this.getAllTable.bind(this);
        this.getPerhatian = this.getPerhatian.bind(this);
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
                            console.log(data)
                            if (data[0] !== 'not_active') {
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
                        toast.info(`Tidak ada waktu yang dijalankan!`);
                    }
                }
            });
    }

    getTime(time, isUse, table_id) {
        console.log(table_id)
        if (table_id === "table001") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table001: time,
                }
            }));

            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table001: isUse
                }
            }))
        } else if (table_id === "table002") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table002: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table002: isUse
                }
            }));
        } else if (table_id === "table003") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table003: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table003: isUse
                }
            }));
        } else if (table_id === "table004") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table004: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table004: isUse
                }
            }));
        } else if (table_id === "table005") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table005: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table005: isUse
                }
            }));
        } else if (table_id === "table006") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table006: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table006: isUse
                }
            }));
        } else if (table_id === "table007") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table007: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table007: isUse
                }
            }));
        } else if (table_id === "table008") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table008: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table008: isUse
                }
            }));
        } else if (table_id === "table009") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table009: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table009: isUse
                }
            }));
        } else if (table_id === "table010") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table010: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table010: isUse
                }
            }));
        } else if (table_id === "table011") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table011: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table011: isUse
                }
            }));
        } else if (table_id === "table012") {
            this.setState(prevState => ({
                timer: {
                    ...prevState.timer,
                    table012: time,
                }
            }));
            this.setState(prevState => ({
                isUse: {
                    ...prevState.isUse,
                    table012: isUse
                }
            }));
        }
    }

    componentDidMount(): void {
        this.getAllTable();
        this.getPerhatian();
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
                    <div>
                        <div id="error_handler">
                        </div>
                    </div>

                    <div className="d-flex">
                        <div className="p-2 me-auto w-100 table-box">
                            <div className="row row-cols-1 row-cols-5 g-4 " id="table_billiard">
                                <Table_01 getTime={this.getTime} />
                                <Table_02 getTime={this.getTime} />
                                <Table_03 getTime={this.getTime} />
                                <Table_04 getTime={this.getTime} />
                                <Table_05 getTime={this.getTime} />
                                <Table_06 getTime={this.getTime} />
                                <Table_07 getTime={this.getTime} />
                                <Table_08 getTime={this.getTime} />
                                <Table_09 getTime={this.getTime} />
                                <Table_10 getTime={this.getTime} />
                                <Table_11 getTime={this.getTime} />
                                <Table_12 getTime={this.getTime} />
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="side-home">
                                <div className="booking-count">
                                    <h4>Total Booking Aktif</h4>
                                    <h1>{this.state.booking_aktif}</h1>
                                </div>

                                <div className="list-booking">
                                    <h5>No Table: </h5>
                                    <div className="d-flex">
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 01</p>
                                                <span>{this.state.timer.table001}</span>
                                                {this.state.isUse.table001 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 02</p>
                                                <span>{this.state.timer.table002}</span>
                                                {this.state.isUse.table002 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 03</p>
                                                <span>{this.state.timer.table003}</span>
                                                {this.state.isUse.table003 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 04</p>
                                                <span>{this.state.timer.table004}</span>
                                                {this.state.isUse.table004 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 05</p>
                                                <span>{this.state.timer.table005}</span>
                                                {this.state.isUse.table005 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 06</p>
                                                <span>{this.state.timer.table006}</span>
                                                {this.state.isUse.table006 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 07</p>
                                                <span>{this.state.timer.table007}</span>
                                                {this.state.isUse.table007 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 08</p>
                                                <span>{this.state.timer.table008}</span>
                                                {this.state.isUse.table008 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 09</p>
                                                <span>{this.state.timer.table009}</span>
                                                {this.state.isUse.table009 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 10</p>
                                                <span>{this.state.timer.table010}</span>
                                                {this.state.isUse.table010 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 11</p>
                                                <span>{this.state.timer.table011}</span>
                                                {this.state.isUse.table011 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="content-list text-center">
                                                <p>Table 12</p>
                                                <span>{this.state.timer.table012}</span>
                                                {this.state.isUse.table012 === true ? <span className="badge rounded-pill text-bg-danger">Terpakai</span> : <span className="badge rounded-pill text-bg-success">Tersedia</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="perhatian-box">
                                    <h5>Perhatian: </h5>
                                    <div className="status-box mb-3">
                                        <h6 style={{ color: 'white' }}>Info Status Table</h6>
                                        <div className="d-flex">

                                            <div className="p-1">
                                                <div className="status-container">
                                                    <div className="status s-tersedia"></div>
                                                    <div><p>Tersedia</p></div>
                                                </div>
                                            </div>
                                            <div className="p-1">
                                                <div className="status-container">
                                                    <div className="status s-terpakai"></div>
                                                    <div><p>Terpakai</p></div>
                                                </div>
                                            </div>
                                            <div className="p-1">
                                                <div className="status-container">
                                                    <div className="status s-hampir-habis"></div>
                                                    <div><p>Hampir Habis</p></div>
                                                </div>
                                            </div>
                                            <div className="p-1">
                                                <div className="status-container">
                                                    <div className="status s-berakhir"></div>
                                                    <div><p>Berakhir</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.perhatian_stok && <div className="alert alert-danger"><span style={{ fontSize: 15 }}>Laporan Stok masih kosong,<br />Silahkan <b>Buka Stok Baru</b> terlebih dahulu.</span></div>}

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