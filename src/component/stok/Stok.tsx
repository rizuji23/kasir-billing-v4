import React from "react";
import { Header, ModalUser } from "../header/header";
import Sidebar from "../sidebar/sidebar";
import NavbarStok from "./NavbarStok";
import { ToastContainer, toast } from "react-toastify";
import TableManagement from "./TableManagement";
import { ipcRenderer } from "electron";
import moment from "moment";
import 'moment-timezone';
import ModalStokMasuk from "./ModalStokMasuk";
import ModalEditStokMasuk from "./ModalEditStokMasuk";
import ModalStokFilter from "./ModalStokFilter";
import swal from "sweetalert";

class Stok extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data_menu: "",
            checked: "",
            isOpenMasuk: false,
            isOpenMasukEdit: false,
            option_menu: "",
            isOpenFilter: false,
            user_in: sessionStorage.getItem('username'),
            date_now: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            disabled_new: true,
            disabled_masuk: "",
        }

        this.getMenu = this.getMenu.bind(this);
        this.closeModalMasuk = this.closeModalMasuk.bind(this);
        this.isOpenMasuk = this.isOpenMasuk.bind(this);
        this.closeModalMasukEdit = this.closeModalMasukEdit.bind(this);
        this.isOpenMasukEdit = this.isOpenMasukEdit.bind(this);
        this.closeModalFilter = this.closeModalFilter.bind(this);
        this.isOpenFilter = this.isOpenFilter.bind(this);
        this.handleOpenNewStok = this.handleOpenNewStok.bind(this);
    }

    componentDidMount(): void {
        this.getMenu();
    }


    getMenu() {
        const day = {
            tanggal: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
        }

        const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
        const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

        const hours = moment().tz("Asia/Jakarta").format("HH");
        var shift_now = "";

        if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
            shift_now = "pagi";
            console.log("PAGI")
            this.setState({
                disabled_masuk: false,
            })
        } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
            shift_now = "malam";
            console.log("MALAM")
            this.setState({
                disabled_masuk: true,
            })
        }

        ipcRenderer.invoke("getStok", day).then((result) => {
            console.log(result);
            if (result.response === true) {
                let no = 1;
                var night = Array<any>();
                var day = Array<any>();
                result.data.forEach(el => {
                    if (el.shift === "pagi") {
                        day.push(el);
                    } else if (el.shift === "malam") {
                        night.push(el);
                    }
                });

                const component_menu = day.map((el, i) => {
                    console.log(el.shift);
                    if (el.shift === "pagi") {
                        return (
                            <>
                                <tr>
                                    <td className="border-end">{no++}</td>
                                    <td className="border-end text-start">{el.nama_menu}</td>
                                    <td className="border-end">{el.stok_awal}</td>
                                    <td>{el.stok_masuk}</td>
                                    <td className="border-start">{el.terjual}</td>
                                    <td>{el.sisa}</td>
                                    <td className="border-start">{night[i].terjual}</td>
                                    <td>{night[i].sisa}</td>
                                    <td className="border-start border-end">{el.stok_akhir}</td>
                                    <td></td>
                                </tr>
                            </>
                        )
                    }
                });

                const option_menu = result.data.map((el, i) => {
                    if (el.shift === "pagi") {
                        return (
                            <>
                                <option value={`["${el.id_menu}", "${el.id_stok_main}"]`}>{el.nama_menu}</option>
                            </>
                        )
                    }
                })

                this.setState({
                    data_menu: component_menu,
                    option_menu: option_menu,
                    disabled_new: true,
                })
            } else {
                this.setState({
                    disabled_new: false,
                })
                toast.error("Buku stok belum ditambahkan atau Kosong.");
            }
        })
    }

    handleOpenNewStok() {
        swal({
            title: "Apa kamu yakin?",
            text: "Buku stok baru akan dibuat.",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const day = {
                    user_in: this.state.user_in,
                    date_now: this.state.date_now,
                }
                ipcRenderer.invoke("newBookStok", day).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Buku Stok Dibuat..");
                        this.getMenu();
                    }
                });
            }
        });

    }

    isOpenMasuk() {
        this.setState({
            isOpenMasuk: true,
        })
    }

    closeModalMasuk() {
        this.setState({
            isOpenMasuk: false,
        })
    }

    isOpenMasukEdit() {
        this.setState({
            isOpenMasukEdit: true,
        })
    }

    closeModalMasukEdit() {
        this.setState({
            isOpenMasukEdit: false,
        })
    }


    isOpenFilter() {
        this.setState({
            isOpenFilter: true
        })
    }

    closeModalFilter() {
        this.setState({
            isOpenFilter: false
        })
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
                <NavbarStok handleOpenNewStok={this.handleOpenNewStok} disabled_new={this.state.disabled_new} />
                <div className="card card-custom-dark mb-5">
                    <div className="card-header">
                        <div className="d-flex">
                            <div className="p-2 me-auto">
                                <h5>Laporan Stok Harian</h5>
                                <small>Tanggal: {moment().tz("Asia/Jakarta").format("YYYY-MM-DD")}</small>
                            </div>
                            <div className="p-2">
                                <button className="btn btn-primary btn-primary-cozy btn-sm" onClick={this.isOpenFilter}>Filter Laporan</button>
                            </div>
                            <div className="p-2">
                                <button className="btn btn-primary btn-primary-cozy-dark btn-sm">Export Laporan</button>
                            </div>

                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <TableManagement data={this.state.data_menu} />
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="card card-custom-dark-light">
                                    <div className="card-body">
                                        <div className="detail-laporan-stok">
                                            <h5>Detail Laporan: </h5>
                                            <div className="hr-white"></div>
                                            <ul className="list-group list-group-dark mt-3">
                                                <li className="list-group-item"><small>Total Stok Masuk:</small> <br /> <b>30 item</b></li>
                                                <li className="list-group-item"><small>Total Terjual:</small> <br /> <b>35 item</b></li>
                                                <li className="list-group-item"><small>Tanggal Pembuatan:</small> <br /> <b>23-05-2023 09:00:00</b></li>
                                                <li className="list-group-item"><small>Tanggal Update:</small> <br /> <b>23-05-2023 20:00:00</b></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-custom-dark-light">
                                    <div className="card-body">
                                        <div className="detail-laporan-stok">
                                            <h5>Management Stok: </h5>
                                            <div className="hr-white"></div>
                                            <div className="card card-custom-dark p-3">
                                                {this.state.disabled_masuk === true && <><div className="alert alert-danger"><span><b>Tambah Stok Masuk</b> hanya bisa saat shift <b>Pagi</b></span>.</div></>}
                                                <div className="d-flex">
                                                    <div className="">
                                                        <button className="btn btn-primary btn-sm" disabled={this.state.disabled_masuk} onClick={this.isOpenMasuk}>Tambah Stok Masuk</button>
                                                    </div>
                                                    {/* <div className="p-1">
                                                        <button className="btn btn-success btn-sm" onClick={this.isOpenMasukEdit}>Edit Stok Masuk</button>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalStokMasuk isOpenMasuk={this.state.isOpenMasuk} closeModalMasuk={this.closeModalMasuk} getMenu={this.getMenu} option_menu={this.state.option_menu} />
                <ModalEditStokMasuk isOpenMasukEdit={this.state.isOpenMasukEdit} closeModalMasukEdit={this.closeModalMasukEdit} option_menu={this.state.option_menu} />
                <ModalStokFilter isOpenFilter={this.state.isOpenFilter} closeModalFilter={this.closeModalFilter} />

            </>
        )
    }
}

class StokContainer extends React.Component<any, any> {
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
                        <Stok />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default StokContainer;