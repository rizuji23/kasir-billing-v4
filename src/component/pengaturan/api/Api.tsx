import React from "react";
import { Header, ModalUser } from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import Navbar_Menu from "../Navbar_Menu";
import { ToastContainer, toast } from "react-toastify";
import { ipcRenderer } from "electron";
import swal from "sweetalert";

async function turnon(id) {
    return new Promise((res, rej) => {
        ipcRenderer.invoke("lamp", true, false, id).then((result) => {
            console.log(result);
            res(result);
        })
    })
}

class Api extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data_link: {
                url: "",
            },
            data_printer: "",
            data_db_printer: "",
            data_input_printer: {
                printer: "",
            },
            data_port: "",
            data_input_port: "",
            data_port_db: "",
        }

        this.getApiLink = this.getApiLink.bind(this);
        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleApiLink = this.handleApiLink.bind(this);
        this.getPrinter = this.getPrinter.bind(this);
        this.handlePrinter = this.handlePrinter.bind(this);
        this.handlePrintSubmit = this.handlePrintSubmit.bind(this);
        this.getComPort = this.getComPort.bind(this);
        this.getPortDb = this.getPortDb.bind(this);
        this.handleInputPort = this.handleInputPort.bind(this);
        this.handleSetPort = this.handleSetPort.bind(this);
        this.handleReconnect = this.handleReconnect.bind(this);
    }

    componentDidMount(): void {
        this.getApiLink();
        this.getPrinter();
        this.getComPort();
        this.getPortDb();
    }

    getPortDb() {
        ipcRenderer.invoke("api_port", true, false, []).then((result) => {
            if (result.response === true) {
                this.setState({
                    data_port_db: result.data[0].url,
                })
            }
        })
    }

    handleInputPort(e) {
        if (e.target.value.length === 0) {
            toast.error("Port Wajib Diisi");
        } else {
            this.setState({
                data_input_port: e.target.value,
            });
        }
    }

    handleSetPort() {
        swal({
            title: "Apa kamu yakin?",
            text: "Port akan diubah & lampu akan mati sesaat!.",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                ipcRenderer.invoke("api_port", false, true, { port: this.state.data_input_port }).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Port berhasil disimpan.");
                        this.getPortDb();
                    } else {
                        toast.error("Port gagal disimpan.");
                    }
                })
            }
        });

    }

    getComPort() {
        ipcRenderer.invoke("getComPort").then((result) => {
            console.log(result);
            const comport = result.map((el) => {
                return (
                    <><option value={el.path}>{`${el.path} => ${el.friendlyName}`}</option></>
                )
            });

            this.setState({
                data_port: comport,
            })
        })
    }

    getApiLink() {
        ipcRenderer.invoke("api", false, true, []).then((result) => {

            if (result.response === true) {
                this.setState(prevState => ({
                    data_link: {
                        ...prevState.data_link,
                        url: result.data[0].url
                    }
                }));
            }
        });
    }

    handleApiLink(e) {
        if (e.target.value.length === 0) {
            this.setState(prevState => ({
                data_link: {
                    ...prevState.data_link,
                    url: e.target.value,
                }
            }));

            toast.error("Link harus diisi");
        } else {
            this.setState(prevState => ({
                data_link: {
                    ...prevState.data_link,
                    url: e.target.value,
                }
            }));
        }
    }

    handleLinkSubmit() {
        swal({
            title: "Apa kamu yakin?",
            text: "Link akan diubah!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data_link = {
                    url: this.state.data_link.url,
                }

                ipcRenderer.invoke("api", true, false, data_link).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        this.getApiLink();
                        toast.success("Link berhasil disimpan");
                    } else {
                        toast.error("Link gagal disimpan");
                    }
                })
            }
        });
    }

    getPrinter() {
        ipcRenderer.invoke("api_printer", false, true, []).then((result) => {
            console.log(result);
            const printer = result.data.map((el) => {
                return (
                    <><option value={el.name}>{el.displayName}</option></>
                )
            });

            const printer_db = result.data_db.map(el => {
                return (
                    <><option value={el.url} selected>{el.url}</option></>
                )
            })

            this.setState({
                data_printer: printer,
                data_db_printer: printer_db
            })

        });
    }

    handlePrinter(e) {
        if (e.target.value.length === 0) {
            this.setState(prevState => ({
                data_input_printer: {
                    ...prevState.data_input_printer,
                    printer: e.target.value,
                }
            }));

            toast.error("Link harus diisi");
        } else {
            this.setState(prevState => ({
                data_input_printer: {
                    ...prevState.data_input_printer,
                    printer: e.target.value,
                }
            }));
        }
    }

    handlePrintSubmit() {
        swal({
            title: "Apa kamu yakin?",
            text: "Printer akan diubah!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data_printer = {
                    printer: this.state.data_input_printer.printer
                }

                ipcRenderer.invoke("api_printer", true, false, data_printer).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        this.getPrinter();
                        toast.success("Printer berhasil disimpan");
                    } else {
                        toast.success("Printer gagal disimpan");
                    }
                });
            }
        });
    }

    handleReconnect() {
        swal({
            title: "Apa kamu yakin?",
            text: "Reconnect akan menyebabkan Lampu Mati sesaat",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                ipcRenderer.invoke("reconnectPort").then((result) => {
                    const arr = Array<string>('table001', 'table002', 'table003', 'table004', 'table005', 'table006', 'table007', 'table008', 'table009', 'table010', 'table011', 'table012');

                    toast.success("Menyiapkan Lampu. (15 Detik)");

                    setTimeout(() => {
                        toast.success("Menyalakan Lampu...");
                        const arr_null = Array<string>();
                        const arr_fine_regular = Array<any>();

                        arr.forEach(el => {
                            if (localStorage.getItem(el) !== null) {
                                var data = localStorage.getItem(el).replace(/\[|\]/g, '').split(',');
                                console.log(data)
                                if (data[0] !== 'not_active') {
                                    arr_fine_regular.push(el);
                                }
                            } else {
                                console.log(`${el} is null`);
                                arr_null.push(el);
                            }
                        });

                        let current = 1;
                        if (arr_fine_regular.length !== 0) {
                            Promise.all(arr_fine_regular.map(async (val, i) => {
                                setTimeout(() => {
                                    turnon(val).then(() => toast.success("On " + current++));
                                }, 2000 * current++);
                            }));
                        } else {
                            toast.info(`Tidak ada lampu yang dinyalakan.`);
                        }
                    }, 15000)


                    console.log(result);
                });
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
                <div className="overview-pemb">
                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex">
                                <Navbar_Menu />
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10"><img
                                            src="assets/img/icon/refresh-ccw.png" id="refresh_table" alt="" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="keuangan-list mb-5">
                    <div className="bg-dark box-dark mb-3">
                        <h5 className="">Server</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <input type="text" value={this.state.data_link.url} onChange={this.handleApiLink} className="form-control custom-input" />
                                </div>
                            </div>
                            <div className="text-end mt-3">
                                <button className="btn btn-primary btn-primary-cozy btn-sm" onClick={this.handleLinkSubmit}>Simpan</button>
                            </div>
                        </div>

                        <h5 className="mt-4">Printer</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <select className="form-control custom-input" onChange={this.handlePrinter}>
                                        {this.state.data_db_printer}
                                        <option value="">Pilih Printer</option>
                                        {this.state.data_printer}
                                    </select>
                                </div>
                            </div>
                            <div className="text-end mt-3">
                                <button className="btn btn-primary btn-primary-cozy btn-sm" onClick={this.handlePrintSubmit}>Simpan</button>
                            </div>
                        </div>

                        <h5 className="mt-4">Hardware</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <div className="alert alert-danger">
                                        <b>"Reconnect Arduino"</b> atau <b>Mengganti COM Port</b> akan menyebabkan Lampu mati sesaat.
                                    </div>
                                    <button className="btn btn-danger" onClick={this.handleReconnect}>Reconnect Arduino</button>
                                </div>
                                <hr />
                                <div className="form-group mt-3">
                                    <label htmlFor="">COM Port</label>
                                    <select name="" id="" onChange={this.handleInputPort} className="form-control custom-input">
                                        <option value="">Pilih COM Port</option>
                                        {this.state.data_port}
                                    </select>
                                </div>
                                <small>Last Selected: {this.state.data_port_db}</small>
                                <div className="form-group mt-3 text-end">
                                    <button className="btn btn-primary btn-primary-cozy btn-sm" onClick={this.handleSetPort}>Simpan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class ApiContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <Api />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}


export default ApiContainer;