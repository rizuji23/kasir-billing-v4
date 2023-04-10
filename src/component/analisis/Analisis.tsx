import { ipcRenderer } from "electron";
import React, { useState } from "react";
import DotAdded from "../../system/DotAdded";
import { Header, ModalUser } from "../header/header";
import Sidebar from "../sidebar/sidebar";
import DataTable, { createTheme } from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";
import 'moment-timezone';

import { data_stacket } from "./data_test";
import PenjualanBillingHari from "./chart/PenjualanBillingHari";
import NavbarAnalisis from "./NavbarAnalisis";
import KeputusanCard from "./KeputusanCard";
import PenjualanBillingKuartal from "./chart/PenjualanBillingKuartal";
import Cozy from "../../system/analisis_system";
import PenjualanBillingBulan from "./chart/PenjualanBillingBulan";
import PenjualanBillingTahun from "./chart/PenjualanBillingTahun";

class Analisis extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            date_data: {
                to: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
                from: moment().tz("Asia/Jakarta").format("YYYY-MM-DD")
            },
            month: moment().tz("Asia/Jakarta").format("MM-YYYY"),
            year: moment().tz("Asia/Jakarta").format("YYYY"),
            data_hari: "",
            data_bulan: "",
            data_kuartal: "",
            data_tahun: "",
        }

        this.getPendapatanHour = this.getPendapatanHour.bind(this);
        this.getPendapatanMonth = this.getPendapatanMonth.bind(this);
        this.getPendapatanKuartal = this.getPendapatanKuartal.bind(this);
    }

    componentDidMount(): void {
        this.getPendapatanHour();
        this.getPendapatanMonth();
        this.getPendapatanKuartal();
    }

    getPendapatanHour() {
        const data = {
            dari_tanggal: this.state.date_data.to,
            sampai_tanggal: this.state.date_data.from,
        }
        ipcRenderer.invoke("getPendapatan", true, data).then((result) => {
            if (result.response === true) {

                Cozy.filterByHour(result.data.data_billing, result.data.data_cafe).then((result_chart) => {
                    if (result_chart.response === true) {
                        console.log(result_chart);

                        this.setState({
                            data_hari: result_chart.data
                        });
                    }
                })
            }
        });
    }

    getPendapatanMonth() {
        ipcRenderer.invoke("getPendapatanMonth", { month: this.state.month }).then((result) => {
            Cozy.filterByMonth(result.data.data_billing, result.data.data_cafe).then((result) => {
                this.setState({
                    data_bulan: result.data.sort((a, b) => b.month - a.month)
                })
            });


        })
    }

    getPendapatanKuartal() {
        ipcRenderer.invoke("getPendapatanKuartal", { year: this.state.year }).then((result) => {
            Cozy.filterByKuartal(result.data.data_billing, result.data.data_cafe).then((result) => {
                this.setState({
                    data_kuartal: result.data,
                })
            })

            Cozy.filterByYear(result.data.data_billing, result.data.data_cafe).then((result) => {
                this.setState({
                    data_tahun: result.data,
                })
            })
        })
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="d-flex">
                    <div className="p-2 w-100">
                        <div className="card card-custom-dark">
                            <div className="card-header">
                                <h6>Pendapatan Hari Ini</h6>
                            </div>
                            <div className="card-body">
                                <PenjualanBillingHari data={this.state.data_hari} />
                                {/* <KeputusanCard id={1} /> */}
                            </div>
                        </div>
                    </div>
                    <div className="p-2 w-100">
                        <div className="card card-custom-dark">
                            <div className="card-header">
                                <h6>Pendapatan Perbulan ({moment().tz("Asia/Jakarta").format("MMMM")})</h6>
                            </div>
                            <div className="card-body">
                                <PenjualanBillingBulan data={this.state.data_bulan} />
                                {/* <KeputusanCard id={2} /> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="p-2 w-100">
                        <div className="card card-custom-dark">
                            <div className="card-header">
                                <h6>Pendapatan Per Kuartal ({moment().tz("Asia/Jakarta").format("YYYY")})</h6>
                            </div>
                            <div className="card-body">
                                <PenjualanBillingKuartal data={this.state.data_kuartal} />
                                {/* <KeputusanCard id={3} /> */}
                            </div>
                        </div>
                    </div>
                    <div className="p-2 w-100">
                        <div className="card card-custom-dark">
                            <div className="card-header">
                                <h6>Pendapatan Pertahun ({moment().tz("Asia/Jakarta").format("YYYY")})</h6>
                            </div>
                            <div className="card-body">
                                <PenjualanBillingTahun data={this.state.data_tahun} />
                                {/* <KeputusanCard id={4} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class AnalisisContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">

                    <Sidebar />
                    <div className="box-bg">
                        <div className="analisis-container mb-5">
                            <div className="analisis-header">
                                <h3>Analisis</h3>
                            </div>
                            <div className="hr-dark"></div>
                            <NavbarAnalisis />
                            <div className="analisis-content">
                                <Analisis />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default AnalisisContainer;