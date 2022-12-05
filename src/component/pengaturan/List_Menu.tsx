import React from "react";
import { Header, ModalUser } from '../header/header';
import Sidebar from "../sidebar/sidebar";
import Navbar_Menu from "./Navbar_Menu";
import DataTable, { createTheme } from 'react-data-table-component';
import { ipcRenderer } from "electron";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import DotAdded from "../../system/DotAdded";

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
    const dot = new DotAdded();
    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>Nama Menu</small><br /> <b>{data.nama_menu}</b></li>
                <li className="list-group-item"><small>Harga</small><br /> <b>Rp. {dot.parse(data.harga_menu)}</b></li>
                <li className="list-group-item"><small>Kategori Menu</small><br /> <b>{data.kategori_menu_clean}</b></li>
                <li className="list-group-item"><small>Gambar</small><br /> <img src={`assets/img/menu/${data.img_file}`} width={150} alt="" /></li>
                <li className="list-group-item"><small>Harga Jual</small><br /> <b>Rp. {dot.parse(data.id_menu[0].harga_jual)}</b></li>
                <li className="list-group-item"><small>Modal</small><br /> <b>Rp. {dot.parse(data.id_menu[0].modal)}</b></li>
                <li className="list-group-item"><small>Keuntungan</small><br /> <b>Rp. {dot.parse(data.id_menu[0].keuntungan)}</b></li>
            </ul>
        </>
    )
}

class List_Menu extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_menu: {
                nama: '',
                harga: '',
                kategori: '',
                gambar: '',
                harga_jual: '',
                modal: '',
                keuntungan: '',
            },
            columns: [
                {
                    name: "No",
                    selector: row => row.number,
                    sortable: true,
                },
                {
                    name: "Nama Menu",
                    selector: row => row.nama_menu,
                    sortable: true,
                },
                {
                    name: "Harga",
                    selector: row => row.harga_menu,
                    sortable: true,
                },
                {
                    name: "Kategori",
                    selector: row => row.kategori_menu_clean,
                    sortable: true,
                }
            ],
            data: [],
            disabled: true,
            text_submit: 'Buat Sekarang',
            text_title: 'Tambah Menu',
            kategori_menu: `<option value="">Data Loading...</option>`,
            id_menu: '',
            disabled_opsi: true,
            name_kategori: ""
        }

        this.handleNama = this.handleNama.bind(this);
        this.handleHarga = this.handleHarga.bind(this);
        this.handleKategori = this.handleKategori.bind(this);
        this.handleGambar = this.handleGambar.bind(this);
        this.handleHargaJual = this.handleHargaJual.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleKeuntungan = this.handleKeuntungan.bind(this);
        this.validate = this.validate.bind(this);
        this.handleAddMenu = this.handleAddMenu.bind(this);
        this.clearState = this.clearState.bind(this);
        this.getDataMenu = this.getDataMenu.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEditMenu = this.handleEditMenu.bind(this);

    }

    clearState() {
        this.setState(prevState => ({
            ...prevState.data_menu,
            data_menu: {
                nama: '',
                harga: '',
                kategori: '',
                gambar: '',
                harga_jual: '',
                modal: '',
                keuntungan: '',
            },
            disabled: true,
            text_submit: 'Buat Sekarang',
            id_menu: '',
            disabled_opsi: true,
            name_kategori: "",
            text_title: 'Tambah Menu',

        }))
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    validate() {
        this.setState({ text_submit: 'Checking data...' });
        console.log(this.state.disabled_opsi)
        if (this.state.disabled_opsi !== false) {
            setTimeout(() => {
                if (this.isObjectEmpty(this.state.data_menu)) {
                    this.setState({ disabled: false, text_submit: 'Buat Sekarang' });
                } else {
                    this.setState({ disabled: true, text_submit: 'Buat Sekarang' });
                }
            }, 1000)
        } else {
            setTimeout(() => {
                if (this.isObjectEmpty(this.state.data_menu)) {
                    this.setState({ disabled: false, text_submit: 'Edit Sekarang' });
                } else {
                    this.setState({ disabled: true, text_submit: 'Edit Sekarang' });
                }
            }, 1000)
        }

    }

    handleNama(e) {
        if (e.target.value.length === 0) {
            toast.error("Nama harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    nama: ''
                }
            }))
        } else {
            this.validate()
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    nama: e.target.value
                }
            }))
        }
    }

    handleHarga(e) {
        if (e.target.value.length === 0) {
            toast.error("Harga harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    harga: ''
                }
            }))
        } else {
            const dot = new DotAdded();
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    harga: dot.parse(e.target.value)
                }
            }));
            this.validate()
        }
    }

    handleKategori(e) {
        if (e.target.value.length === 0) {
            toast.error("Kategori harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    kategori: ''
                }
            }))
        } else {
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    kategori: e.target.value
                }
            }))
            this.validate()
        }

    }

    handleGambar(e) {
        if (e.target.value.length === 0) {
            toast.error("Kategori harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    gambar: ''
                }
            }))
        } else {
            const obj_files = e.target.files[0];
            const obj_new = Array<any>();
            obj_new.push({ name: obj_files.name, size: obj_files.size, type: obj_files.type, path: obj_files.path });

            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    gambar: obj_new
                }
            }));
            this.validate()

        }

    }

    handleHargaJual(e) {
        if (e.target.value.length === 0) {
            toast.error("Harga Jual harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    harga_jual: ''
                }
            }));
        } else {
            const dot = new DotAdded();
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    harga_jual: dot.parse(e.target.value)
                }
            }));
            this.validate()
        }
    }

    handleModal(e) {
        if (e.target.value.length === 0) {
            toast.error("Modal harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    modal: '',
                    keuntungan: '',
                }
            }));
        } else {
            const dot = new DotAdded();
            const harga_jual = dot.decode(this.state.data_menu.harga_jual);
            const keuntungan = harga_jual - dot.decode(e.target.value);
            if (dot.isNegative(keuntungan)) {
                toast.error("Modal harus kurang dari Harga Jual");
            } else {
                this.setState(prevState => ({
                    data_menu: {
                        ...prevState.data_menu,
                        modal: dot.parse(e.target.value),
                        keuntungan: dot.parse(keuntungan)
                    }
                }));
                this.validate()
            }

        }
    }

    handleKeuntungan(e) {
        if (e.target.value.length === 0) {
            toast.error("Keuntungan harus diisi");
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    keuntungan: '',
                }
            }));
        } else {
            const dot = new DotAdded();
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    keuntungan: dot.parse(e.target.value)
                }
            }));
            this.validate()
        }
    }

    handleAddMenu() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan disimpan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    if (this.isObjectEmpty(this.state.data_menu)) {
                        ipcRenderer.invoke("menu", false, true, false, false, this.state.data_menu).then((result) => {
                            console.log(result)
                            if (result.response === true) {
                                toast.success("Menu berhasil ditambah");
                                this.clearState();
                                this.getDataMenu();
                            } else {
                                toast.error("Menu gagal ditambah");
                                this.clearState();
                                this.getDataMenu();
                            }
                        })
                    } else {
                        toast.error('Semua harus diinput');
                    }
                }
            });
    }

    componentDidMount(): void {
        this.getDataMenu()
        this.getSelectKategori()
    }

    getDataMenu() {
        ipcRenderer.invoke("menu", true, false, false, false, []).then((result) => {
            console.log(result);
            const dot = new DotAdded();
            if (result.response === true) {
                let i = 1;
                result.data.map(el => {
                    el['number'] = i++;
                    el['kategori_menu_clean'] = el['kategori_menu'][0]['nama_kategori'];
                    el['harga_menu'] = `Rp. ${dot.parse(el['harga_menu'])}`
                });
                this.setState({ data: result.data });
            }
        })
    }

    getSelectKategori() {
        ipcRenderer.invoke("kategori_menu", true, false, false, false, []).then((result) => {
            if (result.response === true) {
                const data_ = result.data.map((el, i) => {
                    return (
                        <>
                            <option value={el.id_kategori_menu} key={i}>{el.nama_kategori}</option>
                        </>
                    )
                });

                setTimeout(() => {
                    this.setState({ kategori_menu: data_ });
                }, 1000)
            } else {
                toast.error("Data Kategori Menu tida ada!");
            }
        })
    }

    handleSelected(selectedRow) {
        if (selectedRow.selectedCount !== 0) {
            const id_menu = selectedRow.selectedRows[0].id_menu[0].id_menu;
            const data_row = selectedRow.selectedRows[0];
            const data_row_join = selectedRow.selectedRows[0].id_menu[0];
            const dot = new DotAdded();
            this.setState(prevState => ({
                ...prevState.data_menu,
                data_menu: {
                    nama: data_row.nama_menu,
                    harga: dot.parse(data_row.harga_menu),
                    kategori: data_row.kategori_menu[0].id_kategori_menu,
                    harga_jual: dot.parse(data_row_join.harga_jual),
                    modal: dot.parse(data_row_join.modal),
                    keuntungan: dot.parse(data_row_join.keuntungan),
                },
                id_menu: id_menu,
                disabled_opsi: false,
                name_kategori: data_row.kategori_menu[0].nama_kategori,
                text_submit: "Edit Sekarang",
            }));
        } else {
            this.clearState();
        }
    }

    handleDelete() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    ipcRenderer.invoke("menu", false, false, false, true, this.state.id_menu).then((result) => {
                        if (result.response === true) {
                            toast.success('Data Menu berhasil dihapus');
                            this.clearState();
                            this.getDataMenu();
                        } else {
                            toast.error('Data Menu gagal dihapus');
                            this.clearState();
                            this.getDataMenu();
                        }
                    })
                }
            })
    }

    handleEditMenu() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data_menu = {
                        nama: this.state.data_menu.nama,
                        harga: this.state.data_menu.harga,
                        kategori: this.state.data_menu.kategori,
                        harga_jual: this.state.data_menu.harga_jual,
                        modal: this.state.data_menu.modal,
                        keuntungan: this.state.data_menu.keuntungan,
                        id_menu: this.state.id_menu
                    };

                    console.log(data_menu)

                    ipcRenderer.invoke("menu", false, false, true, false, data_menu).then((result) => {
                        console.log(result)
                        if (result.response === true) {
                            toast.success('Data Menu berhasil diedit');
                            this.clearState();
                            this.getDataMenu();
                        } else {
                            toast.error('Data Menu gagal diedit');
                            this.clearState();
                            this.getDataMenu();
                        }
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

                <div className="keuangan-list">
                    <div className="bg-dark box-dark mb-3">
                        <h5 className="text-center">{this.state.text_title}</h5>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="row">
                                    <div className="col-lg mb-2">
                                        <h5>Identitas</h5>
                                        <div className="form-group">
                                            <label htmlFor="usr">Nama menu</label>
                                            <input type="text" onChange={this.handleNama} value={this.state.data_menu.nama} className="form-control custom-input" />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Harga</label>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                                <input type="text" onChange={this.handleHarga} value={this.state.data_menu.harga} className="form-control group-input-custom"
                                                    aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                            </div>
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Kategori</label>
                                            <select className="form-control custom-input" onChange={this.handleKategori}>
                                                {this.state.data_menu.kategori === '' ? '' : <option value={this.state.data_menu.kategori} defaultChecked>{this.state.name_kategori}</option>}
                                                <option value="">Pilih Kategori</option>
                                                {this.state.kategori_menu}
                                            </select>
                                        </div>
                                        {this.state.disabled_opsi === true ?
                                            <>
                                                <div className="form-group mt-3">
                                                    <label htmlFor="usr">Gambar</label>
                                                    <input type="file" onChange={this.handleGambar} className="form-control custom-input" />
                                                </div>
                                            </> : <></>}

                                    </div>
                                    <div className="col-lg">
                                        <div className="box-dark-really">
                                            <h5>Detail Menu</h5>
                                            <hr />
                                            <div className="form-group">
                                                <label htmlFor="usr">Harga Jual</label>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                                    <input type="text" onChange={this.handleHargaJual} value={this.state.data_menu.harga_jual} className="form-control group-input-custom"
                                                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                                </div>
                                            </div>
                                            <div className="form-group mt-3">
                                                <label htmlFor="usr">Modal</label>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                                    <input type="text" onChange={this.handleModal} value={this.state.data_menu.modal} className="form-control group-input-custom"
                                                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                                </div>
                                            </div>
                                            <div className="form-group mt-3">
                                                <label htmlFor="usr">Keuntungan</label>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                                    <input type="text" onChange={this.handleKeuntungan} value={this.state.data_menu.keuntungan} className="form-control group-input-custom"
                                                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-end mt-3">
                            <button className="btn btn-primary btn-primary-cozy" onClick={this.state.disabled_opsi === true ? this.handleAddMenu : this.handleEditMenu} disabled={this.state.disabled}>{this.state.text_submit}</button>
                        </div>
                    </div>

                    <div className="card card-custom-dark mb-5">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 me-auto">
                                    <h5>List Menu</h5>
                                </div>
                                <div className="p-2">
                                    <button className="btn btn-danger me-3" onClick={this.handleDelete} disabled={this.state.disabled_opsi}>Hapus</button>
                                    {/* <button className="btn btn-info" onClick={this.handleEdit} disabled={this.state.disabled_opsi}>Edit</button> */}
                                </div>

                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <DataTable columns={this.state.columns} data={this.state.data} pagination theme="solarized" selectableRows expandableRows onSelectedRowsChange={this.handleSelected} selectableRowsSingle expandableRowsComponent={ExpandableRowComponent} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class ListMenu_Container extends React.Component<any, any> {
    render() {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <List_Menu />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default ListMenu_Container;