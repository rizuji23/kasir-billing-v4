import { ipcRenderer } from "electron";
import React from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";


class ModalHargaBilling extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            harga: "",
            shift: "",
            id: "",
        }

        this.getHarga = this.getHarga.bind(this);
        this.handleHarga = this.handleHarga.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.props.data_harga_billing !== prevProps.data_harga_billing) {
            this.getHarga();
        }
    }

    getHarga() {
        console.log(this.props.data_harga_billing);
        this.setState({
            harga: this.props.data_harga_billing[0].harga,
            shift: this.props.data_harga_billing[0].tipe_durasi,
            id: this.props.data_harga_billing[0].id_harga_billing,
        })
    }

    handleHarga(e) {
        if (e.target.value.length === 0) {
            toast.error("Harga tidak boleh kosong.");
        } else {
            this.setState({
                harga: e.target.value,
            })
        }
    }

    handleChange() {
        const data = {
            harga: parseInt(this.state.harga),
            tipe_durasi: this.state.shift,
            id_harga_billing: this.state.id,
        }

        console.log(data)
        ipcRenderer.invoke("updateHargaBilling", data).then((result) => {
            console.log(result);
            if (result.response === true) {
                toast.success("Data berhasil diubah.");
                this.props.getHargaBilling();
                this.props.closeHargaBilling();
            } else {
                toast.error("Data gagal diubah.");
                this.props.getHargaBilling();
                this.props.closeHargaBilling();
            }
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpenHargaBilling} centered keyboard={false} onHide={this.props.closeShift} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Update Harga Billing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="">Harga</label>
                            <input type="text" className="form-control custom-input" value={this.state.harga} onChange={this.handleHarga} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeHargaBilling} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.handleChange}>Ganti</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalHargaBilling;