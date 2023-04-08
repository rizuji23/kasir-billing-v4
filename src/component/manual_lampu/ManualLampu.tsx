import React from "react";
import { Header, ModalUser } from "../header/header";
import Sidebar from "../sidebar/sidebar";
import { ToastContainer, toast } from "react-toastify";
import { ipcRenderer } from "electron";
import swal from "sweetalert";
import { setInterval } from "timers/promises";


class ManualLampu extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
        }

        this.getTable = this.getTable.bind(this);
        this.turnOn = this.turnOn.bind(this);
        this.turnOff = this.turnOff.bind(this);
    }

    componentDidMount(): void {
        this.getTable();
    }

    getTable() {
        ipcRenderer.invoke("getAllTable", true).then((result) => {
            console.log(result);
            const data = result.data.map(el => {
                return (
                    <>
                        <div className="col">
                            <div className="card card-custom-dark h-100 card-table">
                                <div className="card-body">
                                    <div className="container-biliiard">
                                        <h4 style={{ fontSize: 20 }}>{el.nama_table}</h4>
                                        <div className="d-flex mt-2">
                                            <div className="p-1">
                                                <button className="btn btn-primary btn-sm" onClick={() => this.turnOn(el.id_table)}>Turn On</button>
                                            </div>
                                            <div className="p-1">
                                                <button className="btn btn-danger btn-sm" onClick={() => this.turnOff(el.id_table)}>Turn Off</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            });

            this.setState({
                data_table: data
            })
        });
    }

    turnOn(id_table) {
        swal({
            title: "Apa kamu yakin?",
            text: "Lampu akan dinyalakan.",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                console.log(id_table);
                ipcRenderer.invoke("lamp", true, false, id_table).then((result1) => {
                    console.log(result1);

                    if (result1 === true) {
                        ipcRenderer.invoke("addAktivitas", { aktivitas: `Melakukan Manual Lampu (On) pada ${id_table}`, user_in: sessionStorage.getItem("username") }).then((result) => {
                            if (result.response === true) {
                                toast.success(`Table ${id_table} dinyalakan.`);
                            } else {
                                toast.error(`Table ${id_table} gagal dinyalakan.`);
                            }
                        })
                    } else {
                        toast.error(`Table ${id_table} gagal dinyalakan.`);
                    }
                })
            }
        });
    }

    turnOff(id_table) {
        swal({
            title: "Apa kamu yakin?",
            text: "Lampu akan dimatikan.",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                console.log(id_table);
                ipcRenderer.invoke("lamp", false, true, id_table).then((result) => {
                    console.log(result)
                    if (result === true) {
                        ipcRenderer.invoke("addAktivitas", { aktivitas: `Melakukan Manual Lampu (Off) pada ${id_table}`, user_in: sessionStorage.getItem("username") }).then((result) => {
                            if (result.response === true) {
                                toast.success(`Table ${id_table} dimatikan.`);
                            } else {
                                toast.error(`Table ${id_table} gagal dimatikan.`);
                            }
                        })
                    } else {
                        toast.error(`Table ${id_table} gagal dimatikan.`);
                    }
                })
            }
        });
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

                <div className="overview-pemb mb-5">
                    <div className="title-header-box mb-3">
                        <h3>Table List</h3>
                    </div>

                    <div className="row row-cols-1 row-cols-5 g-3">
                        {this.state.data_table}
                    </div>
                </div>

            </>
        )
    }
}

class ManualLampuContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <ManualLampu />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default ManualLampuContainer;