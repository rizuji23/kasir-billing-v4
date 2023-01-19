import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

class ModalFilterNot extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            tipe: "",
            disabled: true,
            form: "",
            tanggal: {
                start: "",
                end: "",
            },
            month: "",
        }

        this.validation = this.validation.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleMonth = this.handleMonth.bind(this);
    }

    isObjectEmpty(value) {
        return Object.values(value).every(x => x !== '');
    }

    validation() {
        console.log(this.state.tanggal)
        if (this.state.tipe === "Tanggal") {

            if (this.isObjectEmpty(this.state.tanggal)) {
                this.setState({
                    disabled: false,
                });
            } else {
                this.setState({
                    disabled: true,
                })
            }
        } else if (this.state.tipe === "Bulan") {
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

    }

    handleStartDate(e) {
        if (e.target.value.length === 0) {
            toast.error("Dari Tanggal harus diisi.");
            this.validation();
        } else {
            this.setState(prevState => ({
                tanggal: {
                    ...prevState.tanggal,
                    start: e.target.value,
                }
            }), () => {
                this.validation();

            });
        }
    }

    handleEndDate(e) {
        if (e.target.value.length === 0) {
            toast.error("Sampai Tanggal harus diisi.");
            this.validation();
        } else {
            this.setState(prevState => ({
                tanggal: {
                    ...prevState.tanggal,
                    end: e.target.value,
                }
            }), () => {
                this.validation();

            });
        }
    }

    handleMonth(e) {
        if (e.target.value.length === 0) {
            toast.error("Bulan harus diisi.")
            this.validation();
        } else {
            this.setState({
                month: e.target.value,
            }, () => {
                this.validation();

            });
        }
    }

    handleType(e) {
        if (e.target.value.length === 0) {
            toast.error("Tipe Filter harus disini.");
            this.setState({
                form: <></>
            })
        } else {
            if (e.target.value === "Tanggal") {
                this.setState({
                    form: <>
                        <div className="form-group mt-3">
                            <label htmlFor="">Dari Tanggal</label>
                            <input type="date" onChange={this.handleStartDate} className="form-control custom-input" />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="">Sampai Tanggal</label>
                            <input type="date" onChange={this.handleEndDate} className="form-control custom-input" />
                        </div>
                    </>,
                    tipe: e.target.value,
                });
            } else if (e.target.value === "Bulan") {
                this.setState({
                    form: <>
                        <div className="form-group mt-3">
                            <label htmlFor="">Input Bulan</label>
                            <input type="month" onChange={this.handleMonth} className="form-control custom-input" />
                        </div>
                    </>,
                    tipe: e.target.value,
                });
            } else {
                this.setState({
                    form: <></>
                })
                toast.error("Invalid Tipe Filter.");
            }
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpen} centered keyboard={false} onHide={this.props.closeModal} size="lg">
                    <Modal.Header>
                        <Modal.Title>Filter Data Semua Tidak Termasuk Transaksi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="">Pilih Tipe Filter</label>
                            <select name="" id="" onChange={this.handleType} className="form-control custom-input mt-2">
                                <option value="">Tipe Filter</option>
                                <option value="Tanggal">Tanggal</option>
                                <option value="Bulan">Bulan</option>
                            </select>
                        </div>
                        <hr />
                        {this.state.form}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.state.disabled} onClick={() => this.state.tipe === "Tanggal" ? this.props.handleFilterNot(this.state.tanggal, this.state.tipe) : this.props.handleFilterNot(this.state.month, this.state.tipe)}>Filter</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalFilterNot;