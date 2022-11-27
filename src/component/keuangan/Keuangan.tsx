import { ipcRenderer } from "electron";
import React from "react";
import DotAdded from "../../system/DotAdded";
import { Header, ModalUser } from "../header/header";
import Sidebar from "../sidebar/sidebar";
import NavbarKeuangan from "./NavbarKeuangan";
import DataTable, { createTheme } from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";
import 'moment-timezone';



createTheme('solarized', {
    background: {
        default: '#1A1B1F'
    },
    text: {
        primary: '#fff',
        secondary: '#fff'
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#fff',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: '#fff',
    },
}, 'dark')

const ExpandableRowComponent: React.FC<any> = ({ data }) => {
    const dot = new DotAdded();
    var data_cart;
    var data_detail_booking;
    ipcRenderer.invoke("keuangan", false, true, false, data.id_pesanan).then((result) => {
        if (result.response === true) {
            data_cart = result.data;
        }
    });

    ipcRenderer.invoke("keuangan", false, false, true, data.id_booking).then((result) => {
        if (result.response === true) {
            data_detail_booking = result.data;
        }
    });


    return (
        <>
        </>
    )
}

class Keuangan extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            column: [
                {
                    name: "No",
                    selector: row => row.number,
                    sortable: true
                },
                {
                    name: "Order ID",
                    selector: row => row.id_struk,
                    sortable: true,
                },
                {
                    name: "Nama",
                    selector: row => row.nama_customer,
                    sortable: true,
                },
                {
                    name: "Total",
                    selector: row => row.total_struk_val,
                    sortable: true,
                },
                {
                    name: "Tanggal",
                    selector: row => row.created_at,
                    sortable: true,
                }
            ],
            total_harian: 0,
            total_bulanan: 0,
            tanggal: '',
            bulan: ''
        }
    }


    getDataKeuangan() {
        const dot = new DotAdded();
        ipcRenderer.invoke("keuangan", true, false, false, {}).then((result) => {
            console.log(result);
            if (result.response === true) {
                let i = 1;
                result.data.map((el) => {
                    el['number'] = i++;
                    el['total_struk_val'] = `Rp. ${dot.parse(el.total_struk)}`
                });

                let total_hari = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
                    const day_filter = moment(get_date, "DD-MM-YYYY").format("DD-MM-YYYY");
                    if (day_now === day_filter) {
                        total_hari += el.total_struk;
                    }
                })

                let total_bulan = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                    const date_filter = moment(get_date, "DD-MM-YYYY").format("MM-YYYY");
                    if (date_now === date_filter) {
                        total_bulan += el.total_struk;
                    }
                })


                this.setState({
                    data: result.data,
                    total_harian: dot.parse(total_hari),
                    total_bulanan: dot.parse(total_bulan),
                    tanggal: moment().tz("Asia/Jakarta").format("DD-MM-YYYY"),
                    bulan: moment().tz("Asia/Jakarta").subtract(1, "month").format("MMMM")
                });
            }
        })
    }

    componentDidMount(): void {
        this.getDataKeuangan();
    }

    render(): React.ReactNode {
        return (
            <>

                <div className="hr-white"></div>
                <div className="d-flex mb-2">
                    <div className="p-1">
                        <a href="list_transaksi.html" className="btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">
                            Transaksi Billing</a>
                    </div>

                    <div className="p-1">
                        <a href="list_cafe.html" className="btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">
                            Transaksi Cafe</a>
                    </div>

                    <div className="p-1">
                        <a href="list_stok_cafe.html" className="btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">
                            Cafe Stok</a>
                    </div>
                    <div className="p-1">
                        <a href="list_stok_masuk.html" className="btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">
                            Stok Masuk</a>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <div className="card card-custom">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total penghasilan billing hari ini:</h4>
                                    <h4>Rp. <span id="total_hari">{this.state.total_harian}</span></h4>
                                    <p id="date_locale">{this.state.tanggal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card card-custom" style={{ 'backgroundColor': "#1A1B1F !important" }}>
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total penghasilan billing bulan ini:</h4>
                                    <h4>Rp. <span id="total_bulan">{this.state.total_bulanan}</span></h4>
                                    <p id="date_locale_bulan">{this.state.bulan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="keuangan-list mt-2 mb-5">
                    <div className="card card-custom-dark">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 w-100">
                                    <h4>List Transaksi Billing</h4>
                                </div>

                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <DataTable columns={this.state.column} data={this.state.data} pagination theme="solarized" selectableRows expandableRows selectableRowsSingle />
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

class KeuanganContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <NavbarKeuangan />
                        <Keuangan />
                    </div>
                </div>
                <ModalUser />
            </>

        )
    }
}

export default KeuanganContainer;