import { ipcRenderer } from "electron";
import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import DotAdded from "../../system/DotAdded";

class ModalStokExport extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            date: "",
            data: "",
            disabled_filter: true
        }
        this.handleTanggal = this.handleTanggal.bind(this);
        this.handleDateFilter = this.handleDateFilter.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }

    handleDateFilter() {
        const day = {
            tanggal: this.state.date,
        }

        ipcRenderer.invoke("getStok", day).then((result) => {
            console.log(result);
            if (result.response === true) {
                toast.success("Data tersedia");
                const total_stok_keluar = result.data.reduce((total, arr) => total + arr.terjual || 0, 0);
                const tanggal_update = DotAdded.arrayMax(result.data)

                const data = {
                    data: result.data,
                    info: {
                        total_stok_keluar: total_stok_keluar,
                        tanggal_update: tanggal_update
                    },
                    tanggal: this.state.date
                }

                this.setState({
                    disabled_filter: false,
                    data: data
                });
            } else {
                toast.error("Data tidak tersedia");
                this.setState({
                    disabled_filter: true,
                });
            }
        });
    }

    handleExport() {
        ipcRenderer.invoke("printStok", this.state.data).then((result) => {
            console.log(result);
        });
    }

    handleTanggal(e) {
        if (e.target.value.length === 0) {
            toast.error("Tanggal wajib diisi.");
        } else {
            this.setState({
                date: e.target.value
            }, () => {
                this.handleDateFilter()
            })
        }
    }


    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenExport}
                    keyboard={false}
                    onHide={this.props.closeModalExport}
                    size="lg"
                    centered>
                    <Modal.Header closeButton onClick={this.props.closeModalExport}>
                        <Modal.Title>Export Stok</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <label htmlFor="">Tanggal</label>
                                    <input type="date" onChange={this.handleTanggal} className="form-control custom-input" />
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalExport} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.handleExport} disabled={this.state.disabled_filter}>Export</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalStokExport;