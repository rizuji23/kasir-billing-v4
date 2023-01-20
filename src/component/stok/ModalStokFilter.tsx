import React from "react";
import { Modal } from "react-bootstrap";

class ModalStokFilter extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
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
                                    <input type="date" className="form-control custom-input" />
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalFilter} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy">Filter</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalStokFilter;