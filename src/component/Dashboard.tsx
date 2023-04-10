import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { Header, ModalUser } from './header/header';
import Sidebar from "./sidebar/sidebar";
import Home from './Home';


class Dashboard extends React.Component {
    render() {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Sidebar />
                    <div className="box-bg">
                        <Home />
                    </div>
                </div>
                <ModalUser />
            </>

        )
    }
}

export default Dashboard