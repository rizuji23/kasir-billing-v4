import { ipcRenderer } from "electron";
import React from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";


class ModalShiftAdmin extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_shift: {},
        }
        this.handleDariJam = this.handleDariJam.bind(this);
        this.handleSampaiJam = this.handleSampaiJam.bind(this);
        this.changeShift = this.changeShift.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.props.data_shift !== prevProps.data_shift) {
            this.setState({
                data_shift: this.props.data_shift
            });
        }
    }

    handleDariJam(e) {
        this.setState(prevState => ({
            data_shift: {
                ...prevState.data_shift,
                start_jam: e.target.value,
            }
        }));
    }

    handleSampaiJam(e) {
        this.setState(prevState => ({
            data_shift: {
                ...prevState.data_shift,
                end_jam: e.target.value,
            }
        }));
    }

    changeShift() {
        ipcRenderer.invoke("updateShift", this.state.data_shift).then((result) => {
            console.log(result);
            if (result.response === true) {
                toast.success("Shift berhasil disimpan.");

                if (this.state.data_shift.shift === "Pagi") {
                    localStorage.setItem("shift_pagi", `{"start_jam": "${this.state.data_shift.start_jam}", "end_jam": "${this.state.data_shift.end_jam}"}`)
                } else if (this.state.data_shift.shift === "Malam") {
                    localStorage.setItem("shift_malam", `{"start_jam": "${this.state.data_shift.start_jam}", "end_jam": "${this.state.data_shift.end_jam}"}`)
                }
                this.props.getShift();
                this.props.closeShift();
            } else {
                toast.error("Shift gagal disimpan.");
            }
        })
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpenShift} centered keyboard={false} onHide={this.props.closeShift} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Update Shift</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-warning">
                            <span>Untuk <b>Dari Jam</b> & <b>Sampai Jam</b> harus per jam tidak boleh ada menit.</span>
                        </div>
                        <div className="mt-2">
                            <label>Dari Jam</label>
                            <input type="time" value={this.state.data_shift.start_jam} onChange={this.handleDariJam} className="form-control custom-input mt-2" />
                        </div>

                        <div className="mt-2">
                            <label>Sampai Jam</label>
                            <input type="time" value={this.state.data_shift.end_jam} onChange={this.handleSampaiJam} className="form-control custom-input mt-2" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeShift} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.changeShift}>Ganti</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalShiftAdmin;