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

class TransaksiShift extends React.Component<any, any> {
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

                </div>
            </>
        )
    }
}

class TransaksiShiftContainer extends React.Component<any, any> {
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
                        <TransaksiShift />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default TransaksiShiftContainer;