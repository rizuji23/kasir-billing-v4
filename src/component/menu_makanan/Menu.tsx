import React from "react";
import { Header, ModalUser } from '../header/header';
import Sidebar from "../sidebar/sidebar";
import { ipcRenderer, IpcRenderer } from "electron";
import DotAdded from "../../system/DotAdded";
import Loading from "../Loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import moment from "moment";
import 'moment-timezone';


class Menu extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_menu: [],
            data_ref: [],
            filter_ref: [],
            loading_menu: false,
            data_cart: [],
            total_harga: '',
            date_now: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            disabled: true,
            disabled_batal: true,
            type_pemesanan: 'Cafe Only',
            select_container: true,
            data_cafe: {

                uang_cash: '',
                kembalian: '',
            },
            text_submit: 'Pesan',
            user_in: sessionStorage.getItem('username'),
            data_table: {
                table_booking: ''
            },
            struk: false,
        }
        this.getMenu = this.getMenu.bind(this);
        this.handleTambahKeranjang = this.handleTambahKeranjang.bind(this);
        this.getCart = this.getCart.bind(this);
        this.handleDeleteCart = this.handleDeleteCart.bind(this);
        this.handleEditCart = this.handleEditCart.bind(this);
        this.handleTypePemesanan = this.handleTypePemesanan.bind(this);
        this.handleUangCash = this.handleUangCash.bind(this);
        this.validate = this.validate.bind(this);
        this.handleBatal = this.handleBatal.bind(this);
        this.handleSimpan = this.handleSimpan.bind(this);
        this.handleTable = this.handleTable.bind(this);
        this.searchMenu = this.searchMenu.bind(this);
    }

    componentDidMount(): void {
        this.getMenu();
        this.getCart();
    }

    clearState() {
        this.setState({
            loading_menu: false,
            data_cart: [],
            total_harga: '',
            date_now: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            disabled: true,
            disabled_batal: true,
            type_pemesanan: 'Cafe Only',
            select_container: true,
            data_cafe: {
                uang_cash: '',
                kembalian: '',
            },
            text_submit: 'Pesan',
            data_table: {
                table_booking: ''
            },
            filter_menu: [],
        })
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    validate() {
        this.setState({ text_submit: 'Checking data...' });
        setTimeout(() => {
            if (this.state.type_pemesanan === 'Cafe Only') {
                if (this.isObjectEmpty(this.state.data_cafe)) {
                    this.setState({ disabled: false, text_submit: 'Pesan' });
                } else {
                    this.setState({ disabled: true, text_submit: 'Pesan' });
                }
            } else if (this.state.type_pemesanan === 'With Table') {
                if (this.isObjectEmpty(this.state.data_table)) {
                    this.setState({ disabled: false, text_submit: 'Pesan' });
                } else {
                    this.setState({ disabled: true, text_submit: 'Pesan' });
                }
                console.log(this.state.data_table.table_booking)

            }
        }, 1000)
    }

    handleTable(e) {
        if (e.target.value.length === 0) {
            toast.error("Table harus diisi");
            this.setState(prevState => ({
                ...prevState.data_table,
                data_table: {
                    table_booking: '',
                }
            }))
        } else {
            this.setState(prevState => ({
                ...prevState.data_table,
                data_table: {
                    table_booking: e.target.value,
                }
            }))

            this.validate();
        }
    }

    handleDeleteCart(menu) {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    ipcRenderer.invoke("pesanan", false, false, false, true, false, false, false, menu.id_cart).then((result) => {
                        console.log(result);
                        if (result.response === true) {
                            this.getCart();
                        } else {
                            toast.error(`${menu.nama_menu} gagal dihapus`);
                            this.getCart();
                        }
                    })
                }
            });
    }

    handleEditCart(menu) {
        swal({
            text: "Masukan Qty untuk produk",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Qty",
                    type: "number",
                    value: menu.qty
                },
            },
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((value) => {
            if (value) {
                if (value === '0') {
                    swal("Gagal", "Masukan Qty lebih dari 1", "error");

                } else {
                    const total_new = menu.harga_menu * value;
                    const data_cart = {
                        qty: value,
                        sub_total: total_new,
                        user_in: this.state.user_in,
                        id_cart: menu.id_cart
                    }

                    ipcRenderer.invoke("pesanan", false, false, true, false, false, false, false, data_cart).then((result) => {
                        if (result.response === true) {
                            this.getCart();
                        } else {
                            toast.error(`${menu.nama_menu} gagal diedit`);
                            this.getCart();
                        }
                    });
                }

            } else {
                swal("Gagal", "Qty harus diisi", "error");

            }
        })
    }

    handleTambahKeranjang(menu) {
        const data_cart = {
            id_menu: menu.id_menu[0].id_menu,
            qty: 1,
            sub_total: menu.harga_menu,
            user_in: sessionStorage.getItem('username'),
        }
        console.log(data_cart);
        ipcRenderer.invoke("pesanan", false, true, false, false, false, false, false, data_cart).then((result) => {
            console.log(result);
            if (result.response === true) {
                this.getCart();
            } else {
                toast.error(`${menu.nama_menu} gagal ditambahkan ke keranjang`);
                this.getCart();
            }
        })
    }

    handleTypePemesanan(e) {
        if (e.target.value === '') {
            toast.error("Tipe Pemesanan Wajib Diisi");
            this.setState({
                type_pemesanan: '',
            })
            this.validate()
        } else {
            if (e.target.value === 'Cafe Only') {
                this.setState({
                    type_pemesanan: e.target.value,
                    select_container: true
                })

            } else if (e.target.value === 'With Table') {
                var data_;
                ipcRenderer.invoke("getActiveTable").then((result) => {
                    if (result.response === true) {
                        data_ = result.data.map((el, i) => {
                            return (
                                <option value={el.id_booking}>{el.nama_table}</option>
                            )
                        });
                        this.setState({
                            type_pemesanan: e.target.value,
                            select_container: <>
                                <div className="mt-2 label-custom mb-3">
                                    <label>Pilih Table</label>
                                    <select onChange={this.handleTable} className="form-control custom-input mt-2">
                                        <option value="">Pilih Table</option>
                                        {data_}
                                    </select>
                                </div>
                            </>
                        })

                    } else {
                        toast.error("Table tidak ada yang aktif");
                    }
                });
            }
            this.validate()
        }
    }

    handleUangCash(e) {
        if (e.target.value.length === 0) {
            toast.error("Uang Cash wajib diisi");
            this.setState(prevState => ({
                ...prevState.data_cafe,
                data_cafe: {
                    uang_cash: '',
                    kembalian: ''
                }
            }));
            this.validate()

        } else {

            const dot = new DotAdded();
            const kembalian = dot.decode(e.target.value) - dot.decode(this.state.total_harga)

            if (dot.isNegative(kembalian)) {
                this.setState(prevState => ({
                    ...prevState.data_cafe,
                    data_cafe: {
                        uang_cash: dot.parse(e.target.value),
                        kembalian: ''
                    }
                }))
            } else {
                this.setState(prevState => ({
                    ...prevState.data_cafe,
                    data_cafe: {
                        uang_cash: dot.parse(e.target.value),
                        kembalian: dot.parse(kembalian)
                    }
                }))
            }
            this.validate()

        }
    }

    handleBatal() {
        swal({
            title: "Apa kamu yakin?",
            text: "Pesanan akan dibatalkan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    ipcRenderer.invoke("pesanan", false, false, false, false, true, false, false, []).then((result) => {
                        console.log(result);
                        if (result.response === true) {
                            toast.success("Pesanan berhasil dibatalkan");
                            this.clearState();
                        } else {
                            toast.error("Pesanan gagal dibatalkan");
                            this.clearState();
                        }
                    })
                }
            });

    }

    handleSimpan() {
        swal({
            title: "Apa kamu yakin?",
            text: "Pesanan tidak bisa dibatalkan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const dot = new DotAdded();
                const shift_pagi = JSON.parse(localStorage.getItem("shift_pagi"));
                const shift_malam = JSON.parse(localStorage.getItem("shift_malam"));

                const hours = moment().tz("Asia/Jakarta").format("HH");
                var shift_now = "";

                if (hours >= shift_pagi.start_jam.split(':')[0] && hours < shift_pagi.end_jam.split(':')[0]) {
                    shift_now = "pagi";
                    console.log("PAGI")
                } else if (hours >= shift_malam.start_jam.split(':')[0] || hours < shift_malam.end_jam.split(':')[0]) {
                    shift_now = "malam";
                    console.log("MALAM")
                }

                this.setState({
                    struk: true,
                })


                if (this.state.type_pemesanan === 'Cafe Only') {
                    const data_cart = {
                        total: dot.decode(this.state.total_harga),
                        uang_cash: dot.decode(this.state.data_cafe.uang_cash),
                        uang_kembalian: dot.decode(this.state.data_cafe.kembalian),
                        user_in: this.state.user_in,
                        shift: shift_now
                    }

                    ipcRenderer.invoke("pesanan", false, false, false, false, false, true, false, data_cart).then((result) => {
                        console.log(result);

                        if (result.response === true) {
                            toast.success("Pesanan berhasil dilakukan");
                            setTimeout(() => {
                                this.setState({
                                    struk: false,
                                })
                            }, 3000);
                            this.clearState();
                        } else {
                            toast.error("Pesanan gagal dilakukan");
                            this.clearState();
                        }
                    });
                } else if (this.state.type_pemesanan === 'With Table') {
                    const data_cart = {
                        total_harga: this.state.total_harga,
                        id_booking: this.state.data_table.table_booking,
                        user_id: this.state.user_in,
                        shift: shift_now
                    }

                    ipcRenderer.invoke("pesanan", false, false, false, false, false, false, true, data_cart).then((result) => {
                        console.log(result);

                        if (result.response === true) {
                            toast.success("Pesanan berhasil dilakukan");
                            this.clearState();
                        } else {
                            toast.error("Pesanan gagal dilakukan");
                            this.clearState();
                        }
                    });
                }

            }
        });
    }

    getMenu() {
        ipcRenderer.invoke("menu", true, false, false, false, []).then((result) => {
            this.setState({ loading_menu: true })
            if (result.response === true) {
                const dot = new DotAdded();
                result.data.sort((a, b) => a.nama_menu.toLowerCase().localeCompare(b.nama_menu.toLowerCase()))
                const data_ = result.data.map((el, i) => {
                    return (
                        <>
                            <div className="col" key={el.toString()} onClick={() => this.handleTambahKeranjang(el)}>
                                <div className="card card-custom-dark h-100 card-table">
                                    <div className="menu-img">
                                        <img src={`assets/img/menu/${el.img_file}`} className="img-menu" alt="..." />
                                    </div>
                                    <div className="card-body">
                                        <div className="container-biliiard">
                                            <span className="badge rounded-pill text-bg-light mb-2">{el.kategori_menu[0].nama_kategori}</span>
                                            <h4>{el.nama_menu}</h4>
                                            <div className="d-flex mt-1">
                                                <div className="p-1">
                                                    <img src="assets/img/icon/rp_2.png" alt="" />
                                                </div>
                                                <div className="p-1">
                                                    <p>Rp. {dot.parse(el.harga_menu)}</p>
                                                </div>
                                            </div>

                                            {/* <div className="d-grid mt-2">
                                                <button className="btn btn-primary btn-primary-cozy btn-menu" onClick={() => this.handleTambahKeranjang(el)}>Tambah</button>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                });
                this.setState({ data_menu: data_, loading_menu: false, filter_ref: data_, data_ref: result.data });
            }
        })
    }

    getCart() {
        ipcRenderer.invoke("pesanan", true, false, false, false, false, false, false, []).then((result) => {
            if (result.response === true) {
                const data_ = result.data.map((el, i) => {
                    return (
                        <>
                            <div className="list-item-menu-content">
                                <div className="row">
                                    <div className="col-sm">
                                        <div className="d-flex">
                                            <div className="p-1">
                                                <div className="img-item">
                                                    <img src={`assets/img/menu/${el.img_file}`} alt="" />
                                                </div>
                                            </div>
                                            <div className="p-1">
                                                <div className="sub-item-text">
                                                    <h5>{el.nama_menu}</h5>
                                                    <div className="d-flex">
                                                        <div className="p-1">
                                                            <img src="assets/img/icon/rp_2.png" alt="" />
                                                        </div>
                                                        <div className="p-1">
                                                            <p>Rp. {new DotAdded().parse(el.sub_total)}</p>
                                                            <p>Qty: {el.qty}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="d-flex flex-row-reverse">
                                            <div className="p-1">
                                                <button
                                                    className="btn btn-primary btn-primary-cozy btn-cozy-danger" onClick={() => this.handleDeleteCart(el)}><img
                                                        src="assets/img/icon/trash-2.png" alt="" /></button>
                                            </div>
                                            <div className="p-1">
                                                <button
                                                    className="btn btn-primary btn-primary-cozy btn-cozy-warning" data-bs-toggle="modal"
                                                    data-bs-target="#edit_keranjang" onClick={() => this.handleEditCart(el)}><img
                                                        src="assets/img/icon/edit-2.png" alt="" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                });

                const total_harga = result.data.reduce((total, arr) => {
                    return total + arr.sub_total;
                }, 0);

                this.setState(prevState => ({
                    data_cafe: {
                        ...prevState.data_cafe,
                        uang_cash: '',
                        kembalian: ''
                    },
                    data_cart: data_,
                    total_harga: new DotAdded().parse(total_harga),
                    disabled_batal: false
                }));

            } else {
                this.setState(prevState => ({
                    ...prevState.data_cafe,
                    data_cafe: {
                        uang_cash: '',
                        kembalian: ''
                    },
                    data_cart: [],
                    total_harga: 0,
                    disabled_batal: true
                }));
            }
        })
    }

    searchMenu(e) {
        if (e.target.value.length === 0) {
            this.setState({
                filter_ref: this.state.data_menu,
            })
        } else {
            const dot = new DotAdded();
            const data = this.state.data_ref;
            const filter = data.filter(el => el.nama_menu.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0);
            const data_f = filter.map(el => {
                return (
                    <>
                        <div className="col" key={el.toString()}>
                            <div className="card card-custom-dark h-100 card-table">
                                <div className="menu-img">
                                    <img src={`assets/img/menu/${el.img_file}`} className="img-menu" alt="..." />
                                </div>
                                <div className="card-body">
                                    <div className="container-biliiard">
                                        <span className="badge rounded-pill text-bg-light mb-2">{el.kategori_menu[0].nama_kategori}</span>
                                        <h4>{el.nama_menu}</h4>
                                        <div className="d-flex mt-2">
                                            <div className="p-1">
                                                <img src="assets/img/icon/rp_2.png" alt="" />
                                            </div>
                                            <div className="p-1">
                                                <p>Rp. {dot.parse(el.harga_menu)}</p>
                                            </div>
                                        </div>

                                        <div className="d-grid mt-2">
                                            <button className="btn btn-primary btn-primary-cozy btn-menu" onClick={() => this.handleTambahKeranjang(el)}>Tambah</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            })
            this.setState({
                filter_ref: data_f
            })
        }
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
                <Loading title={"Loading Menu..."} loading={this.state.loading_menu} />
                <div className="d-flex">
                    <div className="title-header-box me-auto">
                        <h3>Menu</h3>
                    </div>
                    <div className="p-1">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" onChange={this.searchMenu} placeholder="Cari Menu" autoFocus={true} aria-label="Recipient's username" aria-describedby="button-addon2" />

                        </div>
                    </div>
                </div>
                <div className="row g-2">
                    <div className="col-md">
                        <div className="overflow-menu">
                            <div className="row row-cols-1 row-cols-md-3 g-3" id="menu-list">
                                {this.state.filter_ref}
                            </div>
                        </div>

                    </div>
                    <div className="col-md">
                        <div className="keuangan-list">
                            <div className="bg-dark box-dark mb-3">
                                <h5 className="text-center">Detail Pesanan</h5>
                                <div className="box-booking">
                                    <div className="booking-content">
                                        <div className="row">
                                            <div className="">
                                                <h5>Ringkasan item pesanan:</h5>
                                                <div className="overflow-checkout" id="list_keranjang">
                                                    <div className="list-item-menu">
                                                        {this.state.data_cart}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="box-check-total-content">
                                                    <h4>Detail Pembayaran:</h4>
                                                    <small>Tanggal Pembelian: <span>{this.state.date_now}</span></small>
                                                    {/* <div className="mt-2 label-custom mb-3">
                                                        <label>Pilih Tipe Pemesanan</label>
                                                        <select className="form-control custom-input mt-2" onChange={this.handleTypePemesanan}>
                                                            <option value="">Pilih Pemesanan</option>
                                                            <option value="Cafe Only">Cafe Only</option>
                                                            <option value="With Table">With Table</option>
                                                        </select>
                                                    </div> */}
                                                    <div className="hr-white"></div>
                                                    {this.state.select_container === true ?
                                                        <>
                                                            <div className="box-kembalian mb-3">
                                                                <label style={{ 'color': '#fff' }}>Uang Cash</label>
                                                                <div className="input-group mt-2">
                                                                    <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                                                    <input type="text" className="form-control group-input-custom" aria-label="Sizing example input" id="uang_cash_cafe" aria-describedby="inputGroup-sizing-default" onChange={this.handleUangCash} value={this.state.data_cafe.uang_cash} />
                                                                </div>
                                                            </div>

                                                            <div className="total-all mb-3 mt-3">
                                                                <h6>Kembalian: </h6>
                                                                <h4>Rp. <span id="kembalian_cafe">{this.state.data_cafe.kembalian}</span></h4>
                                                            </div>
                                                        </> : this.state.select_container}

                                                    <div className="hr-white"></div>
                                                    <div className="total-all">
                                                        <h6>Total Harga: </h6>
                                                        <h4>Rp. {this.state.total_harga}</h4>
                                                    </div>
                                                    {this.state.struk && <div className="d-flex align-items-center mt-3 mb-3">
                                                        <strong className="text-info">Sedang Mencetak Struk...</strong>
                                                        <div className="spinner-border text-info ms-auto" role="status" aria-hidden="true"></div>
                                                    </div>}
                                                    <div className="d-grid mt-2">
                                                        <button className="btn btn-primary btn-primary-cozy" onClick={this.handleSimpan} disabled={this.state.disabled} id="checkout_cart">{this.state.text_submit}</button>
                                                    </div>
                                                    <div className="d-grid mt-2">
                                                        <button className="btn btn-primary btn-primary-cozy-dark" disabled={this.state.disabled_batal} onClick={this.handleBatal} id="batal_cart">Batal</button>
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


            </>
        )
    }

}

class Menu_Container extends React.Component<any, any> {
    render() {
        return (
            <>
                <div id="body-pd" className="body-pd">

                    <Sidebar />
                    <div className="box-bg">
                        <Menu />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default Menu_Container;