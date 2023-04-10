import React, { useEffect, useState } from "react";
import { Header, ModalUser } from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import NavbarKeuangan from "../NavbarKeuangan";
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { ipcRenderer } from "electron";
import DotAdded from "../../../system/DotAdded";
import moment from "moment";
import 'moment-timezone';
import ModalFilter from "../../pengaturan/ModalFilter";

const ExpandableRowComponent: React.FC<any> = ({ data }) => {
    const dot = new DotAdded();

    const [data_booking, set_booking] = useState({
        data_booking: "Waiting Data...",
        total_booking: 0,
    });

    const [data_cafe, set_cafe] = useState({
        data_cafe: "Waiting Data...",
        total_cafe: 0,
    });


    async function get_booking(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke("getDetailSplitBooking", data).then((result) => {
                if (result.response === true) {
                    const data = result.data.map(el => {
                        if (el.id_detail_booking !== null) {
                            return (
                                <>
                                    <li>{el.end_duration} = Rp. {dot.parse(el.harga)}</li>
                                </>
                            )
                        } else {
                            return (
                                <></>
                            )
                        }
                    });

                    const total = result.data.reduce((total, arr) => total + arr.harga, 0);
                    res({ data: data, total: total });
                } else {
                    rej("Data is empty");
                }
            });
        });
    }

    async function get_cafe(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke("getDetailSplitCafe", data).then((result) => {
                if (result.response === true) {
                    const data = result.data.map(el => {
                        if (el.id_cart !== null) {
                            return (
                                <>
                                    <li>{el.nama_menu} @{el.qty} Rp. {dot.parse(el.harga_menu)} = Rp. {dot.parse(el.sub_total)}</li>
                                </>
                            )
                        } else {
                            return (
                                <></>
                            )
                        }
                    });

                    const total = result.data.reduce((total, arr) => total + arr.sub_total, 0);
                    res({ data: data, total: total });
                } else {
                    rej("Data is empty");
                }
            });
        });
    }

    useEffect(() => {
        get_booking(data.id_split_bill).then((data: any) => {
            set_booking(previousState => {
                return { ...previousState, data_booking: data.data, total_booking: data.total };
            });
        }).catch((rej) => {
            set_booking(previousState => {
                return { ...previousState, data_booking: rej, total_booking: 0 };
            });
        });

        get_cafe(data.id_split_bill).then((data: any) => {
            set_cafe(previousState => {
                return { ...previousState, data_cafe: data.data, total_cafe: data.total };
            });

            console.log(data)
        }).catch((rej) => {
            set_cafe(previousState => {
                return { ...previousState, data_cafe: rej, total_cafe: 0 };
            });
        });
    }, []);


    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>Order ID</small><br /> <b>{data.id_split_bill}</b></li>
                <li className="list-group-item"><small>Nama Customer</small><br /> <b>{data.nama_bill}</b></li>
                <li className="list-group-item"><small>Detail Booking Billing</small><br /> <ul>{data_booking.data_booking}</ul> <br /> Total: <b>Rp. {dot.parse(data_booking.total_booking) || 0}</b> </li>
                <li className="list-group-item"><small>Detail Cafe</small><br /> <ul>{data_cafe.data_cafe}</ul> <br /> Total: <b>Rp. {dot.parse(data_cafe.total_cafe) || 0}</b> </li>
                <li className="list-group-item"><small>Total Semua</small><br /> <b>Rp. {dot.parse(data.total_bill)}</b></li>
                <li className="list-group-item"><small>Kasir Input</small><br /> <b>{data.user_in}</b></li>
                <li className="list-group-item"><small>Created At</small><br /> <b>{data.created_at}</b></li>

            </ul>
        </>
    )
}

class LaporanSplitBill extends React.Component<any, any> {
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
                    selector: row => row.id_split_bill,
                    sortable: true,
                },
                {
                    name: "Nama",
                    selector: row => row.nama_bill,
                    sortable: true,
                },
                {
                    name: "Total",
                    selector: row => row.total_split_bill,
                    sortable: true,
                },
                {
                    name: "Tanggal",
                    selector: row => row.created_at,
                    sortable: true,
                }
            ],
            total_split_bill: 0,
            isOpen: false,
            tanggal: "",
            reset_disable: true,
        }

        this.getSplitBill = this.getSplitBill.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }

    componentDidMount(): void {
        this.getSplitBill();
    }

    getSplitBill() {
        ipcRenderer.invoke("getLaporanSplitBill").then((result) => {
            console.log(result);
            if (result.response === true) {
                const dot = new DotAdded();
                let no = 1;
                result.data.map(el => {
                    el['number'] = no++;
                    el['total_split_bill'] = dot.parse(el.total_bill);
                });

                const total_bill = result.data.reduce((total, arr) => total + arr.total_bill, 0);

                this.setState({
                    data: result.data,
                    total_split_bill: dot.parse(total_bill),
                })
            }
        });
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

        ipcRenderer.invoke("getFilterSplitBill", data_filter).then((result) => {
            if (result.response === true) {
                let i = 1;
                result.data.map((el) => {
                    el['number'] = i++;
                    el['total_split_bill'] = `Rp. ${dot.parse(el.total_bill)}`
                });

                let total_hari = 0;
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_filter = moment(get_date, "YYYY-MM-DD").format("YYYY-MM-DD");
                    if (day_filter) {
                        total_hari += el.total_bill;
                    }
                })


                toast.success("Data berhasil difilter.");

                this.setState({
                    data: result.data,
                    total_split_bill: dot.parse(total_hari),
                    tanggal: `${moment(dari_tanggal).format("YYYY-MM-DD")} ~ ${moment(sampai_tanggal).format("YYYY-MM-DD")}`,
                    isOpen: false,
                    reset_disable: false,
                });
            } else {
                this.getSplitBill();
                this.setState({
                    isOpen: false,
                });
            }
        })
    }

    resetFilter() {
        toast.success("Filter berhasil direset.");
        this.getSplitBill();
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
                            <h4>Total Transaksi Split Bill</h4>
                            <h4>Rp. <span id="total_hari">{this.state.total_split_bill}</span></h4>
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

class LaporanSplitBillContainer extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <NavbarKeuangan />
                        <LaporanSplitBill />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default LaporanSplitBillContainer;