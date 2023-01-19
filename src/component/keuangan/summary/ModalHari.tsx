import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

class ModalHari extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            start: "",
            end: "",
            disabled: true,
        }

        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.validation = this.validation.bind(this);
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    validation() {
        if (this.isObjectEmpty({ start: this.state.start, end: this.state.end })) {
            this.setState({
                disabled: false,
            });
        } else {
            this.setState({
                disabled: true,
            })
        }
    }

    handleStartDate(e) {
        if (e.target.value.length === 0) {
            toast.error("Dari Tanggal tidak boleh kosong.");
            this.validation();
        } else {
            this.setState({
                start: e.target.value
            }, () => {
                this.validation();
            });
        }
    }

    handleEndDate(e) {
        if (e.target.value.length === 0) {
            toast.error("Sampai Tanggal tidak boleh kosong.");
        } else {
            this.setState({
                end: e.target.value,
            }, () => {
                this.validation();
            })
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpen} centered keyboard={false} onHide={this.props.closeModal} size="lg">
                    <Modal.Header>
                        <Modal.Title>Filter Data Semua Transaksi Hari</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mt-2">
                            <label>Dari Tanggal</label>
                            <input type="date" onChange={this.handleStartDate} className="form-control custom-input mt-2" />
                        </div>

                        <div className="mt-2">
                            <label>Sampai Tanggal</label>
                            <input type="date" onChange={this.handleEndDate} className="form-control custom-input mt-2" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.state.disabled} onClick={() => this.props.handleFilterHari(this.state.start, this.state.end)}>Filter</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalHari;