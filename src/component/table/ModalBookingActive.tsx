import { ipcRenderer, session } from "electron";
import React from "react"
import DotAdded from "../../system/DotAdded";
import { Modal, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import ModalSplitBill from "./ModalSplitBill";
import SelectSearch from "react-select-search";
import 'react-select-search/style.css'
import LoadingButton from "../LoadingButton";
import { Dot } from "recharts";
import moment from "moment";
import 'moment-timezone';
import ModalChangeName from "./ModalChangeName";

class ModalBookingActive extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            harga_list: "",
            list_table: "",
            list_billing: "",
            start_time: "",
            list_menu: "",
            detail_pesanan: "",
            total_pesanan: "",
            total_all: 0,
            isOpen: false,
            total_billing: 0,
            data_split_billing: [],
            data_split_menu: [],
            disabled_split: true,
            text_split: 'Split Bill',
            isOpenSplit: false,
            id_pesanan: '',
            uang_cash: '',
            kembalian: 0,
            disabled_bayar: true,
            list_menu_cafe: "",
            list_menu_raw: "",
            disabled_menu: true,
            loading_menu: false,
            data_menu: {
                id_menu: "",
                qty: "",
                harga: "",
                sub_total: "",
            },
            isOpenChange: false,
            nama: this.props.name_customer,
        }

        this.getAllTable = this.getAllTable.bind(this);
        this.handleEditMenu = this.handleEditMenu.bind(this);
        this.handleDeleteMenu = this.handleDeleteMenu.bind(this);
        this.handleSplitBill = this.handleSplitBill.bind(this);
        this.handleCheckSplit = this.handleCheckSplit.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleUangCash = this.handleUangCash.bind(this);
        this.handlePayNow = this.handlePayNow.bind(this);
        this.getMenu = this.getMenu.bind(this);
        this.handleMenuCafe = this.handleMenuCafe.bind(this);
        this.handleQty = this.handleQty.bind(this);
        this.handlePesan = this.handlePesan.bind(this);
        this.clearState = this.clearState.bind(this);
        this.clearSplitBill = this.clearSplitBill.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.openChangeName = this.openChangeName.bind(this);
        this.closeChangeName = this.closeChangeName.bind(this);
        this.getCustomerName = this.getCustomerName.bind(this);
    }

    clearSplitBill() {
        this.setState({
            data_split_billing: [],
            data_split_menu: []
        })
    }

    clearState() {
        this.setState({
            disabled_menu: true,
            loading_menu: false,
            data_menu: {
                id_menu: "",
                qty: "",
                harga: "",
                sub_total: "",
            }
        })
    }

    getCustomerName() {
        ipcRenderer.invoke("getDataTable", this.props.table_id).then((result) => {
            console.log(result);
            if (result.response === true) {
                this.setState({
                    nama: result.data[0].nama_booking
                });
            } else {
                toast.error("Terjadi kesalahan (getCustomerName)")
            }
        });
    }

    getMenu() {
        ipcRenderer.invoke("menu", true, false, false, false, []).then((result) => {
            console.log(result);
            if (result.response === true) {
                const new_arr = Array<any>();
                result.data.map(el => {
                    new_arr.push({ name: el.nama_menu, value: `${el.id_menu[0].id_menu},${el.harga_menu}` })
                });

                console.log(new_arr)

                this.setState({
                    list_menu_cafe: new_arr,
                    list_menu_raw: <SelectSearch options={new_arr} placeholder={"Pilih Menu"} search onChange={this.handleMenuCafe} />,
                })
            }
        })
    }

    handleMenuCafe(e) {
        if (e.length === 0) {
            toast.error("Nama Menu harus diisi.");
            this.setState({
                disabled_menu: true,
            })
        } else {
            const split = e.split(',')
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    id_menu: split[0],
                    harga: split[1],
                }
            }))
        }
    }

    handleQty(e) {
        if (e.target.value.length === 0) {
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    qty: e.target.value,

                },
                disabled_menu: true,
            }))
            toast.error("Qty harus diisi.");
        } else {
            const sub_total = this.state.data_menu.harga * parseInt(e.target.value)
            console.log(sub_total)
            this.setState(prevState => ({
                data_menu: {
                    ...prevState.data_menu,
                    qty: e.target.value,
                    sub_total: sub_total,
                },
                disabled_menu: false,
            }))
        }
    }

    handlePesan() {
        swal({
            title: "Apa kamu yakin?",
            text: "Pesanan akan dilakukan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                this.setState({
                    loading_menu: true,
                    disabled_menu: true,
                })
                const data = {
                    id_menu: this.state.data_menu.id_menu,
                    qty: this.state.data_menu.qty,
                    sub_total: this.state.data_menu.sub_total,
                    user_in: sessionStorage.getItem("username"),
                }
                ipcRenderer.invoke("pesanan", false, true, false, false, false, false, false, data).then((result) => {
                    console.log(result);
                    if (result.response === true) {
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

                        const data_table = {
                            id_booking: this.props.id_booking,
                            total_harga: new DotAdded().parse(this.state.data_menu.sub_total),
                            user_id: sessionStorage.getItem("username"),
                            shift: shift_now,
                            cart: result.data,
                        }

                        ipcRenderer.invoke("pesanan", false, false, false, false, false, false, true, data_table).then((result) => {
                            if (result.response === true) {
                                toast.success("Menu sudah dipesan.");
                                this.setState({
                                    loading_menu: false,
                                });
                                this.getListBilling()
                                this.getAllTable()
                                this.getListMenuCafe()
                                this.clearState()
                            } else {
                                toast.error("Menu gagal dipesan.");
                                this.setState({
                                    loading_menu: false,
                                });
                                this.getListBilling()
                                this.getAllTable()
                                this.getListMenuCafe()
                                this.clearState()
                            }
                        })
                    }
                })
            }
        });

    }

    handleCheckSplit(data, e) {
        if (e.target.checked) {
            if (data.id_detail_booking) {
                if (this.state.data_split_billing.length !== 0) {
                    const checkForId = this.state.data_split_billing.map(el => {
                        return el.id_detail_booking
                    }).includes(data.id_detail_booking);

                    if (!checkForId) {
                        this.setState({
                            data_split_billing: this.state.data_split_billing.concat(data),
                        })
                    }

                } else {
                    this.setState({
                        data_split_billing: this.state.data_split_billing.concat(data),
                    })
                }


            } else {
                if (this.state.data_split_menu.length !== 0) {
                    const checkForId = this.state.data_split_menu.map(el => {
                        return el.id_cart
                    }).includes(data.id_cart);

                    if (!checkForId) {
                        this.setState({
                            data_split_menu: this.state.data_split_menu.concat(data),
                        })
                    }

                } else {
                    this.setState({
                        data_split_menu: this.state.data_split_menu.concat(data),
                    })
                }
            }
        } else {
            const removeElement = (arr, i) => [...arr.slice(0, i), ...arr.slice(i + 1)];

            if (data.id_detail_booking) {
                const removeItemArr = this.state.data_split_billing.findIndex((el) => {
                    return el.id_detail_booking === data.id_detail_booking;
                });

                if (removeItemArr !== -1) {
                    this.setState({
                        data_split_billing: removeElement(this.state.data_split_billing, removeItemArr),
                    })
                }

            } else {
                const removeItemArr = this.state.data_split_menu.findIndex((el) => {
                    return el.id_cart === data.id_cart;
                });

                if (removeItemArr !== -1) {
                    this.setState({
                        data_split_menu: removeElement(this.state.data_split_menu, removeItemArr),
                    })
                }
            }
        }

        this.setState({
            text_split: 'Checking data...'
        })

        setTimeout(() => {
            if (this.validate_split(this.state.data_split_billing, this.state.data_split_menu)) {
                this.setState({
                    disabled_split: false,
                    text_split: 'Split Bill'

                });
            } else {
                this.setState({
                    disabled_split: true,
                    text_split: 'Split Bill'

                });
            }
        }, 1000)
    }

    validate_split(arr_bill, arr_menu) {
        if (arr_bill.length === 0 && arr_menu.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    handleSplitBill() {
        this.openModal();
        console.log(this.state.data_split_billing);
        console.log(this.state.data_split_menu);
    }

    handleEditMenu(menu) {
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

                    const total_new = menu.harga_menu * value;
                    const data_cart = {
                        qty: value,
                        sub_total: total_new,
                        user_in: this.state.user_in,
                        id_cart: menu.id_cart,
                        id_booking: this.props.id_booking,
                        shift: shift_now,
                    }

                    ipcRenderer.invoke("pesanan_edit", true, false, data_cart).then((result) => {
                        if (result.response === true) {
                            toast.success(`${menu.nama_menu} berhasil diedit`);
                            this.getListBilling()
                            this.getAllTable()
                            this.getListMenuCafe()
                        } else {
                            toast.error(`${menu.nama_menu} gagal diedit`);
                            this.getListBilling()
                            this.getAllTable()
                            this.getListMenuCafe()
                        }
                    });
                }

            } else {
                swal("Gagal", "Qty harus diisi", "error");

            }
        })
    }

    handleDeleteMenu(menu) {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        })
            .then((willDelete) => {
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

                const data_cart = {
                    user_in: this.state.user_in,
                    id_cart: menu.id_cart,
                    id_booking: this.props.id_booking,
                    shift: shift_now,
                }

                if (willDelete) {
                    ipcRenderer.invoke("pesanan_edit", false, true, data_cart).then((result) => {
                        console.log(result);
                        if (result.response === true) {
                            toast.success(`${menu.nama_menu} berhasil dihapus`);
                            this.getListBilling()
                            this.getAllTable()
                            this.getListMenuCafe()
                        } else {
                            toast.error(`${menu.nama_menu} gagal dihapus`);
                            this.getListBilling()
                            this.getAllTable()
                            this.getListMenuCafe()
                        }
                    })
                }
            });
    }

    getHargaList() {
        const listItems = this.props.harga_detail.map((number) =>
            <li>{number.tipe} = {number.harga}</li>
        );

        this.setState({ harga_list: listItems })
    }

    getListBilling() {
        const dot = new DotAdded();
        if (this.state.id_booking !== '') {
            ipcRenderer.invoke("getDetailPriceBill", this.props.id_booking).then((result) => {
                const data_ = result.data.map((el, i) => {
                    return (
                        <>
                            <div className="mb-3 form-check">
                                {el.status === 'active' ? <input type="checkbox" onClick={(e) => this.handleCheckSplit(el, e)} className="form-check-input" /> : ''}
                                <label className="form-check-label">
                                    {el.end_duration} = Rp. {dot.parse(el.harga)} {el.status === 'active' ? <span className="badge rounded-pill text-bg-danger">Belum Dibayar</span> : <span className="badge rounded-pill text-bg-success">Sudah Dibayar</span>}
                                </label>
                            </div>
                        </>
                    )
                });

                const arr_bill_not_lunas = result.data.filter(item => !item.status.includes('lunas'));
                console.log(arr_bill_not_lunas)
                const sum_ = arr_bill_not_lunas.reduce((total, arr) => {
                    return total + arr.harga
                }, 0);

                this.setState({ list_billing: data_, start_time: result.data[0].created_at, total_billing: dot.parse(sum_) });

            })
        }
    }

    getListMenuCafe() {
        const dot = new DotAdded();
        if (this.state.id_booking !== '') {
            ipcRenderer.invoke("getCafeDetail", this.props.id_booking).then((result) => {
                if (result.response === true) {
                    const data_ = result.data_cafe.map((el, i) => {
                        return (
                            <>
                                <div className="mb-3 form-check">
                                    {
                                        el.status === 'belum dibayar' ? <input type="checkbox" onClick={(e) => this.handleCheckSplit(el, e)} className="form-check-input" /> : ''
                                    }

                                    <label className="form-check-label">{el.nama_menu} @{el.qty} = Rp. {dot.parse(el.sub_total)}
                                        {
                                            el.status === 'belum dibayar' ? <> (<a href="javascript:void(0)" onClick={() => this.handleEditMenu(el)} className="text-info">Edit</a> | <a className="text-danger" onClick={() => this.handleDeleteMenu(el)} href="javascript:void(0)">Delete</a>) <span className="badge rounded-pill text-bg-danger">Belum Dibayar</span></> : <> <span className="badge rounded-pill text-bg-success">Sudah Dibayar</span></>
                                        }</label>
                                </div>
                            </>
                        )
                    });
                    console.log(result)
                    this.setState({
                        list_menu: data_,
                        total_pesanan: result.data_cafe.length === 0 ? 0 : dot.parse(result.data_pesanan[0].total),
                        total_all: dot.parse(result.data_struk[0].total_struk),
                        id_pesanan: result.data_cafe.length === 0 ? '' : result.data_pesanan[0].id_pesanan
                    });
                } else {
                    this.setState({
                        list_menu: [],
                        total_pesanan: 0,
                        total_all: 0,
                        id_pesanan: '',
                    });
                }
            })
        }
    }

    componentDidMount(): void {
        this.getListBilling()
        this.getAllTable()
        this.getListMenuCafe()
        this.getMenu()
        this.getCustomerName()
    }

    getAllTable(): void {
        ipcRenderer.invoke("getAllTable", false).then((result) => {

            const data_ = result.data.map((el, i) => {
                return (
                    <>
                        <option value={el.id_table}>{el.nama_table}</option>
                    </>
                )
            })
            // var data_list = '';
            // result.data.forEach(element => {
            //     data_list += `<option value='${element.id_table}'>${element.nama_table}</option>`;
            // });

            this.setState({
                list_table: data_
            })
        });
    }

    componentDidUpdate(prevProps, prevState): void {
        // if (this.props.close === prevProps.close) {
        //     this.close()
        // }

        if (this.props.harga_detail !== prevProps.harga_detail) {
            this.getListBilling();
            this.getListMenuCafe();
        }

        if (this.props.isOpen !== prevProps.isOpen) {
            this.getListBilling();
            this.getListMenuCafe();
        }

        if (this.props.total_harga !== prevProps.total_harga) {
            this.getListBilling();
        }

        if (this.state.total_all !== prevState.total_all) {
            this.getListMenuCafe();
        }

        if (this.state.isOpenSplit !== prevState.isOpenSplit) {
            this.getListBilling();
            this.getListMenuCafe();
            console.log("CLOSEDDD")
        }
    }

    openModal(): any {
        this.setState({ isOpenSplit: true });
    }

    closeModal() {
        this.setState({ isOpenSplit: false, disabled_split: true });
    }

    handleUangCash(e) {
        if (e.target.value.length === 0) {
            toast.error("Uang Cash wajib diisi");
            this.setState({
                uang_cash: '',
                kembalian: 0,
                disabled_bayar: true,
            });
        } else {
            const dot = new DotAdded();
            this.setState({
                uang_cash: dot.parse(e.target.value),
            });
            const kembalian = dot.decode(e.target.value) - dot.decode(this.state.total_all);
            console.log(kembalian)
            if (!dot.isNegative(kembalian)) {
                this.setState({
                    kembalian: dot.parse(kembalian),
                    disabled_bayar: false,
                });
            } else {
                this.setState({
                    kembalian: 0,
                    disabled_bayar: true,
                });
            }

        }
    }

    handlePayNow() {
        swal({
            title: "Apa kamu yakin?",
            text: "Pembayaran akan dilanjutkan dan tidak akan bisa di kembalikan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data_pay = {
                    id_table: this.props.table_id,
                    id_booking: this.props.id_booking,
                    id_pesanan: this.state.id_pesanan,
                    uang_cash: this.state.uang_cash,
                    kembalian: this.state.kembalian,
                    type_booking: this.props.mode,
                }

                ipcRenderer.invoke("sendPayNow", data_pay).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Pembayaran berhasil");
                        if (this.props.mode === 'Regular') {
                            this.props.stopTimer();
                            this.props.closeModal();

                        } else if (this.props.mode === 'Loss') {
                            this.props.stopTimerLoss();
                            this.props.closeModal();
                        }
                    } else {
                        toast.success("Pembayaran gagal");
                    }
                })
            }
        });
    }

    openChangeName() {
        this.setState({
            isOpenChange: true,
        });
    }

    closeChangeName() {
        this.setState({
            isOpenChange: false,
        })
    }

    handleChangeName() {
        swal({
            text: "Masukan nama customer",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Nama Customer",
                    type: "text",
                    value: this.props.name_customer
                },
            },
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((value) => {
            if (value) {
                if (value.length === 0) {
                    swal("Gagal", "Nama tidak boleh kosong", "error");
                } else {
                    const data = {
                        nama: value,
                        id_booking: this.props.id_booking,
                    }

                    ipcRenderer.invoke("changeName", data).then((result) => {
                        console.log(result);
                        if (result.response === true) {
                            toast.success("Nama Customer berhasil diubah.");
                            this.getListBilling()
                            this.getAllTable()
                            this.getListMenuCafe()
                            this.getMenu()
                        } else {
                            toast.error("Nama Customer gagal diubah.");
                        }
                    })
                }
            }
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpen}
                    keyboard={false}
                    onHide={this.props.closeModal}
                    size="xl"
                    fullscreen
                >

                    <Modal.Header closeButton>
                        <Modal.Title>Penambahan Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                        <div className="row">
                            <div className="col-sm">
                                <div className="box-booking h-100">
                                    <div className="booking-content">
                                        <h5>Setting Table</h5>
                                        <div className="hr-white"></div>
                                        <label className="label-white mb-2" >Table terpilih</label>
                                        <div className="detail-table">
                                            <p><img src="assets/img/icon/archive.png" alt="" /><span
                                                id="table_ids_active"> {this.props.table_name}</span>
                                            </p>
                                        </div>
                                        <div className="d-flex">
                                            <div className="p-1">
                                                <div className="mt-2">
                                                    <div>
                                                        <button id="reset_table" onClick={this.props.resetTable} className="btn btn-warning btn-sm">Reset Table</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-1">
                                                <div className="mt-2">
                                                    <div>
                                                        <button id="print_struk_billing" className="btn btn-info btn-sm">Print Struk
                                                            Billing</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-1">
                                                <div className="mt-2">
                                                    <div>
                                                        <button onClick={this.props.continueTimer} className="btn btn-success btn-sm">Continue Timer</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-1">
                                                <div className="mt-2">
                                                    <div>
                                                        <button onClick={this.props.continueTimer} className="btn btn-primary btn-sm">Turn On</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-1">
                                                <div className="mt-2">
                                                    <div>
                                                        <button onClick={this.props.continueTimer} className="btn btn-danger btn-sm">Turn Off</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="mt-2">Pindah Table</h5>
                                        <div className="hr-white"></div>
                                        <div className="mt-2">
                                            <label >Pilih Meja</label>
                                            <select name="" onChange={this.props.handlePindah} className="form-control custom-input" id="pilih_meja">
                                                <option value="">Pilih Meja</option>
                                                {this.state.list_table}
                                            </select>
                                        </div>
                                        <div className="mt-2  text-end">
                                            <div className="">
                                                <button id="pindah_meja_btn" className="btn btn-primary btn-primary-cozy" onClick={this.props.handlePindahTable}>Pindah
                                                    Meja</button>
                                            </div>
                                        </div>
                                        <h5 className="mt-2">Cafe</h5>
                                        <div className="hr-white"></div>
                                        <div className="mt-2">
                                            <label >Menu</label>
                                            {this.state.list_menu_raw}
                                        </div>
                                        <div className="mt-2">
                                            <label >Qty</label>
                                            <input type="number" value={this.state.data_menu.qty} className="form-control custom-input" onChange={this.handleQty} />
                                        </div>
                                        <div className="mt-2  text-end">
                                            <div className="">
                                                <button id="pindah_meja_btn" className="btn btn-primary btn-primary-cozy" onClick={this.handlePesan} disabled={this.state.disabled_menu}>
                                                    <LoadingButton loading={this.state.loading_menu} />
                                                    Pesan
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm">
                                <div className="box-booking h-100">
                                    <div className="booking-content">
                                        <h5>Tambah Durasi Table</h5>
                                        <div className="hr-white"></div>
                                        {this.props.time_running ? <Alert key={'danger'} variant={'danger'}>Penambahan Durasi hanya bisa saat <strong>Waktu</strong> sudah habis!.</Alert> : ''}
                                        <label className="label-white mb-2 mt-3">Tambah Durasi penyewaan
                                        </label><br />
                                        <label className="label-white-regular mb-1">Durasi (Per jam)</label>
                                        <div id="peringatan">

                                        </div>

                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id="inputGroup-sizing-default"><img
                                                src="assets/img/icon/clock2.png" width="20" alt="" /></span>
                                            <input type="number" onChange={this.props.handleJam} className="form-control group-input-custom"
                                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                id="durasi_booking_active" disabled={this.props.time_running} />
                                        </div>
                                        <label className="label-white mb-2">Detail harga</label>

                                        <div className="detail-table  mb-3">
                                            <ul dangerouslySetInnerHTML={{ __html: this.props.harga_detail }}>
                                            </ul>
                                        </div>
                                        <label className="label-white mb-2">Total harga</label>
                                        <div className="detail-table">
                                            <p><img src="assets/img/icon/rp.png" alt="" /> <span
                                                id="harga_total_text"> {this.props.total_harga_add}</span>
                                            </p>
                                            <p className="mt-3"><img src="assets/img/icon/clock.png" width="25" alt="" /> <span
                                                id="durasi_total_text">{this.props.jam} Jam</span></p>
                                        </div>
                                        <input type="hidden" id="harga_booking_active" />
                                        <div className="form-group-2 mt-4">
                                            <select name="" className="form-control custom-input" id="input_setting_blink_active" disabled={this.props.time_running}>
                                                <option value="">Pilih Setting Blink</option>
                                                <option value="Iya">Iya</option>
                                                <option value="Tidak">Tidak</option>
                                            </select>
                                        </div>
                                        <div className="text-end mt-2">
                                            <button className="btn btn-primary btn-primary-cozy" id="add_on_send" onClick={this.props.addOn} disabled={this.props.disabled_add}>
                                                <LoadingButton loading={this.props.loading_addon} />
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm">
                                <div className="box-booking h-100">
                                    <div className="booking-content">
                                        <h5>Detail Pesanan</h5>
                                        <div className="hr-white"></div>
                                        <p>Tanggal Mulai: <span id="jam_mulai_active">{this.state.start_time}</span></p>
                                        <ul className="list-group" id="detail_struk_table">
                                            <li className="list-group-item"><small>Nama Pemesan</small> <br /><span
                                                id="nama_pemesan_active"></span> {this.state.nama} ({this.props.id_booking}) | <a href="javascript:void(0)" onClick={this.openChangeName}>Edit</a></li>
                                            <li className="list-group-item"><small>List Billing</small> <br />
                                                <ul>
                                                    <div id="list_billing">{this.state.list_billing}</div>

                                                </ul>
                                            </li>

                                            <li className="list-group-item">
                                                <small>List Menu</small> <br />
                                                <ul>
                                                    {this.state.list_menu}
                                                </ul>
                                            </li>

                                            <li className="list-group-item">
                                                <small>Total Harga Menu:</small><br />
                                                Rp. {this.state.total_pesanan}
                                            </li>
                                            <li className="list-group-item">
                                                <small>Total Billing:</small><br />
                                                Rp. {this.state.total_billing}
                                            </li>
                                        </ul>
                                        <div className="mt-2 float-end">
                                            <button className="btn btn-primary btn-primary-cozy btn-sm" disabled={this.state.disabled_split} onClick={this.handleSplitBill}>{this.state.text_split}</button>
                                        </div>
                                        <div className="total-all mt-3">
                                            <h6>Total Harga Semua: </h6>
                                            <h4>Rp. <span id="total_struk_active">{this.state.total_all}</span></h4>
                                        </div>
                                        <div className="box-kembalian mb-3">
                                            <label >Uang Cash</label>
                                            <div className="input-group mt-2">
                                                <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                                <input type="text" value={this.state.uang_cash} onChange={this.handleUangCash} className="form-control group-input-custom"
                                                    aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                    id="uang_cash_active" />
                                            </div>
                                        </div>
                                        <div className="total-all">
                                            <h6>Kembalian: </h6>
                                            <h4>Rp. <span id="kembalian_struk_text">{this.state.kembalian}</span></h4>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.state.disabled_bayar} onClick={this.handlePayNow} id="bayar_now">Bayar Sekarang</button>
                    </Modal.Footer>
                </Modal>
                {/* <div className="modal-backdrop fade show"></div> */}
                <ModalSplitBill isOpenSplit={this.state.isOpenSplit} closeModalSplit={this.closeModal} data_split_billing={this.state.data_split_billing} data_split_menu={this.state.data_split_menu} id_booking={this.props.id_booking} id_pesanan={this.state.id_pesanan} clearSplitBill={this.clearSplitBill} />
                <ModalChangeName isOpenChange={this.state.isOpenChange} closeChangeName={this.closeChangeName} id_booking={this.props.id_booking} nama={this.state.nama} getCustomerName={this.getCustomerName} />
            </>
        )
    }
}

export default ModalBookingActive;