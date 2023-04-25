import React from "react";
import { Header, ModalUser } from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import Navbar_Menu from "../Navbar_Menu";
import { ToastContainer, toast } from "react-toastify";
import { ipcRenderer } from "electron";
import swal from "sweetalert";
import ModalShiftAdmin from "./ModalShiftAdmin";
import DotAdded from "../../../system/DotAdded";
import ModalHargaBilling from "./ModalHargaBilling";
import ModalHargaMember from "./ModalHargaMember";
import LoginAdmin from "./LoginAdmin";
import NavbarAdmin from "./NavbarAdmin";
import DataTable, { createTheme } from 'react-data-table-component';

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

class Aktivitas extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data_activitas: [],
            column: [
                {
                    name: "No",
                    selector: row => row.number,
                    sortable: true,
                    width: "70px"
                },
                {
                    name: "Aktivitas",
                    selector: row => row.aktivitas,
                    sortable: true,
                    width: "500px"
                },
                {
                    name: "Kasir",
                    selector: row => row.user_in,
                    sortable: true,
                },
                {
                    name: "Tanggal Dibuat",
                    selector: row => row.created_at,
                    sortable: true,
                },
                {
                    name: "Tanggal Diupdate",
                    selector: row => row.updated_at,
                    sortable: true,
                }
            ]
        }

        this.getActivitas = this.getActivitas.bind(this);
    }

    getActivitas() {
        ipcRenderer.invoke("getAktivitas").then((result) => {
            console.log(result);
            var no = 1;
            result.data.map(el => {
                el['number'] = no++;
            });

            this.setState({
                data_activitas: result.data
            })
        });
    }

    componentDidMount(): void {
        this.getActivitas();
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
                <div className="overview-pemb">
                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex">
                                <Navbar_Menu />
                            </div>
                            <div className="hr-white"></div>
                            <div className="d-flex mb-3">
                                <NavbarAdmin />
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10"><img
                                            src="assets/img/icon/refresh-ccw.png" onClick={() => window.location.reload()} alt="" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="keuangan-list mb-5">
                    <div className="bg-dark box-dark mb-3">
                        <h5 className="">List Aktivitas Kasir</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <ul className="list-group">
                                    <DataTable columns={this.state.column} data={this.state.data_activitas} pagination theme="solarized" />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class AktivitasContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">

                    <Sidebar />
                    <div className="box-bg">
                        <Aktivitas />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}


export default AktivitasContainer;