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
import ModalFilter from "../../pengaturan/ModalFilter";
import FilterTransaksi from "../system/FilterTransaksi";
import NavbarTransaksiShift from "./NavbarTransaksiShift";
import BillingSiang from "./BillingSiang";
import BillingMalam from "./BillingMalam";
import CafeSiang from "./CafeSiang";
import CafeMalam from "./CafeMalam";

class TransaksiCafeShift extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
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
                <NavbarTransaksiShift />
                <div id="siang">
                    <h3 className="text-light"><b>Siang</b></h3>
                    <CafeSiang />
                </div>
                <div id="malam">
                    <h3 className="text-light"><b>Malam</b></h3>
                    <CafeMalam />
                </div>
            </>
        )
    }
}

class TransaksiCafeShiftContainer extends React.Component<any, any> {
    constructor(props: any) {
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
                        <TransaksiCafeShift />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default TransaksiCafeShiftContainer;