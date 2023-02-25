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

class ModalCheckPay extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data_check,
            list_billing: [],
            list_menu: [],
            total_billing: 0,
            total_menu: 0,
            total_all: 0,
            loading: false,
        }

        this.getList = this.getList.bind(this);
        this.handleProsesPay = this.handleProsesPay.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.props.data_check !== prevProps.data_check) {
            this.setState({
                data: this.props.data_check
            }, () => {
                console.log("UPDATE", this.state.data)
                this.getList();
            })
        }
    }

    getList() {
        const dot = new DotAdded();
        const list_billing = this.state.data.data.data_billing.map(el => {
            return (
                <>
                    <li>{el.start_duration} = Rp. {dot.parse(el.harga)}</li>
                </>
            )
        });
        var list_menu;
        var total_menu = 0;

        if (this.state.data.data.data_menu !== undefined) {
            list_menu = this.state.data.data.data_menu.map(el => {
                return (
                    <>
                        <li>{el.nama_menu} @{el.qty} {dot.parse(el.harga_menu)} = Rp. {dot.parse(el.sub_total)}</li>
                    </>
                )
            });

            total_menu = this.state.data.data.data_menu.reduce((total, arr) => {
                return total + arr.sub_total;
            }, 0);

        } else {
            list_menu = <><li>Menu tidak ada...</li></>
            total_menu = 0;
        }

        const total_billing = this.state.data.data.data_billing.reduce((total, arr) => {
            return total + arr.harga;
        }, 0);

        const total_all = total_billing + total_menu;

        this.setState({
            list_billing: list_billing,
            list_menu: list_menu,
            total_billing: total_billing,
            total_menu: total_menu,
            total_all: total_all,
        });
    }

    handleProsesPay() {
        swal({
            title: "Apa kamu yakin?",
            text: "Pembayaran akan dilanjutkan dan tidak akan bisa di kembalikan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                this.setState({
                    loading: true,
                })
                const data_pay = {
                    id_table: this.state.data?.data_pay?.table_id,
                    id_booking: this.state.data?.data_pay?.id_booking,
                    id_pesanan: this.state.data?.data_pay?.id_pesanan,
                    uang_cash: this.state.data?.data_pay?.uang_cash,
                    kembalian: this.state.data?.data_pay?.kembalian,
                    type_booking: this.state.data?.data_pay?.mode,
                }

                ipcRenderer.invoke("sendPayNow", data_pay).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Pembayaran berhasil");
                        if (this.props.mode === 'Regular') {
                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                })
                                this.props.stopTimer();

                                this.props.closeModal();
                            }, 3000)

                        } else if (this.props.mode === 'Loss') {
                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                })
                                this.props.stopTimerLoss();

                                this.props.closeModal();
                            }, 3000)
                        }
                    } else {
                        toast.success("Pembayaran gagal");
                    }
                })
            }
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenCheck}
                    keyboard={false}
                    onHide={this.props.closeCheck}
                    size="lg"
                    centered
                    backdrop="static"
                    contentClassName="border border-light"
                >

                    <Modal.Header closeButton className="pb-0">
                        <Modal.Title >Informasi Detail Pembayaran</Modal.Title>
                    </Modal.Header>
                    <hr />

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

                        <div className="alert alert-danger">
                            <span>Silahkan cek kembali detail harga dengan total harga.</span>
                        </div>

                        <ul className="list-group">
                            <li className="list-group-item"><small>Nama Customer</small><br /><b>{this.state.data?.data_pay?.nama}</b></li>
                            <li className="list-group-item">
                                <small>List Billing</small>
                                <br />
                                <ul>
                                    {this.state.list_billing}
                                </ul>
                            </li>
                            <li className="list-group-item">
                                <small>List Menu</small>
                                <br />
                                <ul>
                                    {this.state.list_menu}
                                </ul>
                            </li>
                            <li className="list-group-item"><small>Total Harga Menu</small><br /><b>Rp. {new DotAdded().parse(this.state.total_menu)}</b></li>
                            <li className="list-group-item"><small>Total Billing</small><br /><b>Rp. {new DotAdded().parse(this.state.total_billing)}</b></li>
                        </ul>

                        <div className="total-all mt-3">
                            <h6>Total Harga Semua: </h6>
                            <h4>Rp. <b id="total_struk_active">{new DotAdded().parse(this.state.total_all)}</b></h4>
                        </div>
                        <div className="total-all mt-3">
                            <h6>Uang Cash: </h6>
                            <h4>Rp. <b id="kembalian_struk_text">{this.state.data?.data_pay?.uang_cash}</b></h4>
                        </div>
                        <div className="total-all mt-3">
                            <h6>Kembalian: </h6>
                            <h4>Rp. <b id="kembalian_struk_text">{this.state.data?.data_pay?.kembalian}</b></h4>
                        </div>

                        {this.state.loading && <div className="d-flex align-items-center mt-3">
                            <strong className="text-info">Sedang mencetak struk, tunggu sebentar...</strong>
                            <div className="spinner-border text-info ms-auto" role="status" aria-hidden="true"></div>
                        </div>}
                    </Modal.Body>
                    <hr />
                    <Modal.Footer className="pt-0">
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeCheck} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" id="bayar_now" onClick={this.handleProsesPay}>Proses Pembayaran</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalCheckPay;