import { ipcRenderer } from "electron";
import React, { useState } from "react";
import DotAdded from "../../../system/DotAdded";
import { Header, ModalUser } from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import NavbarKeuangan from "../NavbarKeuangan";
import DataTable, { createTheme } from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";
import 'moment-timezone';
import NavbarTransaksi from "../NavbarTransaksi";
import ModalFilter from "../../pengaturan/ModalFilter";
import ModalFilterShift from "./ModalFilterShift";



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

    const [data_cart, set_cart] = useState({
        data_cart: "Waiting Data...",
        total_keuntungan: 0,
        total_modal: 0
    });


    // get cart
    async function get_cart(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke("keuangan", false, true, false, data).then((result) => {
                if (result.response === true) {
                    const data = result.data.map((el, i) => {
                        return (
                            <>
                                <li>
                                    {el.nama_menu === null ? <span className="text-danger">Uknown</span> : el.nama_menu} @{el.qty} Rp. {el.harga_menu === null ? 0 : dot.parse(el.harga_menu)} = Rp. {dot.parse(el.sub_total)}
                                    <div className="d-flex">
                                        <div className="p-1">
                                            <span className="badge rounded-pill mr-2 text-bg-light">Modal: Rp. {el.modal === null ? 0 : dot.parse(el.modal)}</span>
                                        </div>

                                        <div className="p-1">
                                            <span className="badge rounded-pill mr-2 text-bg-success">Keuntungan: Rp. {el.keuntungan === null ? 0 : dot.parse(el.keuntungan)}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="p-1">
                                            <span className="badge rounded-pill mr-2 text-bg-light">Total Modal: Rp. {el.modal === null ? 0 : dot.parse(el.modal * el.qty)}</span>
                                        </div>

                                        <div className="p-1">
                                            <span className="badge rounded-pill mr-2 text-bg-success">Total Keuntungan: Rp. {el.keuntungan === null ? 0 : dot.parse(el.keuntungan * el.qty)}</span>
                                        </div>
                                    </div>
                                </li>
                            </>
                        )
                    });

                    const total_modal = result.data.reduce((total, arr) => {
                        const kali = arr?.modal * arr.qty;
                        return total + kali;
                    }, 0);

                    const total_keuntungan = result.data.reduce((total, arr) => {
                        const kali = arr?.keuntungan * arr.qty;
                        return total + kali;
                    }, 0);


                    res({ data: data, total_modal: total_modal, total_keuntungan: total_keuntungan });
                } else {
                    rej("Data malam is empty")
                }
            });
        })
    }

    get_cart(data.id_pesanan).then((data: any) => {
        set_cart(previousState => {
            return { ...previousState, data_cart: data.data, total_keuntungan: data.total_keuntungan, total_modal: data.total_modal }
        })
    }).catch((rej) => {
        set_cart(previousState => {
            return { ...previousState, data_cart: rej }
        })
    });

    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>Order ID</small><br /> <b>{data.id_struk}</b></li>
                <li className="list-group-item"><small>Nama Customer</small><br /> <b>{data.nama_customer}</b></li>
                <li className="list-group-item"><small>Detail Cafe</small><br /> <ul>{data_cart.data_cart}</ul>
                    <br /> Total Modal: <b>Rp. {data_cart.total_modal !== null ? dot.parse(data_cart.total_modal) : 0}</b>
                    <br /> Total Keuntungan: <b>Rp. {data_cart.total_keuntungan !== null ? dot.parse(data_cart.total_keuntungan) : 0}</b>
                    <br /> Total Semua: <b>Rp. {data.total !== null ? dot.parse(data.total) : 0}</b>
                </li>
                <li className="list-group-item"><small>Total Semua</small><br /> <b>Rp. {dot.parse(data.total_struk)}</b></li>
                <li className="list-group-item"><small>Uang Cash</small><br /> <b>Rp. {dot.parse(data.cash_struk)}</b></li>
                <li className="list-group-item"><small>Kembalian</small><br /> <b>Rp. {dot.parse(data.kembalian_struk)}</b></li>
                <li className="list-group-item"><small>Kasir Input</small><br /> <b>{data.user_in}</b></li>
                <li className="list-group-item"><small>Created At</small><br /> <b>{data.created_at}</b></li>
            </ul>
        </>
    )
}

class CafeMalam extends React.Component<any, any> {
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
            bulan: '',
            isOpen: false,
            reset_disable: true,
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }


    getDataKeuangan() {
        const dot = new DotAdded();
        ipcRenderer.invoke("keuangan_cafe_shift").then((result) => {
            console.log(result);
            if (result.response === true) {
                let i = 1;
                result.data.map((el) => {
                    if (el.shift === "malam") {
                        el['number'] = i++;
                        el['total_struk_val'] = `Rp. ${dot.parse(el.total_struk)}`
                    }
                });

                let total_hari = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
                    const day_filter = moment(get_date, "DD-MM-YYYY").format("DD-MM-YYYY");
                    if (day_now === day_filter && el.shift === "malam") {
                        total_hari += el.total_struk;
                    }
                });

                let total_bulan = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                    const date_filter = moment(get_date, "DD-MM-YYYY").format("MM-YYYY");
                    if (date_now === date_filter && el.shift === "malam") {
                        total_bulan += el.total_struk;
                    }
                });

                this.setState({
                    data: result.data.filter(o => o.shift === "malam"),
                    total_harian: dot.parse(total_hari),
                    total_bulanan: dot.parse(total_bulan),
                    tanggal: moment().tz("Asia/Jakarta").format("DD-MM-YYYY"),
                    bulan: moment().tz("Asia/Jakarta").subtract(0, "month").format("MMMM")
                });
            }
        })
    }

    componentDidMount(): void {
        this.getDataKeuangan();
    }

    openModal(): any {
        this.setState({ isOpen: true });
    }

    closeModal() {
        this.setState({ isOpen: false });
    }

    handleFilter(dari_tanggal, sampai_tanggal) {
        const data_filter = {
            data: this.state.data,
            dari_tanggal: dari_tanggal,
            sampai_tanggal: sampai_tanggal
        }
        const dot = new DotAdded();

        ipcRenderer.invoke("filterByDateCafeShift", data_filter).then((result) => {
            if (result.response === true) {
                let i = 1;
                result.data.map((el) => {
                    if (el.shift === "malam") {
                        el['number'] = i++;
                        el['total_struk_val'] = `Rp. ${dot.parse(el.total_struk)}`
                    }
                });

                let total_hari = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
                    const day_filter = moment(get_date, "DD-MM-YYYY").format("DD-MM-YYYY");
                    if (day_now === day_filter && el.shift === "malam") {
                        total_hari += el.total_struk;
                    }
                });

                let total_bulan = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                    const date_filter = moment(get_date, "DD-MM-YYYY").format("MM-YYYY");
                    if (date_now === date_filter && el.shift === "malam") {
                        total_bulan += el.total_struk;
                    }
                });

                toast.success("Data malam berhasil difilter.");

                this.setState({
                    data: result.data.filter(o => o.shift === "malam"),
                    total_harian: dot.parse(total_hari),
                    total_bulanan: dot.parse(total_bulan),
                    tanggal: `${moment(dari_tanggal).format("DD-MM-YYYY")} ~ ${moment(sampai_tanggal).format("DD-MM-YYYY")}`,
                    bulan: `${moment(dari_tanggal).subtract(0, "month").format("MMMM")} ~ ${moment(sampai_tanggal).subtract(0, "month").format("MMMM")}`,
                    isOpen: false,
                    reset_disable: false,
                });
            } else {
                toast.error("Data malam kosong!");
                this.getDataKeuangan();
                this.setState({
                    isOpen: false,
                });
            }
        })
    }

    resetFilter() {
        toast.success("Filter malam berhasil direset.");
        this.getDataKeuangan();
        this.setState({
            reset_disable: true,
        })
    }

    render(): React.ReactNode {
        return (
            <>
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
                        <div className="card card-custom">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total penghasilan cafe hari ini:</h4>
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
                                    <h4>Total penghasilan cafe bulan ini:</h4>
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
                                    <h4>List Transaksi Cafe</h4>
                                </div>
                                <div className="p-2 me-auto">
                                    <button className="btn btn-primary btn-primary-cozy" onClick={this.openModal}>Filter</button>
                                </div>
                                <div className="p-2 me-auto">
                                    <button className="btn btn-primary btn-primary-cozy-dark" disabled={this.state.reset_disable} onClick={this.resetFilter}>Reset</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <DataTable columns={this.state.column} data={this.state.data} pagination theme="solarized" expandableRows selectableRowsSingle expandableRowsComponent={ExpandableRowComponent} />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalFilterShift openModal={this.openModal} shift={"malam"} data={this.state.data} handleFilter={this.handleFilter} closeModal={this.closeModal} isOpen={this.state.isOpen} />
            </>
        )
    }
}



export default CafeMalam;