import { ipcRenderer } from "electron";
import React from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";


class ModalHargaMember extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                id_harga_member: "",
                harga_member: "",
                potongan: "",
                playing: "",
            },
        }

        this.getMember = this.getMember.bind(this);
        this.handleHarga = this.handleHarga.bind(this);
        this.handlePlaying = this.handlePlaying.bind(this);
        this.handlePotongan = this.handlePotongan.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.props.list_member !== prevProps.list_member) {
            this.getMember();
        }
    }

    getMember() {
        console.log(this.props.list_member);
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                id_harga_member: this.props.list_member.id_harga_member,
                harga_member: this.props.list_member.harga_member,
                potongan: this.props.list_member.potongan,
                playing: this.props.list_member.playing,
            }
        }))
    }

    handleHarga(e) {
        if (e.target.value.length === 0) {
            toast.error("Harga wajib diisi.");
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    harga_member: e.target.value,
                }
            }))
        } else {
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    harga_member: e.target.value,
                }
            }))
        }
    }

    handlePotongan(e) {
        if (e.target.value.length === 0) {
            toast.error("Potongan wajib diisi.");
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    potongan: e.target.value,
                }
            }))
        } else {
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    potongan: e.target.value,
                }
            }))
        }
    }

    handlePlaying(e) {
        if (e.target.value.length === 0) {
            toast.error("Playing wajib diisi.");
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    playing: e.target.value,
                }
            }))
        } else {
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    playing: e.target.value,
                }
            }))
        }
    }

    handleChange() {
        ipcRenderer.invoke("updateHargaMember", this.state.data).then((result) => {
            console.log(result);
            if (result.response === true) {
                toast.success("Data berhasil diganti.");
                this.props.getHargaMember();
                this.props.closeHargaMember();
            } else {
                toast.error("Data gagal diganti");
                this.props.getHargaMember();
                this.props.closeHargaMember();
            }
        })
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpenHargaMember} centered keyboard={false} onHide={this.props.closeHargaMember} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Update Harga Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="">Harga</label>
                            <input type="number" className="form-control custom-input" value={this.state.data.harga_member} onChange={this.handleHarga} />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="">Potongan</label>
                            <input type="text" className="form-control custom-input" value={this.state.data.potongan} onChange={this.handlePotongan} />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="">Playing</label>
                            <input type="number" className="form-control custom-input" value={this.state.data.playing} onChange={this.handlePlaying} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeHargaMember} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.handleChange}>Ganti</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalHargaMember;