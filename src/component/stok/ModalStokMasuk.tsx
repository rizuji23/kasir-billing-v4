import React from "react";
import { Modal } from "react-bootstrap";

class ModalStokMasuk extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenMasuk}
                    keyboard={false}
                    onHide={this.props.closeModalMasuk}
                    size="lg">
                    <Modal.Header closeButton onClick={this.props.closeModalMasuk}>
                        <Modal.Title>Tambah Stok Masuk</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <label htmlFor="">Menu</label>
                                    <select name="" className="form-control custom-input">
                                        <option value="">Pilih Menu</option>
                                        {this.props.option_menu}
                                    </select>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Stok Terbaru</label>
                                    <div className="card card-custom-dark-light pb-0">
                                        <div className="ps-3">
                                            <p>35 Item</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-danger mt-3" role="alert">
                                    <small>Stok masuk harus lebih dari Stok Terbaru.</small>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Stok Masuk Input</label>
                                    <input type="number" className="form-control custom-input" />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Keterangan</label>
                                    <input type="text" className="form-control custom-input" />
                                </div>

                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalMasuk} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy">Tambah</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalStokMasuk;