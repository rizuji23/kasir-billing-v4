import { throws } from "assert";
import { ipcRenderer } from "electron";
import { resolve } from "path";
import React from "react";
import swal from 'sweetalert';
import TimeConvert from '../system/TimeConvert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Table_01 from './table/Table_01';
import Loading from "./Loading";

async function turnon(id) {
    return new Promise(res => {
        setTimeout(() => {
            console.log(id.table);
            const id_table = id.table;
            const ms = id.milliseconds;
            console.log(ms)

            ipcRenderer.invoke('start', id_table, ms, 0, true, false, false, 0, 0, {}, true, false).then((result) => {
                console.log("called")
                res(result)
            });
        }, 1000);
    });
}

function showLoading(current, max) {
    toast.info(`Table dinyalakan tunggu sebentar ${current} - ${max}`);
    if (current === max) {
        toast.success('Semua table sudah dinyalakan...')
    }
}

class Home extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading_show: false,
            loading_title: ''
        }
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
                                    console.log("nyusul")
                                }
                            }
                        } else {
                            console.log(`${el} is null`);
                            arr_null.push(el);
                        }
                    });

                    let current = 1;
                    if (arr_fine_regular.length !== 0) {
                        arr_fine_regular.map((val, i) => turnon(val).then(() => showLoading(current++, arr_fine_regular.length)));
                    } else {
                        toast.info(`Tidak ada waktu yang dijalankan!`);
                    }
                }
            });
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
                                    <a href="javascript:void(0)"
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
                    <div className="row row-cols-1 row-cols-sm-3 g-4" id="table_billiard">
                        <Table_01 />
                        {/* <Table_02/>
                    <Table_03/>
                    <Table_04/>
                    <Table_05/>
                    <Table_06/>
                    <Table_07/>
                    <Table_08/>
                    <Table_09/>
                    <Table_10/>
                    <Table_11/>
                    <Table_12/> */}
                    </div>
                </div>
            </>
        )
    }
}



export default Home