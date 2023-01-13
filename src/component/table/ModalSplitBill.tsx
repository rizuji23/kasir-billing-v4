import React from "react";
import { Modal } from 'react-bootstrap';
import DotAdded from "../../system/DotAdded";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { ipcRenderer } from "electron";


class ModalSplitBill extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_split_billing: '',
            data_split_menu: '',
            total_all: 0,
            nama: '',
            disabled: true,
        }

        this.handleNama = this.handleNama.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleBayar = this.handleBayar.bind(this);
    }

    clearState() {
        this.setState({
            data_split_billing: '',
            data_split_menu: '',
            total_all: 0,
            nama: '',
            disabled: true,
        })
    }

    componentDidMount(): void {
        this.getDataSplitBill();
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.props.data_split_billing !== prevProps.data_split_billing) {
            this.getDataSplitBill();
        }

        if (this.props.data_split_menu !== prevProps.data_split_menu) {
            this.getDataSplitBill();
        }
    }

    getDataSplitBill() {
        const dot = new DotAdded();
        const data_billing = this.props.data_split_billing.map((el, i) => {
            return (
                <li>{el.end_duration} = Rp. {dot.parse(el.harga)}</li>
            )
        });

        const data_menu = this.props.data_split_menu.map((el, i) => {
            return (
                <li>{el.nama_menu} @{el.qty} = Rp. {dot.parse(el.sub_total)}</li>
            )
        });

        const total_bill = this.props.data_split_billing.reduce((total, arr) => {
            return total + arr.harga;
        }, 0);

        const total_menu = this.props.data_split_menu.reduce((total, arr) => {
            return total + arr.sub_total;
        }, 0);


        const total_all = parseInt(total_bill) + parseInt(total_menu);

        this.setState({
            data_split_billing: data_billing,
            data_split_menu: data_menu,
            total_all: dot.parse(total_all),
        });
    }

    handleNama(e) {
        if (e.target.value.length === 0) {
            toast.error("Nama wajib diisi");
            this.setState({
                nama: '',
                disabled: true,
            });
        } else {
            this.setState({
                nama: e.target.value,
                disabled: false,
            });
        }
    }

    handleBayar() {
        swal({
            title: "Apa kamu yakin?",
            text: "Pembayaran akan dilanjutkan dan tidak akan bisa di kembalikan!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data_bill = {
                    nama: this.state.nama,
                    total: this.state.total_all,
                    type_bill: 'Split Bill',
                    data_billing: this.props.data_split_billing,
                    data_menu: this.props.data_split_menu,
                    id_booking: this.props.id_booking,
                    id_pesanan: this.props.id_pesanan
                }

                console.log(data_bill);

                ipcRenderer.invoke("split_bill", data_bill).then((result) => {
                    console.log(result);

                    if (result.response === true) {
                        toast.success("Split Bill berhasil dilakukan");
                        this.clearState();
                        this.props.closeModalSplit();
                        this.props.clearSplitBill();
                    } else {
                        toast.error("Split Bill gagal dilakukan");
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
                <Modal
                    show={this.props.isOpenSplit}
                    keyboard={false}
                    onHide={this.props.closeModalSplit}
                    size="lg">
                    <Modal.Header closeButton onClick={this.props.closeModalSplit}>
                        <Modal.Title>Split Bill</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <label htmlFor="">Nama Customer</label>
                                    <input type="text" onChange={this.handleNama} className="form-control custom-input" />
                                </div>

                                <ul className="list-group mt-3">
                                    <li className="list-group-item"><small>Detail Bill Billing</small> <br />
                                        <ul>
                                            {this.state.data_split_billing}
                                        </ul>
                                    </li>
                                    <li className="list-group-item"><small>Detail Bill Menu</small> <br />
                                        <ul>
                                            {this.state.data_split_menu}
                                        </ul>
                                    </li>
                                </ul>

                                <div className="total-all mt-3">
                                    <h6>Total Bill: </h6>
                                    <h4>Rp. <span id="kembalian_struk_text">{this.state.total_all}</span></h4>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalSplit} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.state.disabled} onClick={this.handleBayar}>Bayar Sekarang</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalSplitBill;