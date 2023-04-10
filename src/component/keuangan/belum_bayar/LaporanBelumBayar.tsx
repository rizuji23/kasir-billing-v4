import React, { useEffect, useState } from "react";
import { Header, ModalUser } from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import NavbarKeuangan from "../NavbarKeuangan";
import { ToastContainer, toast } from "react-toastify";
import NavbarTransaksi from "../NavbarTransaksi";
import DataTable, { createTheme } from "react-data-table-component";
import { ipcRenderer } from "electron";
import DotAdded from "../../../system/DotAdded";
import ModalFilter from "../../pengaturan/ModalFilter";

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
        data_cart: "Waiting Data..."
    });

    const [data_detail_booking, set_detail_booking] = useState({
        data_detail_booking: "Waiting Data..."
    });


    // get cart
    async function get_cart(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke("keuangan", false, true, false, data).then((result) => {
                if (result.response === true) {
                    const data = result.data.map((el, i) => {
                        return (
                            <>
                                <li>{el.nama_menu} @{el.qty} Rp. {dot.parse(el.harga_menu)} = Rp. {dot.parse(el.sub_total)}</li>
                            </>
                        )
                    });

                    res(data)
                } else {
                    rej("Data is empty")
                }
            });
        })
    }

    async function get_detail_billing(data) {
        return new Promise((res, rej) => {
            // get detail booking
            ipcRenderer.invoke("keuangan", false, false, true, data).then((result) => {
                if (result.response === true) {
                    const data = result.data.map((el, i) => {
                        return (
                            <>
                                <li>{el.end_duration} = Rp. {dot.parse(el.harga)}</li>
                            </>
                        )
                    });

                    res(data)
                } else {
                    rej("Data is empty")
                }
            });
        });
    }

    useEffect(() => {
        get_cart(data.id_pesanan).then((data: any) => {
            set_cart(previousState => {
                return { ...previousState, data_cart: data }
            })
        }).catch((rej) => {
            set_cart(previousState => {
                return { ...previousState, data_cart: rej }
            })
        });

        get_detail_billing(data.id_booking).then((data: any) => {
            set_detail_booking(previousState => {
                return { ...previousState, data_detail_booking: data }
            })
        }).catch((rej) => {
            set_detail_booking(previousState => {
                return { ...previousState, data_detail_booking: rej }
            })
        });
    }, [])

    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>Order ID</small><br /> <b>{data.id_struk}</b></li>
                <li className="list-group-item"><small>Table ID</small><br /> <b>{data.id_table}</b></li>
                <li className="list-group-item"><small>Nama Customer</small><br /> <b>{data.nama_customer}</b></li>
                <li className="list-group-item"><small>Detail Booking Billing</small><br /> <ul>{data_detail_booking.data_detail_booking}</ul> <br /> Total: <b>Rp. {dot.parse(data.total_harga)}</b></li>
                <li className="list-group-item"><small>Detail Cafe</small><br /> <ul>{data_cart.data_cart}</ul> <br /> Total: <b>Rp. {data.total !== null ? dot.parse(data.total) : 0}</b></li>
                <li className="list-group-item"><small>Total Semua</small><br /> <b>Rp. {dot.parse(data.total_struk)}</b></li>
                <li className="list-group-item"><small>Uang Cash</small><br /> <b>Rp. {dot.parse(data.cash_struk)}</b></li>
                <li className="list-group-item"><small>Kembalian</small><br /> <b>Rp. {dot.parse(data.kembalian_struk)}</b></li>
                <li className="list-group-item"><small>Kasir Input</small><br /> <b>{data.user_in}</b></li>
                <li className="list-group-item"><small>Created At</small><br /> <b>{data.created_at}</b></li>
            </ul>
        </>
    )
}

class LaporanBelumBayar extends React.Component<any, any> {
    constructor(props: any) {
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
            total_belum: 0,
            isOpen: false,
            reset_disable: true,
        }

        this.getDataKeuangan = this.getDataKeuangan.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }

    getDataKeuangan() {
        const dot = new DotAdded();
        ipcRenderer.invoke("getLaporanBelumBayar").then((result) => {
            console.log(result);
            if (result.response === true) {
                let i = 1;
                result.data.map((el) => {
                    el['number'] = i++;
                    el['total_struk_val'] = `Rp. ${dot.parse(el.total_struk)}`
                });

                const total_belum = result.data.reduce((total, arr) => total + arr.total_struk, 0);

                this.setState({
                    data: result.data,
                    total_belum: dot.parse(total_belum),
                });
            } else {
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
        ipcRenderer.invoke("filterByDateBillingBelumBayar", data_filter).then((result) => {
            if (result.response === true) {
                let i = 1;
                result.data.map((el) => {
                    el['number'] = i++;
                    el['total_struk_val'] = `Rp. ${dot.parse(el.total_struk)}`
                });

                const total_belum = result.data.reduce((total, arr) => total + arr.total_struk, 0);

                toast.success("Data berhasil difilter.");

                this.setState({
                    data: result.data,
                    isOpen: false,
                    reset_disable: false,
                    total_belum: dot.parse(total_belum),
                });
            } else {
                this.getDataKeuangan();
                this.setState({
                    isOpen: false,
                });
            }
        });
    }

    resetFilter() {
        toast.success("Filter berhasil direset.");
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
                <div className="hr-white"></div>
                <div className="card card-custom mt-3">
                    <div className="card-body">
                        <div className="title-pemb">
                            <h4>Total Transaksi Belum Bayar</h4>
                            <h4>Rp. <span id="total_hari">{this.state.total_belum}</span></h4>
                            <p id="date_locale"></p>
                        </div>
                    </div>
                </div>

                <div className="keuangan-list mt-3 mb-5">
                    <div className="card card-custom-dark">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 w-100">
                                    <h4>Rincian Transaksi</h4>
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
                <ModalFilter openModal={this.openModal} data={this.state.data} handleFilter={this.handleFilter} closeModal={this.closeModal} isOpen={this.state.isOpen} />
            </>
        )
    }
}

class LaporanBelumBayarContainer extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">

                    <Sidebar />
                    <div className="box-bg">
                        <NavbarKeuangan />
                        <LaporanBelumBayar />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default LaporanBelumBayarContainer;