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


class Admin extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_shift: [],
            isOpenShift: false,
            data_shift: {},
            list_harga_bill: [],
            data_harga_bill: {},
            isOpenHargaBilling: false,
            data_harga_billing: [],
        }
        this.getShift = this.getShift.bind(this);
        this.openShift = this.openShift.bind(this);
        this.closeShift = this.closeShift.bind(this);
        this.getHargaBilling = this.getHargaBilling.bind(this);
        this.openHargaBilling = this.openHargaBilling.bind(this);
        this.closeHargaBilling = this.closeHargaBilling.bind(this);
    }

    openShift(data_shift) {
        this.setState({
            isOpenShift: true,
            data_shift: data_shift,
        });
    }

    closeShift() {
        this.setState({
            isOpenShift: false,
        })
    }

    componentDidMount(): void {
        this.getShift();
        this.getHargaBilling();
    }

    getShift() {
        ipcRenderer.invoke("getShiftAdmin").then((result) => {
            console.log(result);
            if (result.response === true) {
                const container = result.data.map(el => {
                    return (
                        <><li className="list-group-item"><b>{el.shift}</b> ({el.start_jam} - {el.end_jam}) | <a href="javascript:void(0)" onClick={() => this.openShift({ shift: el.shift, start_jam: el.start_jam, end_jam: el.end_jam, id_shift: el.id_shift })}>Edit</a></li></>
                    )
                })

                this.setState({
                    list_shift: container,
                });
            } else {
                toast.error("Shift Kosong");
            }
        });
    }

    getHargaBilling() {
        ipcRenderer.invoke("getHargaBilling").then((result) => {
            console.log(result);
            if (result.response === true) {
                const container = result.data.map(el => {
                    return (
                        <><li className="list-group-item"><b>{el.tipe_durasi}</b> (Rp. {new DotAdded().parse(el.harga)}) | <a href="javascript:void(0)" onClick={() => this.openHargaBilling(el.tipe_durasi)}>Edit</a></li></>
                    )
                });
                this.setState({
                    list_harga_bill: container,
                });
            } else {
                toast.error("Harga Billing Kosong");
            }
        })
    }

    openHargaBilling(shift) {
        ipcRenderer.invoke("getHargaBilling").then((result) => {
            const filter = result.data.filter(el => el.tipe_durasi === shift);
            this.setState({
                isOpenHargaBilling: true,
                data_harga_billing: filter,
            });
        });
    }

    closeHargaBilling() {
        this.setState({
            isOpenHargaBilling: false,
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
                        <h5 className="">Shift</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <ul className="list-group">
                                    {this.state.list_shift}
                                </ul>
                            </div>
                        </div>

                        <h5 className="mt-4">Harga Billing</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <ul className="list-group">
                                    {this.state.list_harga_bill}
                                </ul>
                            </div>
                        </div>

                        <h5 className="mt-4">Hardware</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <div className="alert alert-danger">
                                        <b>"Reconnect Arduino"</b> atau <b>Mengganti COM Port</b> akan menyebabkan Lampu mati sesaat.
                                    </div>
                                    <button className="btn btn-danger">Reconnect Arduino</button>
                                </div>
                                <hr />
                                <div className="form-group mt-3">
                                    <label htmlFor="">COM Port</label>
                                    <select name="" id="" className="form-control custom-input">
                                        <option value="">Pilih COM Port</option>
                                    </select>
                                </div>
                                <small>Last Selected:</small>
                                <div className="form-group mt-3 text-end">
                                    <button className="btn btn-primary btn-primary-cozy btn-sm" >Simpan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalShiftAdmin isOpenShift={this.state.isOpenShift} closeShift={this.closeShift} data_shift={this.state.data_shift} getShift={this.getShift} />
                <ModalHargaBilling isOpenHargaBilling={this.state.isOpenHargaBilling} closeHargaBilling={this.closeHargaBilling} data_harga_billing={this.state.data_harga_billing} getHargaBilling={this.getHargaBilling} />
            </>
        )
    }
}

class AdminContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <Admin />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}


export default AdminContainer;