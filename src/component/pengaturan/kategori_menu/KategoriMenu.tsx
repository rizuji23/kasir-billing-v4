import React from "react";
import {Header, ModalUser} from '../../header/header';
import Sidebar from "../../sidebar/sidebar";
import Navbar_Menu from "../Navbar_Menu";
import DataTable, { createTheme }  from 'react-data-table-component';
import { ipcRenderer } from "electron";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';

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

const ExpandableRowComponent: React.FC<any> = ({data}) => {
    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>Nama</small><br /> <b>{data.nama_kategori}</b></li>
                <li className="list-group-item"><small>Created At</small><br /> <b>{data.created_at}</b></li>
                <li className="list-group-item"><small>Updated At</small><br /> <b>{data.updated_at}</b></li>
            </ul>
        </>
    )
}

class KategoriMenu extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            text_title: 'Tambah Kategori Menu',
            data_kategori: {
                nama_kategori: ''
            },
            disabled_opsi: true,
            disabled: true,
            text_submit: 'Buat Sekarang',
            columns: [
                {
                    name: 'No',
                    selector: row => row.number,
                    sortable: true,
                },
                {
                    name: 'Nama',
                    selector: row => row.nama_kategori,
                    sortable: true,
                }
            ],
            data: [],
            id_kategori_menu: '',
        }

        this.isObjectEmpty = this.isObjectEmpty.bind(this);
        this.validate = this.validate.bind(this);
        this.handleName = this.handleName.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleAddKategori = this.handleAddKategori.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleEditKategori = this.handleEditKategori.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    clearState() {
        this.setState(prevState => ({
            text_title: 'Tambah Kategori Menu',
            ...prevState.data_kategori,
            data_kategori: {
                nama_kategori: ''
            },
            disabled_opsi: true,
            disabled: true,
            text_submit: 'Buat Sekarang',
            id_kategori_menu: '',
        }))
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    validate() {
        this.setState({text_submit: 'Checking Data...'});
        setTimeout(() => {
            if (this.isObjectEmpty(this.state.data_kategori)) {
                if (this.state.disabled_opsi === true) {
                    this.setState({disabled: false, text_submit: 'Buat Sekarang'});
                } else {
                    this.setState({disabled: false, text_submit: 'Edit Sekarang'});

                }
            } else {
                if (this.state.disabled_opsi === true) {
                    this.setState({disabled: true, text_submit: 'Buat Sekarang'});
                } else {
                    this.setState({disabled: true, text_submit: 'Edit Sekarang'});

                }            }
        }, 1000)
    }

    handleName(e) {
        if (e.target.value.length === 0) {
            toast.error("Nama kategori harus diisi");
            this.validate();
            this.setState(prevState => ({
                ...prevState.data_kategori,
                data_kategori: {
                    nama_kategori: '',
                }
            }));
        } else {
            this.validate();
            this.setState(prevState => ({
                ...prevState.data_kategori,
                data_kategori: {
                    nama_kategori: e.target.value
                }
            }));
        }
    }

    handleAddKategori() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan disimpan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const data_kategori = {
                    nama: this.state.data_kategori.nama_kategori
                }
                ipcRenderer.invoke("kategori_menu", false, true, false, false, data_kategori).then((result) => {
                    if (result.response === true) {
                        toast.success("Data Kategori Menu berhasil disimpan");
                        this.clearState();
                    } else {
                        toast.error("Data Kategori Menu gagal disimpan");
                        this.clearState();
                    }
                })
            }
        });
    }

    handleEditKategori() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan diedit!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const data_kategori = {
                    nama: this.state.data_kategori.nama_kategori,
                    id_kategori: this.state.id_kategori_menu
                }

                ipcRenderer.invoke("kategori_menu", false, false, true, false, data_kategori).then((result) => {
                    if (result.response === true) {
                        toast.success("Data Kategori Menu berhasil diedit");
                        this.clearState();
                        this.getDataKategori();
                    } else {
                        toast.error("Data Kategori Menu gagal diedit");
                        this.clearState();
                        this.getDataKategori();
                    }
                });
            }
        });
    }

    componentDidMount(): void {
        this.getDataKategori();
    }

    getDataKategori() {
        ipcRenderer.invoke("kategori_menu", true, false, false, false, []).then((result) => {
            console.log(result);
            if (result.response === true) {
                let i = 1;
                result.data.map(el => el['number'] = i++);
                this.setState({data: result.data});
            }
        })
    }

    handleSelected(selectedRow) {
        if (selectedRow.selectedCount !== 0) {
            const data = selectedRow.selectedRows[0];
            this.setState(prevState => ({
                ...prevState.data_kategori,
                data_kategori: {
                    nama_kategori: data.nama_kategori,
                },
                id_kategori_menu: data.id_kategori_menu,
                disabled_opsi: false,
                text_submit: 'Edit Sekarang',
            }));
        } else {
            this.clearState();
        }
    }

    handleDelete() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan diedit!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                ipcRenderer.invoke("kategori_menu", false, false, false, true, this.state.id_kategori_menu).then((result) => {
                    if (result.response === true) {
                        toast.success("Data Kategori Menu berhasil dihapus");
                        this.clearState();
                        this.getDataKategori();
                    } else {
                        toast.success("Data Kategori Menu gagal dihapus");
                        this.clearState();
                        this.getDataKategori();
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
                                <Navbar_Menu/>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10"><img
                                            src="assets/img/icon/refresh-ccw.png" id="refresh_table" alt=""/></a>
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
                                <div className="form-group">
                                    <label htmlFor="usr">Nama Kategori</label>
                                    <input type="text" onChange={this.handleName} value={this.state.data_kategori.nama_kategori} className="form-control custom-input" />
                                </div>
                            </div>
                        </div>
                            <div className="text-end mt-3">
                                <button className="btn btn-primary btn-primary-cozy" onClick={this.state.disabled_opsi === true ? this.handleAddKategori : this.handleEditKategori} disabled={this.state.disabled}>{this.state.text_submit}</button>
                            </div>
                    </div>
                </div>
                <div className="card card-custom-dark mb-5">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 me-auto">
                                    <h5>List Kategori</h5>
                                </div>
                                <div className="p-2">
                                    <button className="btn btn-danger me-3" onClick={this.handleDelete} disabled={this.state.disabled_opsi}>Hapus</button> 
                                    {/* <button className="btn btn-info" onClick={this.handleEdit} disabled={this.state.disabled_opsi}>Edit</button> */}
                                </div>

                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <DataTable columns={this.state.columns} data={this.state.data} pagination theme="solarized" selectableRows expandableRows selectableRowsSingle expandableRowsComponent={ExpandableRowComponent} onSelectedRowsChange={this.handleSelected} />
                            </div>
                        </div>
                    </div>
            </>
        )
    }
}

class KategoriMenuContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header/>
                    <Sidebar/>
                    <div className="box-bg">
                        <KategoriMenu/>
                    </div>
                </div>
                <ModalUser/>
            </>
        )
    }
}

export default KategoriMenuContainer;