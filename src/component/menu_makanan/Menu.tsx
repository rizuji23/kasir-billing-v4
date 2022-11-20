import React from "react";
import { Header, ModalUser } from '../header/header';
import Sidebar from "../sidebar/sidebar";
import { ipcRenderer, IpcRenderer } from "electron";
import DotAdded from "../../system/DotAdded";
import Loading from "../Loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';

class Menu extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_menu: [],
            loading_menu: false,
            data_cart: [],
            total_harga: '',
        }
        this.getMenu = this.getMenu.bind(this);
        this.handleTambahKeranjang = this.handleTambahKeranjang.bind(this);
        this.getCart = this.getCart.bind(this);
        this.handleDeleteCart = this.handleDeleteCart.bind(this);
        this.handleEditCart = this.handleEditCart.bind(this);
    }

    componentDidMount(): void {
        this.getMenu();
        this.getCart();
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
                            toast.success(`${menu.nama_menu} berhasil dihapus`);
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
        console.log(menu)
        swal({
            text: "Masukan Qty Untuk Produk",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Masukan Qty",
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
                        user_in: sessionStorage.getItem('username'),
                        id_cart: menu.id_cart
                    }

                    ipcRenderer.invoke("pesanan", false, false, true, false, false, false, false, data_cart).then((result) => {
                        if (result.response === true) {
                            toast.success(`${menu.nama_menu} berhasil diedit`);
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
                toast.success(`${menu.nama_menu} berhasil ditambahkan ke keranjang`);
                this.getCart();
            } else {
                toast.error(`${menu.nama_menu} gagal ditambahkan ke keranjang`);
                this.getCart();
            }
        })
    }

    getMenu() {
        ipcRenderer.invoke("menu", true, false, false, false, []).then((result) => {
            this.setState({ loading_menu: true })
            if (result.response === true) {
                const dot = new DotAdded();
                const data_ = result.data.map((el, i) => {
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
                                                <button className="btn btn-primary btn-primary-cozy btn-menu" onClick={() => this.handleTambahKeranjang(el)}>Tambah Keranjang</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                });
                setTimeout(() => {
                    this.setState({ data_menu: data_, loading_menu: false });
                }, 1000)
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
                setTimeout(() => {
                    const total_harga = result.data.reduce((total, arr) => {
                        return total + arr.sub_total;
                    }, 0);
                    this.setState({ data_cart: data_, total_harga: new DotAdded().parse(total_harga) });
                }, 1000);
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
                <Loading title={"Loading Menu..."} loading={this.state.loading_menu} />
                <div className="title-header-box">
                    <h3>Menu</h3>
                </div>
                <div className="row">
                    <div className="col-md">
                        <div className="overflow-menu">
                            <div className="row row-cols-1 row-cols-md-3 g-4" id="menu-list">
                                {this.state.data_menu}
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
                                                    <small>Tanggal Pembelian: <span id="date_now"></span></small>
                                                    <div className="mt-2 label-custom mb-3">
                                                        <label>Pilih Table</label>
                                                        <select name="" className="form-control custom-input mt-2" id="table_cart">

                                                        </select>
                                                    </div>
                                                    <div className="hr-white"></div>
                                                    <div className="list-container-total" id="list-total-cart">
                                                    </div>
                                                    <div className="hr-white"></div>
                                                    <div className="total-all">
                                                        <h6>Total Harga: </h6>
                                                        <h4>Rp. {this.state.total_harga}</h4>
                                                    </div>
                                                    <input type="hidden" id="total_menu_val" />
                                                    <div className="d-grid mt-2">
                                                        <button className="btn btn-primary btn-primary-cozy" id="checkout_cart">Simpan</button>
                                                    </div>
                                                    <div className="d-grid mt-2">
                                                        <button className="btn btn-primary btn-primary-cozy-dark" id="batal_cart">Batal</button>
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
                    <Header />
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