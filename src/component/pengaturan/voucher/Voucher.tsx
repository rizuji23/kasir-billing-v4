import React from "react";
import { Header, ModalUser } from '../../header/header';
import Sidebar from "../../sidebar/sidebar";
import Navbar_Menu from "../Navbar_Menu";
import DataTable, { createTheme } from 'react-data-table-component';
import { ipcRenderer } from "electron";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import DotAdded from "../../../system/DotAdded";

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

const ExpandableRowComponent: React.FC<any> = ({ data }) => {
    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>ID Voucher</small><br /> <b>{data.id_voucher}</b></li>
                <li className="list-group-item"><small>Kode Voucher</small><br /> <b>{data.kode_voucher}</b></li>
                <li className="list-group-item"><small>Deskripsi</small><br /> <b>{data.desc_voucher}</b></li>
                <li className="list-group-item"><small>Potongan</small><br /> <b>{data.potongan}%</b></li>
                <li className="list-group-item"><small>Berlaku</small><br /> <b>{data.start_masa}</b></li>
                <li className="list-group-item"><small>Kadaluarsa</small><br /> <b>{data.end_masa}</b></li>
                <li className="list-group-item"><small>Created At</small><br /> <b>{data.created_at}</b></li>
                <li className="list-group-item"><small>Updated At</small><br /> <b>{data.updated_at}</b></li>
            </ul>
        </>
    )
}

class Voucher extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data_voucher: {
                kode_voucher: "",
                desc_voucher: "",
                potongan: "",
                start_masa: "",
                end_masa: "",
            },
            data: [],
            columns: [
                {
                    name: "No",
                    selector: row => row.number,
                    sortable: true,
                },
                {
                    name: "Kode Voucher",
                    selector: row => row.kode_voucher,
                    sortable: true,
                },
                {
                    name: "Potongan",
                    selector: row => row.potongan,
                    sortable: true,
                },
                {
                    name: "Berlaku",
                    selector: row => row.start_masa,
                    sortable: true,
                },
                {
                    name: "Kadaluarsa",
                    selector: row => row.end_masa,
                    sortable: true,
                },
                {
                    name: "Tanggal",
                    selector: row => row.created_at,
                    sortable: true,
                }
            ],
            disabled: true,
            text_submit: "Buat Sekarang",
            text_title: "Tambah Voucher",
            disabled_opsi: true,
            id_voucher: "",

        }

        this.isObjectEmpty = this.isObjectEmpty.bind(this);
        this.validate = this.validate.bind(this);
        this.handleKodeVoucher = this.handleKodeVoucher.bind(this);
        this.handleDescVoucher = this.handleDescVoucher.bind(this);
        this.handlePotongan = this.handlePotongan.bind(this);
        this.handleStartMasa = this.handleStartMasa.bind(this);
        this.handleEndMasa = this.handleEndMasa.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleDeleteVoucher = this.handleDeleteVoucher.bind(this);
        this.handleEditVoucher = this.handleEditVoucher.bind(this);
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    clearState() {
        this.setState({
            data_voucher: {
                kode_voucher: "",
                desc_voucher: "",
                potongan: "",
                start_masa: "",
                end_masa: "",
            },
            disabled: true,
            text_submit: "Buat Sekarang",
            text_title: "Tambah Voucher",
            disabled_opsi: true,
            id_voucher: "",
        })
    }

    validate() {
        setTimeout(() => {
            if (this.isObjectEmpty(this.state.data_voucher)) {
                if (this.state.disabled_opsi === true) {
                    this.setState({ disabled: false, text_submit: 'Buat Sekarang' });
                } else {
                    this.setState({ disabled: false, text_submit: 'Edit Sekarang' });
                }
            } else {
                if (this.state.disabled_opsi === true) {
                    this.setState({ disabled: true, text_submit: 'Buat Sekarang' });
                } else {
                    this.setState({ disabled: true, text_submit: 'Edit Sekarang' });
                }
            }
        }, 1000)
    }

    handleKodeVoucher(e) {
        if (e.target.value.length === 0) {
            toast.error("Kode voucher harus diisi");
            this.validate();
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    kode_voucher: "",
                }
            }));
        } else {
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    kode_voucher: e.target.value,
                }
            }));
            this.validate();
        }
    }

    handleDescVoucher(e) {
        if (e.target.value.length === 0) {
            toast.error("Deskripsi voucher harus diisi");
            this.validate();
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    desc_voucher: "",
                }
            }));
        } else {
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    desc_voucher: e.target.value,
                }
            }));
            this.validate();
        }
    }

    handlePotongan(e) {
        if (e.target.value.length === 0) {
            toast.error("Potongan voucher harus diisi");
            this.validate();
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    potongan: "",
                }
            }));
        } else {
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    potongan: e.target.value,
                }
            }));
            this.validate();
        }
    }

    handleStartMasa(e) {
        if (e.target.value.length === 0) {
            toast.error("Mulai dari tanggal harus diisi");
            this.validate();
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    start_masa: "",
                }
            }));
        } else {
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    start_masa: e.target.value,
                }
            }));
            this.validate();
        }
    }

    handleEndMasa(e) {
        if (e.target.value.length === 0) {
            toast.error("Kadaluarsa pada tanggal harus diisi");
            this.validate();
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    end_masa: "",
                }
            }));
        } else {
            this.setState(prevState => ({
                data_voucher: {
                    ...prevState.data_voucher,
                    end_masa: e.target.value,
                }
            }));
            this.validate();
        }
    }

    getVoucherData() {
        ipcRenderer.invoke("voucher", true, false, false, false, []).then((result) => {
            if (result.response === true) {
                let i = 1;
                result.data.map(el => el['number'] = i++);
                this.setState({ data: result.data });
            } else {
                toast.error("Data kosong!");
            }
        })
    }

    componentDidMount(): void {
        this.getVoucherData();
    }

    handleAdd() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan disimpan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                ipcRenderer.invoke("voucher", false, true, false, false, this.state.data_voucher).then((result) => {
                    console.log(result);
                    if (result?.response === true) {
                        toast.success("Voucher berhasil disimpan.");
                        this.getVoucherData()
                        this.clearState()
                    } else {
                        toast.success("Voucher gagal disimpan.");
                        this.getVoucherData()
                        this.clearState()
                    }
                })
            }
        })
    }

    handleSelected(selectedRow) {
        if (selectedRow.selectedCount !== 0) {
            console.log(selectedRow);
            const data_row = selectedRow.selectedRows[0];
            this.setState(prevState => ({
                ...prevState.data_voucher,
                data_voucher: {
                    kode_voucher: data_row.kode_voucher,
                    desc_voucher: data_row.desc_voucher,
                    potongan: data_row.potongan,
                    start_masa: data_row.start_masa,
                    end_masa: data_row.end_masa,
                },
                disabled_opsi: false,
                text_submit: "Edit Sekarang",
                text_title: "Edit Voucher",
                id_voucher: data_row.id_voucher,
            }));
        } else {
            this.clearState();
        }
    }

    handleDeleteVoucher() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                ipcRenderer.invoke("voucher", false, false, false, true, this.state.id_voucher).then((result) => {
                    if (result?.response === true) {
                        toast.success("Voucher berhasil dihapus.");
                        this.getVoucherData();
                        this.clearState();
                    } else {
                        toast.error("Voucher gagal dihapus.");
                        this.getVoucherData();
                        this.clearState();
                    }
                })
            }
        });
    }

    handleEditVoucher() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan diubah!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data_voucher = {
                    kode_voucher: this.state.data_voucher.kode_voucher,
                    desc_voucher: this.state.data_voucher.desc_voucher,
                    potongan: this.state.data_voucher.potongan,
                    start_masa: this.state.data_voucher.start_masa,
                    end_masa: this.state.data_voucher.end_masa,
                    id_voucher: this.state.id_voucher,
                }

                ipcRenderer.invoke("voucher", false, false, true, false, data_voucher).then((result) => {
                    if (result?.response === true) {
                        toast.success("Voucher berhasil diedit");
                        this.getVoucherData();
                        this.clearState();
                    } else {
                        toast.error("Voucher gagal diedit");
                        this.getVoucherData();
                        this.clearState();
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

                <div className="keuangan-list">
                    <div className="bg-dark box-dark mb-3">
                        <h5 className="text-center">{this.state.text_title}</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="row">
                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label htmlFor="usr">Kode Voucher</label>
                                            <input type="text" value={this.state.data_voucher.kode_voucher} onChange={this.handleKodeVoucher} className="form-control custom-input" />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Deskripsi</label>
                                            <textarea className="form-control custom-input" onChange={this.handleDescVoucher} value={this.state.data_voucher.desc_voucher} cols={30} rows={3}>{this.state.data_voucher.desc_voucher}</textarea>
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Potongan</label>
                                            <div className="input-group mt-2">
                                                <span className="input-group-text" id="inputGroup-sizing-default">%</span>
                                                <input type="number" className="form-control group-input-custom"
                                                    aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                    id="uang_cash_active" value={this.state.data_voucher.potongan} onChange={this.handlePotongan} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label htmlFor="usr">Mulai dari tanggal</label>
                                            <input type="date" value={this.state.data_voucher.start_masa} onChange={this.handleStartMasa} className="form-control custom-input" />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Kadaluarsa pada tanggal</label>
                                            <input type="date" className="form-control custom-input" value={this.state.data_voucher.end_masa} onChange={this.handleEndMasa} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-end mt-3">
                            <button className="btn btn-primary btn-primary-cozy" onClick={this.state.disabled_opsi === true ? this.handleAdd : this.handleEditVoucher} disabled={this.state.disabled}>{this.state.text_submit}</button>
                        </div>
                    </div>
                </div>

                <div className="card card-custom-dark mb-5">
                    <div className="card-header">
                        <div className="d-flex">
                            <div className="p-2 me-auto">
                                <h5>List Voucher</h5>
                            </div>
                            <div className="p-2">
                                <button className="btn btn-danger me-3" disabled={this.state.disabled_opsi} onClick={this.handleDeleteVoucher}>Hapus</button>
                            </div>

                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <DataTable columns={this.state.columns} data={this.state.data} pagination theme="solarized" selectableRows expandableRows selectableRowsSingle onSelectedRowsChange={this.handleSelected} expandableRowsComponent={ExpandableRowComponent} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class VoucherContainer extends React.Component<any, any> {
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
                        <Voucher />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default VoucherContainer;