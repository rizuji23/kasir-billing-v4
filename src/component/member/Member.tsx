import React from "react";
import { Header, ModalUser } from '../header/header';
import Sidebar from "../sidebar/sidebar";
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
    return (
        <>
            <ul className="mt-3 mb-3 list-group">
                <li className="list-group-item"><small>Nama Member</small><br /> <b>{data.nama_member}</b></li>
                <li className="list-group-item"><small>Kode</small><br /> <b>{data.kode_member}</b></li>
                <li className="list-group-item"><small>No Telp</small><br /> <b>{data.no_telp}</b></li>
                <li className="list-group-item"><small>Email</small><br /> <b>{data.email}</b></li>
                <li className="list-group-item"><small>No KTP</small><br /> <b>{data.no_ktp}</b></li>
                <li className="list-group-item"><small>Alamat</small><br /> <b>{data.alamat}</b></li>
                <li className="list-group-item"><small>Tipe Member</small><br /> <b>{data.tipe_member}</b></li>
                <li className="list-group-item"><small>Status</small><br /> <b>{data.status_member}</b></li>
            </ul>
        </>
    );
};

class Member extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            jenis_member: 'Premium',
            harga_member: 0,
            potongan: 0,
            kode_member: '',
            nama: '',
            no_telp: '',
            alamat: '',
            no_ktp: 0,
            disabled: true,
            kode_member_fetch: '',
            email: '',
            columns: [
                {
                    name: "No",
                    selector: row => row.number,
                    sortable: true,
                },
                {
                    name: "Kode Member",
                    selector: row => row.kode_member,
                    sortable: true,
                },
                {
                    name: "Nama",
                    selector: row => row.nama_member,
                    sortable: true,
                },
                {
                    name: "No Telp",
                    selector: row => row.no_telp,
                    sortable: true,
                },
                {
                    name: "Tipe",
                    selector: row => row.tipe_member,
                    sortable: true,
                },
                {
                    name: "Tanggal",
                    selector: row => row.created_at,
                    sortable: true,
                }
            ],
            data: [],
            disabled_opsi: true,
            id_member: '',
            editable: false,
        }

        this.handleJenisMember = this.handleJenisMember.bind(this);
        this.handleNama = this.handleNama.bind(this);
        this.handleNoTelp = this.handleNoTelp.bind(this);
        this.handleAlamat = this.handleAlamat.bind(this);
        this.handleNoKtp = this.handleNoKtp.bind(this);
        this.generateKodeMember = this.generateKodeMember.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }


    clearState() {
        this.setState({
            jenis_member: 'Premium',
            harga_member: 0,
            potongan: 0,
            kode_member: '',
            nama: '',
            no_telp: '',
            alamat: '',
            no_ktp: 0,
            disabled: true,
            kode_member_fetch: '',
            email: '',
            id_member: '',
            disabled_opsi: true,
            editable: false,
            playing: "",
        })
    }

    handleJenisMember(e) {
        this.setState({ jenis_member: e.target.value });
        this.insertPrice(e.target.value);
    }

    insertPrice(jenis_member) {
        const dot = new DotAdded();
        ipcRenderer.invoke("member", false, true, false, false, jenis_member, false, false).then((result) => {
            if (result.response === true) {
                this.setState({ harga_member: dot.parse(result.data[0].harga_member), potongan: result.data[0].potongan, playing: result.data[0].playing });
            }
        });
    }

    handleNama(e) {
        if (e.target.value.length === 0) {
            toast.error("Nama harus diisi!");
            this.setState({ nama: e.target.value, disabled: true });
        } else {
            this.setState({ nama: e.target.value });
            this.validation();
            this.generateKodeMember();
        }
    }

    handleNoTelp(e) {
        if (e.target.value.length === 0) {
            toast.error("No Telp harus diisi!");
            this.setState({ no_telp: e.target.value, disabled: true });
        } else {
            this.setState({ no_telp: e.target.value });
            this.validation();
            this.generateKodeMember();
        }
    }

    handleAlamat(e) {
        if (e.target.value.length === 0) {
            toast.error("Alamat harus diisi!");
            this.setState({ alamat: e.target.value, disabled: true });
        } else {
            this.setState({ alamat: e.target.value });
            this.validation();
        }
    }

    handleNoKtp(e) {
        if (e.target.value.length === 0) {
            toast.error("No KTP harus diisi!");
            this.setState({ no_ktp: e.target.value, disabled: true });
        } else {
            this.setState({ no_ktp: e.target.value });
            this.validation();
        }
    }

    handleEmail(e) {
        if (e.target.value.length === '') {
            toast.error("Email harus diisi!");
            this.setState({ email: e.target.value, disabled: true });
        } else {
            this.setState({ email: e.target.value });
            this.validation();
        }
    }

    validation() {
        if (this.state.nama === '' || this.state.no_telp === 0 || this.state.alamat === '' || this.state.no_ktp === 0) {
            this.setState({ disabled: true });
        } else {
            this.setState({ disabled: false });
        }
    }

    generateKodeMember() {
        this.setState({ kode_member: 'Loading Kode...' })
        setTimeout(() => {
            const nama_depan = this.state.nama.split(' ');
            const kode_member = `${nama_depan[0].toUpperCase()}${this.state.no_telp}`;
            this.setState({ kode_member: kode_member });
        }, 1000)
    }

    getAllMember() {
        ipcRenderer.invoke("member", true, false, false, '', [], false, false).then((result) => {
            if (result.response === true) {
                var i = 1;
                result.data.map(elem => elem['number'] = i++);
                this.setState({ data: result.data });
            } else {
                this.setState({
                    data: []
                })
            }
        })
    }

    handleSubmit() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan disimpan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const data_member = {
                        nama_member: this.state.nama,
                        no_telp: this.state.no_telp,
                        alamat: this.state.alamat,
                        no_ktp: this.state.no_ktp,
                        tipe_member: this.state.jenis_member,
                        kode_member: this.state.kode_member,
                        status_member: 'active',
                        email: this.state.email,
                        playing: this.state.playing
                    }

                    ipcRenderer.invoke("member", false, false, true, false, data_member, false, false).then((result) => {
                        if (result.response === true) {
                            toast.success("Member berhasil ditambah");
                            this.clearState();
                            this.getAllMember();
                        } else {
                            toast.error("Member gagal ditambah")
                        }
                    })
                }
            });

    }


    componentDidMount(): void {
        this.insertPrice('Premium');
        this.getAllMember();
    }

    handleSelected(selectedRow) {
        if (selectedRow.selectedCount !== 0) {
            const id_member = selectedRow.selectedRows[0].id_member
            this.setState({
                id_member: id_member, disabled_opsi: false, editable: true, nama: selectedRow.selectedRows[0].nama_member,
                no_telp: selectedRow.selectedRows[0].no_telp,
                email: selectedRow.selectedRows[0].email,
                alamat: selectedRow.selectedRows[0].alamat,
                jenis_member: selectedRow.selectedRows[0].tipe_member,
                no_ktp: selectedRow.selectedRows[0].no_ktp,
                kode_member: selectedRow.selectedRows[0].kode_member,
            })
        } else {
            this.setState({
                id_member: '', disabled_opsi: true, editable: false, nama: '',
                no_telp: 0,
                email: '',
                alamat: '',
                jenis_member: 'Premium',
                no_ktp: 0,
                kode_member: '',

            })
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
                    console.log(this.state.id_member);
                    ipcRenderer.invoke("member", false, false, false, true, this.state.id_member, false, false).then((result) => {
                        if (result.response === true) {
                            toast.success("Member berhasil dihapus");
                            this.clearState();
                            this.getAllMember();
                        } else {
                            toast.error("Member gagal dihapus");
                            this.clearState();
                            this.getAllMember();
                        }
                    })
                }
            });
    }

    handleEdit() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan diedit!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    console.log(this.state.id_member);
                    const data_member = {
                        kode_member: this.state.kode_member,
                        nama_member: this.state.nama,
                        no_telp: this.state.no_telp,
                        email: this.state.email,
                        no_ktp: this.state.no_ktp,
                        alamat: this.state.alamat,
                        tipe_member: this.state.jenis_member,
                        id_member: this.state.id_member,
                    }
                    ipcRenderer.invoke("member", false, false, false, false, data_member, true, false).then((result) => {
                        if (result.response === true) {
                            this.clearState();
                            this.getAllMember();
                            toast.success("Edit Member berhasil");
                        } else {
                            toast.error("Edit Member gagal");
                            this.clearState();
                            this.getAllMember();
                        }
                    })
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
                <div className="overview-pemb mb-3">
                    <div className="bg-dark box-dark">
                        <h5 className="text-center">{this.state.editable ? 'Edit Member' : 'Tambah Member'}</h5>

                        <div className="box-booking mt-3">
                            <div className="booking-content">
                                <div className="row">
                                    <div className="col-lg mb-2">
                                        <h5>Identitas</h5>

                                        <div className="form-group">
                                            <label htmlFor="usr">Nama lengkap</label>
                                            <input type="text" onChange={this.handleNama} value={this.state.nama} className="form-control custom-input" />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Nomor telepon</label>
                                            <input type="number" onChange={this.handleNoTelp} value={this.state.no_telp} className="form-control custom-input" />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Email</label>
                                            <input type="email" onChange={this.handleEmail} value={this.state.email} className="form-control custom-input" />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">Alamat Lengkap</label>
                                            <input type="text" onChange={this.handleAlamat} value={this.state.alamat} className="form-control custom-input" />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="usr">No. KTP</label>
                                            <input type="number" onChange={this.handleNoKtp} value={this.state.no_ktp} className="form-control custom-input" />
                                        </div>
                                    </div>
                                    <div className="col-lg">
                                        <div className="box-dark-really">
                                            <h5>Jenis Member</h5>
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <div className="radio-box-custom mb-2">
                                                        <div className="d-flex">
                                                            <div className="p-1">
                                                                <input type="radio" value={'Premium'} onChange={this.handleJenisMember} checked={this.state.jenis_member === "Premium"} className="radio-custom" />
                                                            </div>
                                                            <div className="p-1">
                                                                Premium
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="radio-box-custom mb-2">
                                                        <div className="d-flex">
                                                            <div className="p-1">
                                                                <input type="radio" value={'Gold'} onChange={this.handleJenisMember} checked={this.state.jenis_member === "Gold"} className="radio-custom" />
                                                            </div>
                                                            <div className="p-1">
                                                                Gold
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="radio-box-custom mb-2">
                                                        <div className="d-flex">
                                                            <div className="p-1">
                                                                <input type="radio" value={'Platinum'} onChange={this.handleJenisMember} checked={this.state.jenis_member === "Platinum"} className="radio-custom" />
                                                            </div>
                                                            <div className="p-1">
                                                                Platinum
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <h5>Total harga</h5>
                                                <div className="box-total-member">
                                                    <div className="d-flex">
                                                        <div className="p-1">
                                                            <img src="assets/img/icon/rp.png" alt="" />
                                                        </div>
                                                        <div className="p-1">
                                                            <p>Rp. {this.state.harga_member} Per bulan,</p>
                                                            <p>dengan Potongan sebesar {this.state.potongan}% & {this.state.playing}x kesempatan bermain.</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box-dark-really mt-3">
                                            <h5>Kode Member</h5>
                                            <div className="box-total-member">
                                                <b>{this.state.kode_member}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="text-end mt-3">
                            <button className="btn btn-primary btn-primary-cozy" onClick={this.state.editable ? this.handleEdit : this.handleSubmit} disabled={this.state.disabled}>{this.state.editable ? 'Edit Sekarang' : 'Buat Sekarang'}</button>

                        </div>
                    </div>

                </div>

                <div className="keuangan-list mb-5">
                    <div className="card card-custom-dark">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 me-auto">
                                    <h5>List Member</h5>
                                </div>
                                <div className="p-2">
                                    <button className="btn btn-danger me-3" onClick={this.handleDelete} disabled={this.state.disabled_opsi}>Hapus</button>
                                    {/* <button className="btn btn-info" onClick={this.handleEdit} disabled={this.state.disabled_opsi}>Edit</button> */}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <DataTable columns={this.state.columns} selectableRows expandableRows selectableRowsNoSelectAll selectableRowsSingle onSelectedRowsChange={this.handleSelected} expandableRowsComponent={ExpandableRowComponent} data={this.state.data} pagination theme="solarized" />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class Member_Container extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">

                    <Sidebar />
                    <div className="box-bg">
                        <Member />
                    </div>
                </div>
                <ModalUser />
            </>

        )
    }
}

export default Member_Container;