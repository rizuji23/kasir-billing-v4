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

class Analisis extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>

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
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <Analisis />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default AnalisisContainer;