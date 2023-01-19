import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

class ModalBulan extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            month: "",
            disabled: true,
        }

        this.handleMonth = this.handleMonth.bind(this);
        this.validation = this.validation.bind(this);
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    validation() {
        if (this.isObjectEmpty({ month: this.state.month })) {
            this.setState({
                disabled: false,
            });
        } else {
            this.setState({
                disabled: true,
            })
        }
    }

    handleMonth(e) {
        if (e.target.value.length === 0) {
            toast.error("Dari Tanggal tidak boleh kosong.");
            this.validation();
        } else {
            this.setState({
                month: e.target.value
            }, () => {
                this.validation();
            });
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpen} centered keyboard={false} onHide={this.props.closeModal} size="lg">
                    <Modal.Header>
                        <Modal.Title>Filter Data Semua Transaksi Bulan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mt-2">
                            <label>Input Bulan</label>
                            <input type="month" onChange={this.handleMonth} className="form-control custom-input mt-2" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.state.disabled} onClick={() => this.props.handleFilterBulan(this.state.month)}>Filter</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalBulan;