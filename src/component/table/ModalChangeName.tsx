import React from "react";
import { Modal } from 'react-bootstrap';
import DotAdded from "../../system/DotAdded";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { ipcRenderer } from "electron";


class ModalChangeName extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            nama: this.props.nama,
        }

        this.handleNama = this.handleNama.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    clearState() {
        this.setState({
            nama: '',
        })
    }

    handleNama(e) {
        if (e.target.value.length === 0) {
            toast.error("Nama wajib diisi");
            this.setState({
                nama: '',
                disabled: true,
            });
        } else {
            this.setState({
                nama: e.target.value,
                disabled: false,
            });
        }
    }

    handleChange() {
        const data = {
            nama: this.state.nama,
            id_booking: this.props.id_booking,
        }

        ipcRenderer.invoke("changeName", data).then((result) => {
            console.log(result);
            if (result.response === true) {
                toast.success("Nama Customer berhasil diubah.");
                this.props.getCustomerName();
                this.props.closeChangeName();
            } else {
                toast.error("Nama Customer gagal diubah.");
                this.props.closeChangeName();
            }
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <Modal
                    show={this.props.isOpenChange}
                    keyboard={false}
                    onHide={this.props.closeChangeName}
                    size="lg">
                    <Modal.Header closeButton onClick={this.props.closeChangeName}>
                        <Modal.Title>Ganti Nama Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <label htmlFor="">Nama Customer</label>
                                    <input type="text" onChange={this.handleNama} value={this.state.nama} className="form-control custom-input" />
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeChangeName} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.handleChange}>Ganti</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalChangeName;