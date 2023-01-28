import { ipcRenderer } from "electron";
import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import DotAdded from "../../system/DotAdded";

class ModalKeterangan extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
        }
        this.getKeterangan = this.getKeterangan.bind(this);
    }

    componentDidMount(): void {
        this.getKeterangan();
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.props.data_keterangan !== prevProps.data_keterangan) {
            this.getKeterangan();
        }
    }

    getKeterangan() {
        console.log(this.props.data_keterangan)
        if (this.props.data_keterangan.response === true) {
            const data = this.props.data_keterangan.data.map(el => {
                return (
                    <>
                        <li className="list-group-item">({el.created_at} Kasir: {el.user_in}) = {el.keterangan}</li>
                    </>
                )
            });

            this.setState({
                data: data,
            })
        } else {
            this.setState({
                data: "Tidak ada...",
            })
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenKeterangan}
                    keyboard={false}
                    onHide={this.props.closeModalKeterangan}
                    size="lg"
                    centered
                    scrollable>
                    <Modal.Header closeButton onClick={this.props.closeModalKeterangan}>
                        <Modal.Title>Keterangan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="list-group">
                            {this.state.data}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalKeterangan} id="close-modal-active">Close</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalKeterangan;