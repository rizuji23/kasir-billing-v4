import { ipcRenderer } from "electron";
import React from "react"
import DotAdded from "../../system/DotAdded";
import { Modal, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import ModalSplitBill from "./ModalSplitBill";

class ModalBooking extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            harga_list: "",
            isOpen: false,
            price_list: "",
        }

        this.getPrice = this.getPrice.bind(this);
    }

    close() {
        document.getElementById('close-modal').click()
    }

    getHargaList() {
        const listItems = this.props.harga_detail.map((number) =>
            <li>{number.tipe} = {number.harga}</li>
        );

        this.setState({ harga_list: listItems })
    }

    getPrice() {
        ipcRenderer.invoke("getHarga").then((result) => {
            console.log(result);
            const dot = new DotAdded();
            if (result.response === true) {
                const price = result.data.map((el) => {
                    return (
                        <><li className="list-group-item"><small>{el.tipe_durasi}</small><br /><b>Rp. {dot.parse(el.harga)}</b><br /><small>Tanggal Update</small><br /><b>{el.updated_at}</b></li></>
                    )
                });

                console.log(price)

                this.setState({
                    price_list: price
                })
            }
        })
    }

    componentDidMount(): void {
        if (this.props.close) {
            this.close()
        }
    }

    componentDidUpdate(prevProps): void {
        // console.log(this.props.close)
        // if (this.props.close) {
        //     this.close()
        // }

        if (this.props.harga_detail !== prevProps.harga_detail) {
            console.log(this.props.harga_detail)
        }

        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen === true) {
                this.getPrice();
            }
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpen}
                    keyboard={false}
                    onHide={this.props.closeModal}
                    size="xl"
                    fullscreen>
                    <Modal.Header closeButton>
                        <Modal.Title>Booking Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm">
                                <div className="box-booking">
                                    <div className="booking-content">
                                        <h5>Booking Details</h5>
                                        <label className="label-white mb-2 mt-2">Pilih Mode</label>
                                        <div className="detail-table p-0">
                                            <div className="d-flex">
                                                <div className="pe-2 pt-3 pb-3 ps-3">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="exampleRadios" id="regular" value="Regular" checked={this.props.mode === "Regular"} onChange={this.props.handleMode} />
                                                        <label className="form-check-label" htmlFor="regular">
                                                            Regular
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="pe-2 pt-3 pb-3 ps-2">
                                                    <div className="form-check">
                                                        <input className="form-check-input" onChange={this.props.handleMode} type="radio" name="exampleRadios" id="loss" value="Loss" checked={this.props.mode === "Loss"} />
                                                        <label className="form-check-label" htmlFor="loss">
                                                            Loss
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pe-2 pb-3 ps-3">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" onChange={this.props.handleMember} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Member</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="form-group-2 mt-4">
                                            <select name="" onChange={this.props.handleMode} className="form-control custom-input" id="input_check_customer">
                                                <option value="">Pilih Mode</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Loss">Loss</option>
                                            </select>
                                        </div> */}
                                        {
                                            this.props.member ? <>
                                                <div className="form-group-custom">
                                                    <label>Kode Member</label>
                                                    <input type="text" onChange={this.props.handleInputMember} className="form-control custom-input" />
                                                </div>
                                                <div className="form-group-custom">
                                                    <label>Nama Lengkap</label>
                                                    <input type="text" className="form-control custom-input" value={this.props.nama_member} disabled />
                                                </div>
                                            </> : <>
                                                <div className="form-group-custom">
                                                    <label>Nama lengkap</label>
                                                    <input type="text" className="form-control custom-input" onChange={this.props.handleNama} />
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                                <div className="box-booking mt-3">
                                    <div className="booking-content">
                                        <h5>Harga</h5>
                                        <ul className="list-group">
                                            {this.state.price_list}

                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm">
                                <div className="box-booking">
                                    <div className="booking-content">
                                        <h5>Voucher</h5>
                                        <div className="form-group-custom">
                                            <label>Kode</label>
                                            <input type="text" className="form-control custom-input" />
                                        </div>
                                        <div className="text-end mt-2">
                                            <button className="btn btn-primary btn-primary-cozy btn-sm">Check</button>
                                        </div>
                                        <hr />
                                        <h5>Detail Pesanan</h5>
                                        <label className="label-white mb-2">Table terpilih</label>
                                        <div className="detail-table">
                                            <p><img src="assets/img/icon/archive.png" alt="" /> <span id="table_ids"></span>
                                                {this.props.table_name}</p>
                                        </div>
                                        <label className="label-white mb-2 mt-3"> Durasi penyewaan
                                        </label><br />
                                        <label className="label-white-regular mb-1">Durasi (Per jam)</label>

                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id="inputGroup-sizing-default"><img
                                                src="assets/img/icon/clock2.png" width="20" alt="" /></span>
                                            <input type="number" onChange={this.props.handleJam} className="form-control group-input-custom"
                                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                id="durasi_booking" disabled={this.props.mode_loss} />
                                        </div>
                                        <label className="label-white mb-2">Detail harga</label>
                                        <div className="detail-table  mb-3">
                                            <ul dangerouslySetInnerHTML={{ __html: this.props.harga_detail }}>
                                            </ul>
                                        </div>
                                        <label className="label-white mb-2">Total harga</label>
                                        <div className="detail-table">
                                            <p><img src="assets/img/icon/rp.png" alt="" /> <span
                                                id="harga_total_text"> {this.props.total_harga}</span>
                                            </p>
                                            <p className="mt-3"><img src="assets/img/icon/clock.png" width="25" alt="" /> <span
                                                id="durasi_total_text">{this.props.jam} Jam</span></p>
                                        </div>

                                        <div className="form-group-2 mt-4">
                                            <select name="" onChange={this.props.handleBlink} className="form-control custom-input" id="input_setting_blink">
                                                <option value="">Pilih Setting Blink</option>
                                                <option value="Iya">Iya</option>
                                                <option value="Tidak">Tidak</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" data-bs-dismiss="modal" onClick={this.props.closeModal} className="btn btn-primary btn-primary-cozy-dark"
                        >Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.props.mode_loss ? this.props.startTimerLoss : this.props.startTimer} disabled={this.props.disableSubmit}>Booking Sekarang</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}



export default ModalBooking;