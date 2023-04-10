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
import DotAdded from "../../system/DotAdded";
import ModalStokExport from "./ModalStokExport";
import ModalKeterangan from "./ModalKeterangan";

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
            disabled_masuk: false,
            total_stok_masuk: "",
            total_stok_keluar: "",
            tanggal_pembuatan: "",
            tanggal_update: "",
            disabled_filter: true,
            tanggal_now: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
            disabled_reset: false,
            isOpenExport: false,
            data_keterangan: {
                response: "",
                data: [],
            },
            isOpenKeterangan: false,
        }

        this.getMenu = this.getMenu.bind(this);
        this.closeModalMasuk = this.closeModalMasuk.bind(this);
        this.isOpenMasuk = this.isOpenMasuk.bind(this);
        this.closeModalExport = this.closeModalExport.bind(this);
        this.isOpenExport = this.isOpenExport.bind(this);
        this.closeModalMasukEdit = this.closeModalMasukEdit.bind(this);
        this.isOpenMasukEdit = this.isOpenMasukEdit.bind(this);
        this.closeModalFilter = this.closeModalFilter.bind(this);
        this.isOpenFilter = this.isOpenFilter.bind(this);
        this.handleOpenNewStok = this.handleOpenNewStok.bind(this);
        this.handleDateFilter = this.handleDateFilter.bind(this);
        this.getFilterDate = this.getFilterDate.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.getKeterangan = this.getKeterangan.bind(this);
        this.closeModalKeterangan = this.closeModalKeterangan.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount(): void {
        this.getMenu(true);
    }

    handleDateFilter(date) {
        const day = {
            tanggal: date,
        }

        ipcRenderer.invoke("getStok", day).then((result) => {
            console.log(result);
            if (result.response === true) {
                toast.success("Data tersedia");
                this.setState({
                    disabled_filter: false,
                });
            } else {
                toast.error("Data tidak tersedia");
                this.setState({
                    disabled_filter: true,
                })
            }
        })
    }

    getFilterDate(date) {
        this.getMenu(false, date);
        toast.success("Stok berhasil difilter.")
        this.setState({
            disabled_masuk: true,
            tanggal_now: date,
            disabled_reset: true,
        }, () => {
            this.closeModalFilter();
        });
    }

    resetFilter() {
        this.getMenu(true);
        toast.success("Stok berhasil direset");
        this.setState({
            disabled_masuk: false,
            tanggal_now: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
            disabled_reset: false,
        });
    }

    getMenu(date, val?) {
        var day;
        if (date) {
            day = {
                tanggal: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
            }
        } else {
            day = {
                tanggal: val
            }
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

                day.sort((a, b) => a.nama_menu.toLowerCase().localeCompare(b.nama_menu.toLowerCase()))
                night.sort((a, b) => a.nama_menu.toLowerCase().localeCompare(b.nama_menu.toLowerCase()))
                result.data.sort((a, b) => a.nama_menu.toLowerCase().localeCompare(b.nama_menu.toLowerCase()))

                var total_stok_masuk = 0;

                const component_menu = day.map((el, i) => {
                    if (el.shift === "pagi") {
                        total_stok_masuk += el.stok_masuk
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
                                    <td><a href="javascript:void(0)" onClick={() => this.getKeterangan(el.id_menu, el.id_stok_main)}>Lihat</a></td>
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
                });

                const total_stok_keluar = result.data.reduce((total, arr) => total + arr.terjual || 0, 0);
                const tanggal_update = DotAdded.arrayMax(result.data)

                this.setState({
                    data_menu: component_menu,
                    option_menu: option_menu,
                    disabled_new: true,
                    total_stok_masuk: total_stok_masuk,
                    total_stok_keluar: total_stok_keluar,
                    tanggal_pembuatan: result.data[0].created_at,
                    tanggal_update: tanggal_update.updated_at
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
                        this.getMenu(true);
                    }
                });
            }
        });

    }

    isOpenExport() {
        this.setState({
            isOpenExport: true,
        })
    }

    closeModalExport() {
        this.setState({
            isOpenExport: false,
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

    getKeterangan(id_menu, id_stok_main) {
        const data = {
            id_menu: id_menu,
            id_stok_main: id_stok_main,
        }

        ipcRenderer.invoke("getKeterangan", data).then((result) => {
            console.log(result);
            this.setState({
                isOpenKeterangan: true,
                data_keterangan: {
                    response: result.response,
                    data: result.data,
                }
            })
        })
    }

    closeModalKeterangan() {
        this.setState({
            isOpenKeterangan: false,
        })
    }

    handleRefresh() {
        const data = {
            user_in: sessionStorage.getItem("username"),
        }

        ipcRenderer.invoke("getRefresh", data).then((result) => {
            console.log(result);

            if (result.response === true) {
                toast.success("Stok sudah direfresh.");
                this.getMenu(true);
            } else {
                toast.error("Stok gagal direfresh");
                this.getMenu(true);
            }
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
                                <small>Tanggal: {this.state.tanggal_now}</small>
                            </div>
                            <div className="p-2">
                                <button className="btn btn-primary btn-primary-cozy btn-sm" onClick={this.isOpenFilter}>Filter Laporan</button>
                            </div>
                            {
                                this.state.disabled_reset === true ? <div className="p-2">
                                    <button className="btn btn-danger" onClick={this.resetFilter}>Reset Filter</button>
                                </div> : <></>
                            }
                            <div className="p-2">
                                <button className="btn btn-primary btn-primary-cozy-dark btn-sm" onClick={this.isOpenExport}>Export Laporan</button>
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
                                                <li className="list-group-item"><small>Total Stok Masuk:</small> <br /> <b>{this.state.total_stok_masuk} item</b></li>
                                                <li className="list-group-item"><small>Total Terjual:</small> <br /> <b>{this.state.total_stok_keluar} item</b></li>
                                                <li className="list-group-item"><small>Tanggal Pembuatan:</small> <br /> <b>{this.state.tanggal_pembuatan}</b></li>
                                                <li className="list-group-item"><small>Tanggal Update:</small> <br /> <b>{this.state.tanggal_update}</b></li>
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

                                                <div className="d-flex">
                                                    <div className="">
                                                        <button className="btn btn-primary btn-sm" disabled={this.state.disabled_masuk} onClick={this.isOpenMasuk}>Tambah Stok Masuk</button>
                                                    </div>
                                                    {/* <div className="p-1">
                                                        <button className="btn btn-success btn-sm" onClick={this.isOpenMasukEdit}>Edit Stok Masuk</button>
                                                    </div> */}
                                                    <div className="ps-2">
                                                        <button className="btn btn-success btn-sm" onClick={this.handleRefresh}>Refresh Menu</button>
                                                    </div>
                                                </div>

                                                <div className="alert alert-success mt-3">
                                                    <span><b>Refresh Menu</b> adalah jika menu baru dimasukan dan pada table <b>Stok</b> tidak ada menu tersebut, maka klik <b>Refresh Menu</b>.</span>
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
                <ModalStokFilter isOpenFilter={this.state.isOpenFilter} closeModalFilter={this.closeModalFilter} handleDateFilter={this.handleDateFilter} getFilterDate={this.getFilterDate} disabled_filter={this.state.disabled_filter} />
                <ModalStokExport isOpenExport={this.state.isOpenExport} closeModalExport={this.closeModalExport} handleDateFilter={this.handleDateFilter} getFilterDate={this.getFilterDate} disabled_filter={this.state.disabled_filter} />

                <ModalKeterangan isOpenKeterangan={this.state.isOpenKeterangan} closeModalKeterangan={this.closeModalKeterangan} data_keterangan={this.state.data_keterangan} />

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