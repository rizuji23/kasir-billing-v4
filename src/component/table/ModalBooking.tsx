import { ipcRenderer } from "electron";
import React from "react"
import DotAdded from "../../system/DotAdded";
import {Modal, Alert} from 'react-bootstrap';


class ModalBooking extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            harga_list: ""
        }

    }

    close() {
        document.getElementById('close-modal').click()
    }

    getHargaList() {
        const listItems = this.props.harga_detail.map((number) =>
            <li>{number.tipe} = {number.harga}</li>
        );

        this.setState({harga_list:listItems})
    }

    componentDidMount(): void {
        if (this.props.close) {
            this.close()
        }
    }


    componentDidUpdate(prevProps): void {
        console.log(this.props.close)
        if (this.props.close) {
            this.close()
        }

        if (this.props.harga_detail !== prevProps.harga_detail) {
            console.log(this.props.harga_detail)
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
            >
                <Modal.Header closeButton>
                <Modal.Title>Booking Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="box-booking">
                            <div className="booking-content">
                                <h5>Booking Details</h5>
                                <div className="form-group-2 mt-4">
                                    <select name="" onChange={this.props.handleMode} className="form-control custom-input" id="input_check_customer">
                                        <option value="">Pilih Mode</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Loss">Loss</option>
                                    </select>
                                </div>
                                <div className="form-group-custom">
                                    <label>Nama lengkap</label>
                                    <input type="text" className="form-control custom-input" onChange={this.props.handleNama} id="nama_lengkap_booking"/>
                                </div>
                            </div>
                        </div>
                        <div className="box-booking mt-3">
                            <div className="booking-content">
                                <h5>Detail Pesanan</h5>
                                <label className="label-white mb-2">Table terpilih</label>
                                <div className="detail-table">
                                    <p><img src="assets/img/icon/archive.png" alt=""/> <span id="table_ids"></span>
                                     {this.props.table_name}</p>
                                </div>
                                <label className="label-white mb-2 mt-3"> Durasi penyewaan
                                </label><br/>
                                <label className="label-white-regular mb-1">Durasi (Per jam)</label>
    
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-default"><img
                                            src="assets/img/icon/clock2.png" width="20" alt=""/></span>
                                    <input type="number" onChange={this.props.handleJam} className="form-control group-input-custom"
                                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                        id="durasi_booking" disabled={this.props.mode_loss} />
                                </div>
                                <label className="label-white mb-2">Detail harga</label>
                                <div className="detail-table  mb-3">
                                        <ul dangerouslySetInnerHTML={{__html: this.props.harga_detail}}>
                                        </ul>
                                </div>
                                <label className="label-white mb-2">Total harga</label>
                                <div className="detail-table">
                                    <p><img src="assets/img/icon/rp.png" alt=""/> <span
                                            id="harga_total_text"> {this.props.total_harga}</span>
                                    </p>
                                    <p className="mt-3"><img src="assets/img/icon/clock.png" width="25" alt=""/> <span
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
                        {/* <div className="box-booking mt-3">
                            <div className="booking-content">
                                <h5>Table Settings</h5>
                                <div className="d-flex">
                                    <div className="p-1">
                                        <div className="mt-2">
                                            <div>
                                                <button id="reset_table2" className="btn btn-warning">Reset Table</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1">
                                        <div className="mt-2">
                                            <div>
                                                <button id="turn_off_table2" className="btn btn-danger">Turn Off Table</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div> */}
                </Modal.Body>
                <Modal.Footer>
                <button type="button" data-bs-dismiss="modal" id="close-modal" className="btn btn-primary btn-primary-cozy-dark"
                            >Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.props.startTimer} disabled={this.props.disableSubmit}>Booking Sekarang</button>
                </Modal.Footer>
            </Modal>
        </>
        )
    }
}

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
            isOpen: false
        }

        this.getAllTable = this.getAllTable.bind(this);
    }


    close() {
        document.getElementById('close-modal-active').click()
        console.log("HELLO")
    }

    getHargaList() {
        const listItems = this.props.harga_detail.map((number) =>
            <li>{number.tipe} = {number.harga}</li>
        );

        this.setState({harga_list:listItems})
    }

    getListBilling() {
        const dot = new DotAdded();
        if (this.state.id_booking !== ''){
            var bill_l = '';
            ipcRenderer.invoke("getDetailPriceBill", this.props.id_booking).then((result) => {
                result.data.forEach(element => {
                    bill_l += `<li>${element.end_duration} = Rp.${dot.parse(element.harga)}</li>`
                });
                console.log(bill_l)
                this.setState({list_billing: bill_l, start_time: result.data[0].created_at})
            })
        }
    }

    getListMenuCafe() {
        const dot = new DotAdded();
        if (this.state.id_booking !== '') {
            var menu = '';
            ipcRenderer.invoke("getCafeDetail", this.props.id_booking).then((result) => {
                if (result.response === false) {
                    this.setState({list_menu: result.data_cafe, detail_pesanan: result.data_pesanan})
                } else {
                    result.data_cafe.forEach(element => {
                        menu += `<li></li>`
                    })
                }
                console.log(result)
            })
        }
    }

    componentDidMount(): void {
        this.getListBilling()
        this.getAllTable()
        this.getListMenuCafe()
        if (this.props.close) {
            this.close()
        }

    }

    getAllTable():void {
        ipcRenderer.invoke("getAllTable", false).then((result) => {
            var data_list = '';
            result.data.forEach(element => {
                data_list += `<option value='${element.id_table}'>${element.nama_table}</option>`;
            });

            this.setState({
                list_table:data_list
            })
        })
    }

    componentDidUpdate(prevProps): void {
        // if (this.props.close === prevProps.close) {
        //     this.close()
        // }

        if (this.props.harga_detail !== prevProps.harga_detail) {
            console.log(this.props.harga_detail)
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
            >
                <Modal.Header closeButton>
                <Modal.Title>Penambahan Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="box-booking">
                                <div className="booking-content">
                                    <h5>Setting Table</h5>
                                    <div className="hr-white"></div>
                                    <label  className="label-white mb-2" >Table terpilih</label>
                                    <div className="detail-table">
                                        <p><img src="assets/img/icon/archive.png" alt="" /><span
                                                id="table_ids_active"> {this.props.table_name}</span>
                                        </p>
                                    </div>
                                    <div className="d-flex">
                                        <div className="p-1">
                                            <div className="mt-2">
                                                <div>
                                                    <button id="reset_table" onClick={this.props.resetTable} className="btn btn-warning">Reset Table</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-1">
                                            <div className="mt-2">
                                                <div>
                                                    <button id="print_struk_billing" className="btn btn-info">Print Struk
                                                        Billing</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="mt-2">Pindah Table</h5>
                                    <div className="hr-white"></div>
                                    <div className="mt-2">
                                        <label >Pilih Meja</label>
                                        <select name=""  onChange={this.props.handlePindah} className="form-control custom-input" id="pilih_meja" dangerouslySetInnerHTML={{__html: this.state.list_table}}>
                                        </select>
                                    </div>
                                    <div className="mt-2  text-end">
                                        <div className="">
                                            <button id="pindah_meja_btn" className="btn btn-primary btn-primary-cozy">Pindah
                                                Meja</button>
                                        </div>
                                    </div>
                                    <div id="info_customer">

                                    </div>
                                </div>
                            </div>
                            <div className="box-booking mt-3">
                                <div className="booking-content">
                                    <h5>Tambah Durasi Table</h5>
                                    {this.props.time_running ? <Alert key={'danger'} variant={'danger'}>Penambahan Durasi hanya bisa saat <strong>Waktu</strong> sudah habis!.</Alert>: ''}
                                    <label  className="label-white mb-2 mt-3">Tambah Durasi penyewaan
                                    </label><br/>
                                    <label  className="label-white-regular mb-1">Durasi (Per jam)</label>
                                    <div id="peringatan">

                                    </div>
                                    
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default"><img
                                                src="assets/img/icon/clock2.png" width="20" alt=""/></span>
                                        <input type="number" onChange={this.props.handleJam} className="form-control group-input-custom"
                                            aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                            id="durasi_booking_active"/>
                                    </div>
                                    <label  className="label-white mb-2">Detail harga</label>

                                    <div className="detail-table  mb-3">
                                        <ul dangerouslySetInnerHTML={{__html: this.props.harga_detail}}>
                                        </ul>
                                </div>
                                    <label  className="label-white mb-2">Total harga</label>
                                    <div className="detail-table">
                                    <p><img src="assets/img/icon/rp.png" alt=""/> <span
                                            id="harga_total_text"> {this.props.total_harga_add}</span>
                                    </p>
                                    <p className="mt-3"><img src="assets/img/icon/clock.png" width="25" alt=""/> <span
                                            id="durasi_total_text">{this.props.jam} Jam</span></p>
                                    </div>
                                    <input type="hidden" id="harga_booking_active"/>
                                    <div className="form-group-2 mt-4">
                                        <select name="" className="form-control custom-input" id="input_setting_blink_active">
                                            <option value="">Pilih Setting Blink</option>
                                            <option value="Iya">Iya</option>
                                            <option value="Tidak">Tidak</option>
                                        </select>
                                    </div>
                                    <div className="text-end mt-2">
                                        <button className="btn btn-primary btn-primary-cozy" id="add_on_send" onClick={this.props.addOn} disabled={this.props.disabled_add}>Tambah</button>
                                    </div>
                                </div>
                            </div>
                            <div className="box-booking mt-3">
                                <div className="booking-content">
                                    <h5>Detail Pesanan</h5>
                                    <hr/>
                                    <p>Tanggal Mulai: <span id="jam_mulai_active">{ this.state.start_time }</span></p>
                                    <ul className="list-group" id="detail_struk_table">
                                        <li className="list-group-item"><small>Nama Pemesan</small> <br/><span
                                                id="nama_pemesan_active"></span> {this.props.name_customer} ({this.props.id_booking})</li>
                                        <li className="list-group-item"><small>List Billing</small> <br/>
                                            <ul>
                                                <div id="list_billing" dangerouslySetInnerHTML={{__html: this.state.list_billing}}></div>
                                                <div id="list_billing_detail"></div>
                                            </ul>
                                        </li>

                                        <li className="list-group-item">
                                            <small>List Menu</small> <br/>
                                            <ul dangerouslySetInnerHTML={{__html: this.state.list_menu}}>
                                                
                                            </ul>
                                        </li>

                                        <li className="list-group-item">
                                        <small>Total Harga Menu:</small><br />
                                            {this.state.detail_pesanan}
                                        </li>
                                    </ul>
                                    <div className="total-all mt-3">
                                        <h6>Total Harga Semua: </h6>
                                        <h4>Rp. <span id="total_struk_active">{this.props.total_harga}</span></h4>
                                    </div>
                                    <div className="box-kembalian mb-3">
                                        <label >Uang Cash</label>
                                        <div className="input-group mt-2">
                                            <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                            <input type="text" className="form-control group-input-custom"
                                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                id="uang_cash_active"/>
                                        </div>
                                    </div>
                                    <div className="total-all">
                                        <h6>Kembalian: </h6>
                                        <h4>Rp. <span id="kembalian_struk_text">0</span></h4>
                                    </div>
                                </div>

                            </div>
                </Modal.Body>
                <Modal.Footer>
                <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                                    data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                                <button className="btn btn-primary btn-primary-cozy" id="bayar_now">Bayar Sekarang</button>
                </Modal.Footer>
            </Modal>
            {/* <div className="modal-backdrop fade show"></div> */}
            </>
        )
    }
}

export {ModalBooking, ModalBookingActive};