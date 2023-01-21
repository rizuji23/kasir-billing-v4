import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

class ModalStokFilter extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.setState({
            date: "",
        })
        this.handleTanggal = this.handleTanggal.bind(this);
    }

    handleTanggal(e) {
        if (e.target.value.length === 0) {
            toast.error("Tanggal wajib diisi.");
        } else {
            this.props.handleDateFilter(e.target.value)
            this.setState({
                date: e.target.value
            })
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenFilter}
                    keyboard={false}
                    onHide={this.props.closeModalFilter}
                    size="lg"
                    centered>
                    <Modal.Header closeButton onClick={this.props.closeModalFilter}>
                        <Modal.Title>Filter Stok</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <label htmlFor="">Tanggal</label>
                                    <input type="date" onChange={this.handleTanggal} className="form-control custom-input" />
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalFilter} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.props.disabled_filter} onClick={() => this.props.getFilterDate(this.state.date)}>Filter</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalStokFilter;