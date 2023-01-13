import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import 'moment-timezone';
import { ipcRenderer } from "electron";

class ModalExport extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            export_tipe: "",
            filter: "",
            container_filter: "",
            tanggal: {
                start: "",
                end: "",
            },
            today: false,
            bulan: "",
            tahun: "",
            shift: "",
        }

        this.handleFilter = this.handleFilter.bind(this);
        this.handleExportType = this.handleExportType.bind(this);
        this.handleShift = this.handleShift.bind(this);
        this.handleBulan = this.handleBulan.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleTahun = this.handleTahun.bind(this);
        this.handleCheckDate = this.handleCheckDate.bind(this);
    }

    handleExportType(e) {
        if (e.target.value.length === 0) {
            toast.error("Export Tipe wajib diisi.");
        } else {
            this.setState({
                filter: e.target.value,
            })
        }
    }

    handleShift(e) {
        if (e.target.value.length === 0) {
            toast.error("Shift Tipe wajib diisi.");
        } else {
            this.setState({
                shift: e.target.value,
            })
        }
    }

    handleFilter(e) {
        if (e.target.value.length === 0) {
            toast.error("Filter wajib diisi.");
            this.setState({
                container_filter: ""
            })
        } else {
            const val = e.target.value;
            const date_now = moment().tz("Asia/Jakarta").format("MMMM Do YYYY")
            if (val === "hari_ini") {
                ipcRenderer.invoke("check_export", true, false, false, false, []).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Data tersedia.");
                        this.setState({
                            container_filter: <>
                                <div className="">
                                    <div className="alert alert-primary">
                                        {date_now}
                                    </div>
                                </div>
                            </>
                        });
                    } else {
                        toast.error("Data tidak tersedia.");
                        this.setState({
                            container_filter: <>
                                <p style={{ textAlign: "center", fontStyle: "italic" }}>Tidak dipilih filter</p>
                            </>,
                            filter: "",
                        });
                    }
                })

            } else if (val === "bulan") {
                this.setState({
                    container_filter: <>
                        <div className="form-group">
                            <label htmlFor="">Pilih Bulan</label>
                            <input type="month" className="form-control custom-input" onChange={this.handleBulan} />
                        </div>
                    </>
                })
            } else if (val === "tanggal") {
                this.setState({
                    container_filter: <>
                        <div className="form-group">
                            <label htmlFor="">Dari Tanggal</label>
                            <input type="date" className="form-control custom-input" onChange={this.handleStartDate} />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="">Sampai Tanggal</label>
                            <input type="date" className="form-control custom-input" onChange={this.handleEndDate} />
                        </div>
                    </>
                })
            } else if (val === "tahun") {
                this.setState({
                    container_filter: <>
                        <div className="form-group">
                            <label htmlFor="">Input Tahun</label>
                            <input type="number" className="form-control custom-input" onChange={this.handleTahun} />
                        </div>
                    </>
                })
            }
        }
    }

    handleBulan(e) {
        if (e.target.value.length === 0) {
            toast.error("Bulan wajib diisi.");
            this.setState({
                bulan: e.target.value,
            });
        } else {
            ipcRenderer.invoke("check_export", false, false, true, false, e.target.value).then((result) => {
                console.log(e.target.value)
                if (result.response === true) {
                    toast.success("Data tersedia.")
                    this.setState({
                        bulan: e.target.value,
                    });
                } else {
                    toast.error("Data tidak tersedia.")
                    this.setState({
                        bulan: "",
                    });
                }
            })

        }
    }

    handleStartDate(e) {
        if (e.target.value === 0) {
            toast.error("Dari Tanggal wajib diisi.");
        } else {
            this.setState(prevState => ({
                tanggal: {
                    ...prevState.tanggal,
                    start: e.target.value,
                }
            }), () => {
                this.handleCheckDate();
            });


        }
    }

    handleEndDate(e) {
        if (e.target.value === 0) {
            toast.error("Sampai Tanggal wajib diisi.");
        } else {
            this.setState(prevState => ({
                tanggal: {
                    ...prevState.tanggal,
                    end: e.target.value,
                }
            }), () => {
                this.handleCheckDate();
            });


        }
    }

    handleCheckDate() {

        if (this.state.tanggal.start.length === 0 || this.state.tanggal.end.length === 0) {
            toast.error("Tanggal tidak benar.");
        } else {
            const data = {
                start: this.state.tanggal.start,
                end: this.state.tanggal.end,
            }

            ipcRenderer.invoke("check_export", false, true, false, false, data).then((result) => {
                if (result.response === true) {
                    toast.success("Data tersedia.");
                } else {
                    toast.error("Data tidak tersedia.");

                }
            })
        }
    }

    handleTahun(e) {
        if (e.target.value === 0) {
            toast.error("Input Tahun wajib diisi.");
        } else {
            this.setState({
                tahun: e.target.value,
            });
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal show={this.props.isOpen} centered keyboard={false} onHide={this.props.closeModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Export Data {this.props.shift}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="form-group">
                            <label htmlFor="">Export Tipe</label>
                            <select className="form-control custom-input" onChange={this.handleExportType}>
                                <option value="">Pilih Export Tipe</option>
                                <option value="PDF">PDF</option>
                                <option value="Struk">Struk</option>
                                <option value="Excel">Excel</option>
                            </select>
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="">Shift Tipe</label>
                            <select className="form-control custom-input" onChange={this.handleShift}>
                                <option value="">Pilih Shift Tipe</option>
                                <option value="Semua">Semua</option>
                                <option value="shift_1">Shift Siang</option>
                                <option value="shift_2">Shift Malam</option>
                            </select>
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="">Filter</label>
                            <select className="form-control custom-input" onChange={this.handleFilter}>
                                <option value="">Pilih Filter</option>
                                <option value="hari_ini">Hari Ini</option>
                                <option value="bulan">Bulan</option>
                                <option value="tanggal">Tanggal</option>
                                <option value="tahun">Tahun</option>
                            </select>
                        </div>

                        <hr />

                        <div className="box-booking">
                            <div className="booking-content">
                                {this.state.container_filter.length === 0 ? <p style={{ textAlign: "center", fontStyle: "italic" }}>Tidak dipilih filter</p> : this.state.container_filter}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModal} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={() => this.props.handleFilter(this.state.dari_tanggal, this.state.sampai_tanggal)} id="bayar_now">Export</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalExport;