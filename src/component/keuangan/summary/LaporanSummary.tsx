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
import ModalHari from "./ModalHari";
import ModalBulan from "./ModalBulan";
import ModalFilterNot from "./ModalFilterNot";

class LaporanSummary extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            total_hari: 0,
            total_bulan: 0,
            total_belum_hari: 0,
            total_belum_bulan: 0,
            total_reset_hari: 0,
            total_reset_bulan: 0,
            date_now: "",
            date_month: "",
            isOpenHari: false,
            isOpenBulan: false,
            isOpenNot: false,
            date_now_not: "",
            date_month_not: "",
            reset_hari: false,
            reset_bulan: false,
            reset_not: true,
        }

        this.getTransaksiHari = this.getTransaksiHari.bind(this);
        this.getTransaksiBulan = this.getTransaksiBulan.bind(this);
        this.getBelumBayar = this.getBelumBayar.bind(this);
        this.openModalHari = this.openModalHari.bind(this);
        this.closeModalHari = this.closeModalHari.bind(this);
        this.openModalBulan = this.openModalBulan.bind(this);
        this.closeModalBulan = this.closeModalBulan.bind(this);
        this.openModalNot = this.openModalNot.bind(this);
        this.closeModalNot = this.closeModalNot.bind(this);
        this.handleFilterHari = this.handleFilterHari.bind(this);
        this.resetHari = this.resetHari.bind(this);
        this.handleFilterBulan = this.handleFilterBulan.bind(this);
        this.resetBulan = this.resetBulan.bind(this);
        this.handleFilterNot = this.handleFilterNot.bind(this);
        this.resetNot = this.resetNot.bind(this);
    }

    componentDidMount(): void {
        this.getTransaksiHari();
        this.getTransaksiBulan();
        this.getBelumBayar();
    }

    openModalHari() {
        this.setState({
            isOpenHari: true,
        });
    }

    closeModalHari() {
        this.setState({
            isOpenHari: false,
        });
    }

    openModalBulan() {
        this.setState({
            isOpenBulan: true,
        });
    }

    closeModalBulan() {
        this.setState({
            isOpenBulan: false,
        });
    }

    openModalNot() {
        this.setState({
            isOpenNot: true,
        });
    }

    closeModalNot() {
        this.setState({
            isOpenNot: false,
        })
    }

    async getTransaksiHari() {
        const dot = new DotAdded();
        var total_bill_cafe = 0;
        var total_cafe = 0;
        var total_split_bill = 0;
        const now = moment().tz("Asia/Jakarta").format("DD-MM-YYYY")
        await ipcRenderer.invoke("keuangan", true, false, false, {}).then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                    const day_filter = moment(get_date, "YYYY-MM-DD").format("YYYY-MM-DD");
                    if (day_now === day_filter) {
                        total_bill_cafe += el.total_struk;
                    }
                });
            } else {
                total_bill_cafe = 0;
            }
        });

        await ipcRenderer.invoke("keuangan_cafe").then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                    const day_filter = moment(get_date, "YYYY-MM-DD").format("YYYY-MM-DD");
                    if (day_now === day_filter) {
                        total_cafe += el.total_struk;
                    }
                });
            } else {
                total_cafe = 0;
            }
        });

        await ipcRenderer.invoke("getLaporanSplitBill").then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const day_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                    const day_filter = moment(get_date, "YYYY-MM-DD").format("YYYY-MM-DD");
                    if (day_now === day_filter) {
                        total_split_bill += el.total_bill;
                    }
                });
            } else {
                total_split_bill = 0;
            }
        });

        const total_all_hari = await total_bill_cafe + total_cafe + total_split_bill;
        this.setState({
            total_hari: dot.parse(total_all_hari),
            date_now: now
        })
    }

    async getTransaksiBulan() {
        const dot = new DotAdded();
        var total_bill_cafe = 0;
        var total_cafe = 0;
        var total_split_bill = 0;
        const now = moment().tz("Asia/Jakarta").format("MMMM YYYY")

        await ipcRenderer.invoke("keuangan", true, false, false, {}).then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                    const date_filter = moment(get_date, "YYYY-MM-DD").format("MM-YYYY");
                    if (date_now === date_filter) {
                        total_bill_cafe += el.total_struk;
                    }
                });
            } else {
                total_bill_cafe = 0;
            }
        });

        await ipcRenderer.invoke("keuangan_cafe").then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                    const date_filter = moment(get_date, "YYYY-MM-DD").format("MM-YYYY");
                    if (date_now === date_filter) {
                        total_cafe += el.total_struk;
                    }
                });
            } else {
                total_cafe = 0;
            }
        });

        await ipcRenderer.invoke("getLaporanSplitBill").then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    const get_date = el.created_at;
                    const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                    const date_filter = moment(get_date, "YYYY-MM-DD").format("MM-YYYY");
                    if (date_now === date_filter) {
                        total_split_bill += el.total_bill;
                    }
                });
            } else {
                total_split_bill = 0;
            }
        });

        const total_all_bulan = await total_bill_cafe + total_cafe + total_split_bill;
        this.setState({
            total_bulan: dot.parse(total_all_bulan),
            date_month: now
        })
    }

    async getBelumBayar() {
        const dot = new DotAdded();
        var total_belum_hari = 0;
        var total_belum_bulan = 0;
        var total_reset_hari = 0;
        var total_reset_bulan = 0;
        await ipcRenderer.invoke("getLaporanBelumBayar").then((result) => {
            console.log(result);
            if (result.response === true) {
                if (result.response === true) {
                    result.data.forEach(el => {
                        const get_date = el.created_at;
                        const day_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                        const day_filter = moment(get_date, "YYYY-MM-DD").format("YYYY-MM-DD");
                        if (day_now === day_filter) {
                            total_belum_hari += el.total_struk;
                        }
                    });

                    result.data.forEach(el => {
                        const get_date = el.created_at;
                        const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                        const date_filter = moment(get_date, "YYYY-MM-DD").format("MM-YYYY");
                        if (date_now === date_filter) {
                            total_belum_bulan += el.total_struk;
                        }
                    });
                } else {
                    total_belum_hari = 0;
                    total_belum_bulan = 0;
                }
            }
        });

        await ipcRenderer.invoke("getLaporanReset").then((result) => {
            console.log(result);
            if (result.response === true) {
                if (result.response === true) {
                    result.data.forEach(el => {
                        const get_date = el.created_at;
                        const day_now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
                        const day_filter = moment(get_date, "YYYY-MM-DD").format("YYYY-MM-DD");
                        if (day_now === day_filter) {
                            total_reset_hari += el.total_struk;
                        }
                    });

                    result.data.forEach(el => {
                        const get_date = el.created_at;
                        const date_now = moment().tz("Asia/Jakarta").format("MM-YYYY");
                        const date_filter = moment(get_date, "YYYY-MM-DD").format("MM-YYYY");
                        if (date_now === date_filter) {
                            total_reset_bulan += el.total_struk;
                        }
                    });
                } else {
                    total_reset_hari = 0;
                    total_reset_bulan = 0;
                }
            }
        });

        console.log(total_belum_hari)

        this.setState({
            total_reset_hari: dot.parse(total_reset_hari),
            total_reset_bulan: dot.parse(total_reset_bulan),
            total_belum_hari: dot.parse(total_belum_hari),
            total_belum_bulan: dot.parse(total_belum_bulan),
            date_now_not: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
            date_month_not: moment().tz("Asia/Jakarta").format("MMMM YYYY"),
        })
    }

    async handleFilterHari(start, end) {
        const data_filter = {
            data: this.state.data,
            dari_tanggal: start,
            sampai_tanggal: end,
        }

        var total_bill_cafe = 0;
        var total_cafe = 0;
        var total_split_bill = 0;
        const dot = new DotAdded();

        await ipcRenderer.invoke("filterByDateCafe", data_filter).then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    total_cafe += el.total_struk;
                });
            } else {
                total_cafe = 0;
            }
        });

        await ipcRenderer.invoke("getFilterSplitBill", data_filter).then((result) => {
            console.log(result);
            if (result.response === true) {
                result.data.forEach(el => {
                    total_split_bill += el.total_bill;
                });
            } else {
                total_split_bill = 0;
            }
        });

        await ipcRenderer.invoke("filterByDateBilling", data_filter).then((result) => {
            console.log(result)
            if (result.response === true) {
                result.data.forEach(el => {
                    total_bill_cafe += el.total_struk;
                });
            } else {
                total_bill_cafe = 0;
            }
        });

        const total_all = await total_bill_cafe + total_cafe + total_split_bill;
        console.log(total_all)

        this.setState({
            total_hari: dot.parse(total_all),
            date_now: `${start} ~ ${end}`,
            reset_hari: true,
        }, () => {
            this.closeModalHari();
        })
    }

    resetHari() {
        this.getTransaksiHari();
        this.setState({
            date_now: moment().tz("Asia/Jakarta").format("DD-MM-YYYY"),
            reset_hari: false,
        })
        toast.success("Data berhasil direset.")
    }

    async handleFilterBulan(month) {
        const data_filter = {
            month: month,
        }

        var total_bill_cafe = 0;
        var total_cafe = 0;
        var total_split_bill = 0;

        const dot = new DotAdded();
        await ipcRenderer.invoke("filterByMonthBilling", data_filter).then((result) => {
            if (result.response === true) {
                result.data.forEach(el => {
                    total_bill_cafe += el.total_struk;
                });
            } else {
                total_bill_cafe = 0;
            }
        });

        await ipcRenderer.invoke("filterByMonthCafe", data_filter).then((result) => {
            if (result.response === true) {
                result.data.forEach(el => {
                    total_cafe += el.total_struk;
                });
            } else {
                total_cafe = 0;
            }
        });

        await ipcRenderer.invoke("getFilterMonthSplitBill", data_filter).then((result) => {
            if (result.response === true) {
                result.data.forEach(el => {
                    total_split_bill += el.total_bill;
                });
            } else {
                total_split_bill = 0;
            }
        });

        const total_all = await total_bill_cafe + total_cafe + total_split_bill;
        const now = moment(data_filter.month, "YYYY-MM").format("MMMM YYYY");

        this.setState({
            total_bulan: dot.parse(total_all),
            date_month: now,
            reset_bulan: true,
        }, () => {
            this.closeModalBulan();
        })
    }

    resetBulan() {
        this.getTransaksiBulan();
        this.setState({
            date_month: moment().tz("Asia/Jakarta").format("MMMM YYYY"),
            reset_bulan: false,
        });
        toast.success("Data berhasil direset.")
    }

    async handleFilterNot(data, tipe) {
        const dot = new DotAdded();

        if (tipe === "Tanggal") {
            var total_belum_hari = 0;
            var total_reset_hari = 0;
            const data_filter = {
                dari_tanggal: data.start,
                sampai_tanggal: data.end,
            }
            await ipcRenderer.invoke("filterByDateBillingBelumBayar", data_filter).then((result) => {
                console.log(result);
                if (result.response === true) {
                    if (result.response === true) {
                        result.data.forEach(el => {
                            total_belum_hari += el.total_struk;
                        });
                    } else {
                        total_belum_hari = 0;
                    }
                }
            });

            await ipcRenderer.invoke("filterByDateBillingReset", data_filter).then((result) => {
                console.log(result);
                if (result.response === true) {
                    if (result.response === true) {
                        result.data.forEach(el => {
                            total_reset_hari += el.total_struk;
                        });
                    } else {
                        total_reset_hari = 0;
                    }
                }
            });

            this.setState({
                total_reset_hari: dot.parse(total_reset_hari),
                total_belum_hari: dot.parse(total_belum_hari),
                date_now_not: `${data.start} ~ ${data.end}`,
                reset_not: false,
            }, () => {
                this.closeModalNot();
            })
        } else if (tipe === "Bulan") {
            console.log(data)

            var total_belum_bulan = 0;
            var total_reset_bulan = 0;
            const data_filter = {
                month: data
            }
            await ipcRenderer.invoke("filterByMonthBillingBelumBayar", data_filter).then((result) => {
                console.log(result);
                if (result.response === true) {
                    if (result.response === true) {
                        result.data.forEach(el => {
                            total_belum_bulan += el.total_struk;
                        });
                    } else {
                        total_belum_bulan = 0;
                    }
                }
            });

            await ipcRenderer.invoke("filterByMonthBillingReset", data_filter).then((result) => {
                console.log(result);
                if (result.response === true) {
                    if (result.response === true) {
                        result.data.forEach(el => {
                            total_reset_bulan += el.total_struk;
                        });
                    } else {
                        total_reset_bulan = 0;
                    }
                }
            });

            this.setState({
                total_reset_bulan: dot.parse(total_reset_bulan),
                total_belum_bulan: dot.parse(total_belum_bulan),
                date_month_not: moment(data, "YYYY-MM").format("MMMM YYYY"),
                reset_not: false,
            }, () => {
                this.closeModalNot();
            });
        }
    }

    resetNot() {
        this.getBelumBayar();
        this.setState({
            reset_now: true,
            date_month_not: moment().tz("Asia/Jakarta").format("MMMM YYYY"),
            date_now_not: moment().tz("Asia/Jakarta").format("DD-MM-YYYY"),
        })

        toast.success("Data berhasil direset.");
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

                <div className="alert alert-primary mt-3">
                    <p className="mb-0"><b>Keterangan: </b></p>
                    <span>Rumus dari total dibawah adalah <i>(Total Transaksi Billing & Cafe + Cafe Only + Split Bill)</i></span>
                </div>
                <div className="analisis-header">
                    <h3>Transaksi</h3>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <div className="card card-custom mt-2">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total transaksi semua hari ini:</h4>
                                    <h4>Rp. <span>{this.state.total_hari}</span></h4>
                                    <p>{this.state.date_now}</p>

                                    <div className="text-end">
                                        <button className="btn btn-primary btn-primary-cozy-dark btn-sm" onClick={this.openModalHari}>Filter</button>
                                        {this.state.reset_hari === true ? <button className="btn btn-primary btn-primary ms-2" onClick={this.resetHari}>Reset</button> : <></>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card card-custom mt-2">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total transaksi semua bulan:</h4>
                                    <h4>Rp. <span>{this.state.total_bulan}</span></h4>
                                    <p>{this.state.date_month}</p>
                                    <div className="text-end">
                                        <button className="btn btn-primary btn-primary-cozy-dark btn-sm" onClick={this.openModalBulan}>Filter</button>
                                        {this.state.reset_bulan === true ? <button className="btn btn-primary btn-primary ms-2" onClick={this.resetBulan}>Reset</button> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex  mt-5">
                    <div className="analisis-header me-auto">
                        <h3>Tidak termasuk Transaksi</h3>
                    </div>

                    <div>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.openModalNot}>Filter</button>
                        <button className="btn btn-primary btn-primary-cozy-dark ms-2" onClick={this.resetNot} disabled={this.state.reset_not}>Reset</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <div className="card card-custom-dark mt-2">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total belum bayar semua hari ini:</h4>
                                    <h4>Rp. <span>{this.state.total_belum_hari}</span></h4>
                                    <p>{this.state.date_now_not}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card card-custom-dark mt-2">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total belum bayar semua bulan:</h4>
                                    <h4>Rp. <span>{this.state.total_belum_bulan}</span></h4>
                                    <p>{this.state.date_month_not}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row  mb-5">
                    <div className="col-sm">
                        <div className="card card-custom-dark mt-2">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total reset semua hari ini:</h4>
                                    <h4>Rp. <span>{this.state.total_reset_hari}</span></h4>
                                    <p>{this.state.date_now_not}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card card-custom-dark mt-2">
                            <div className="card-body">
                                <div className="title-pemb">
                                    <h4>Total reset semua bulan:</h4>
                                    <h4>Rp. <span>{this.state.total_reset_bulan}</span></h4>
                                    <p>{this.state.date_month_not}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ModalHari isOpen={this.state.isOpenHari} closeModal={this.closeModalHari} handleFilterHari={this.handleFilterHari} />
                <ModalBulan isOpen={this.state.isOpenBulan} closeModal={this.closeModalBulan} handleFilterBulan={this.handleFilterBulan} />
                <ModalFilterNot isOpen={this.state.isOpenNot} closeModal={this.closeModalNot} handleFilterNot={this.handleFilterNot} />

            </>
        )
    }
}

class LaporanSummaryContainer extends React.Component<any, any> {
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
                        <LaporanSummary />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default LaporanSummaryContainer;