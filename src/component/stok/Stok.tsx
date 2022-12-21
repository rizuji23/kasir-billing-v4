import React from "react";
import { Header, ModalUser } from "../header/header";
import Sidebar from "../sidebar/sidebar";
import NavbarStok from "./NavbarStok";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import TableManagement from "./TableManagement";
import { ipcRenderer } from "electron";
import moment from "moment";
import ModalStokMasuk from "./ModalStokMasuk";
import ModalEditStokMasuk from "./ModalEditStokMasuk";

class Stok extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data_menu: "",
            checked: "",
            isOpenMasuk: false,
            isOpenMasukEdit: false,
            option_menu: "",
        }

        this.getMenu = this.getMenu.bind(this);
        this.closeModalMasuk = this.closeModalMasuk.bind(this);
        this.isOpenMasuk = this.isOpenMasuk.bind(this);
        this.closeModalMasukEdit = this.closeModalMasukEdit.bind(this);
        this.isOpenMasukEdit = this.isOpenMasukEdit.bind(this);
    }

    componentDidMount(): void {
        this.getMenu();
    }


    getMenu() {
        ipcRenderer.invoke("menu", true, false, false, false, []).then((result) => {
            console.log(result);

            if (result.response === true) {
                let no = 1;
                const component_menu = result.data.map((el, i) => {
                    return (
                        <>
                            <tr>

                                <td className="border-end">{no++}</td>
                                <td className="border-end">{el.nama_menu}</td>
                                <td className="border-end">0</td>
                                <td >0</td>
                                <td className="border-start">2</td>
                                <td>2</td>
                                <td className="border-start">2</td>
                                <td>3</td>
                                <td className="border-start border-end">3</td>
                                <td></td>
                            </tr>
                        </>
                    )
                });

                const option_menu = result.data.map((el, i) => {
                    return (
                        <>
                            <option value={el.id_menu[0].id_menu}>{el.nama_menu}</option>
                        </>
                    )
                })

                this.setState({
                    data_menu: component_menu,
                    option_menu: option_menu
                })
            }
        })
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

                <div className="card card-custom-dark mb-5">
                    <div className="card-header">
                        <div className="d-flex">
                            <div className="p-2 me-auto">
                                <h5>Laporan Stok Harian</h5>
                                <small>Tanggal: {moment().tz("Asia/Jakarta").format("DD-MM-YYYY")}</small>
                            </div>
                            <div className="p-2">
                                <button className="btn btn-primary btn-primary-cozy btn-sm">Filter Laporan</button>
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
                                                <li className="list-group-item"><small>Totak Terjual:</small> <br /> <b>35 item</b></li>
                                                <li className="list-group-item"><small>Kasir Shift 1:</small> <br /> <b>Aye Shabira</b></li>
                                                <li className="list-group-item"><small>Kasir Shift 2:</small> <br /> <b>Saha Weh</b> </li>
                                                <li className="list-group-item"><small>Tanggal Pembuatan:</small> <br /> <b></b></li>
                                                <li className="list-group-item"><small>Tanggal Update:</small> <br /> <b></b></li>

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
                                            <div className="card card-custom-dark">
                                                <div className="d-flex ps-3">
                                                    <div className="p-1">
                                                        <button className="btn btn-primary btn-sm" onClick={this.isOpenMasuk}>Tambah Stok Masuk</button>
                                                    </div>
                                                    <div className="p-1">
                                                        <button className="btn btn-success btn-sm" onClick={this.isOpenMasukEdit}>Edit Stok Masuk</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalStokMasuk isOpenMasuk={this.state.isOpenMasuk} closeModalMasuk={this.closeModalMasuk} option_menu={this.state.option_menu} />
                <ModalEditStokMasuk isOpenMasukEdit={this.state.isOpenMasukEdit} closeModalMasukEdit={this.closeModalMasukEdit} option_menu={this.state.option_menu} />


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
                        <NavbarStok />
                        <Stok />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default StokContainer;