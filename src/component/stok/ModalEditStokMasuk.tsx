import React from "react";
import { Modal } from "react-bootstrap";

class ModalEditStokMasuk extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenMasukEdit}
                    keyboard={false}
                    onHide={this.props.closeModalMasukEdit}
                    size="lg">
                    <Modal.Header closeButton onClick={this.props.closeModalMasukEdit}>
                        <Modal.Title>Edit Stok Masuk</Modal.Title>
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
                            data-bs-dismiss="modal" onClick={this.props.closeModalMasukEdit} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy">Edit</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalEditStokMasuk;