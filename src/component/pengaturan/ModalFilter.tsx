import React from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import FilterTransaksi from "../keuangan/system/FilterTransaksi";

class ModalFilter extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            dari_tanggal: '',
            sampai_tanggal: '',
        }
        this.handleFromDate = this.handleFromDate.bind(this);
        this.handleToDate = this.handleToDate.bind(this);
    }

    handleFromDate(e) {
        if (e.target.value.length === 0) {

        } else {
            this.setState({ dari_tanggal: e.target.value });
        }
    }

    handleToDate(e) {
        if (e.target.value.length === 0) {

        } else {
            this.setState({ sampai_tanggal: e.target.value });
        }
    }



    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpen} centered keyboard={false} onHide={this.props.closeModal} size="lg">
                    <Modal.Header>
                        <Modal.Title>Filter Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mt-2">
                            <label>Dari Tanggal</label>
                            <input type="date" onChange={this.handleFromDate} className="form-control custom-input mt-2" />
                        </div>

                        <div className="mt-2">
                            <label>Sampai Tanggal</label>
                            <input type="date" onChange={this.handleToDate} className="form-control custom-input mt-2" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={() => this.props.handleFilter(this.state.dari_tanggal, this.state.sampai_tanggal)} id="bayar_now">Filter</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalFilter;