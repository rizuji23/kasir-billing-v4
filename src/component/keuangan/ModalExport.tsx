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
            data: [],
            disabled: true,
            selected: "",
            start_time: "",
            end_time: "",
        }

        this.handleFilter = this.handleFilter.bind(this);
        this.handleExportType = this.handleExportType.bind(this);
        this.handleShift = this.handleShift.bind(this);
        this.handleBulan = this.handleBulan.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleTahun = this.handleTahun.bind(this);
        this.handleCheckDate = this.handleCheckDate.bind(this);
        this.checkTahun = this.checkTahun.bind(this);
        this.checkData = this.checkData.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    clearState() {
        this.setState({
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
            data: [],
            disabled: true,
            selected: "",
            start_time: "",
            end_time: "",
        })
    }

    checkData(data) {
        if (data.length === 0) {
            this.setState({
                disabled: true,
            });
        } else {
            this.setState({
                disabled: false,
            })
        }
    }

    handleExportType(e) {
        if (e.target.value.length === 0) {
            toast.error("Export Tipe wajib diisi.");
        } else {
            this.setState({
                filter: e.target.value,
                export_tipe: e.target.value,
            })
        }
    }

    handleShift(e) {
        if (e.target.value.length === 0) {
            toast.error("Shift Tipe wajib diisi.");
        } else {
            ipcRenderer.invoke("getShift", e.target.value).then((result) => {
                console.log(result);
                if (result.response === true) {
                    this.setState({
                        shift: e.target.value,
                        start_time: result.data[0].start_jam,
                        end_time: result.data[0].end_jam,
                    });
                } else {
                    this.setState({
                        shift: e.target.value,
                    })
                }
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
                const data = {
                    shift: this.state.shift,
                    start: this.state.start_time,
                    end: this.state.end_time
                }
                ipcRenderer.invoke("check_export", true, false, false, false, data).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Data tersedia.");
                        const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD")

                        this.setState({
                            container_filter: <>
                                <div className="">
                                    <div className="alert alert-primary">
                                        {date_now}
                                    </div>
                                </div>
                            </>,
                            data: result,
                            selected: today,
                        }, () => {
                            this.checkData(this.state.data)
                        });
                    } else {
                        toast.error("Data tidak tersedia.");
                        this.setState({
                            container_filter: <>
                                <p style={{ textAlign: "center", fontStyle: "italic" }}>Tidak dipilih filter</p>
                            </>,
                            filter: "",
                            data: [],
                            selected: "",
                        }, () => {
                            this.checkData(this.state.data)
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

                        <div className="form-group mt-3 text-end">
                            <button className="btn btn-primary btn-primary-cozy btn-sm" onClick={this.checkTahun}>Check Data</button>
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
            const data = {
                shift: this.state.shift,
                start: this.state.start_time,
                end: this.state.end_time,
                month: e.target.value
            }
            ipcRenderer.invoke("check_export", false, false, true, false, data).then((result) => {
                console.log(e.target.value)
                if (result.response === true) {
                    toast.success("Data tersedia.")
                    this.setState({
                        bulan: e.target.value,
                        data: result,
                        selected: e.target.value
                    }, () => {
                        this.checkData(this.state.data)
                    });
                } else {
                    toast.error("Data tidak tersedia.")
                    this.setState({
                        bulan: "",
                        data: [],
                        selected: ""
                    }, () => {
                        this.checkData(this.state.data)
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
                shift: this.state.shift,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
            }

            ipcRenderer.invoke("check_export", false, true, false, false, data).then((result) => {
                console.log(result);
                if (result.response === true) {
                    toast.success("Data tersedia.");
                    this.setState({
                        data: result,
                        selected: `${data.start} ~ ${data.end}`
                    }, () => {
                        this.checkData(this.state.data)
                    })
                } else {
                    toast.error("Data tidak tersedia.");
                    this.setState({
                        data: [],
                    }, () => {
                        this.checkData(this.state.data)
                    })
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
                selected: e.target.value
            });
        }
    }

    checkTahun() {
        const data = {
            shift: this.state.shift,
            start: this.state.start_time,
            end: this.state.end_time,
            year: this.state.tahun
        }
        ipcRenderer.invoke("check_export", false, false, false, true, data).then((result) => {
            console.log(result);
            if (result.response === true) {

                toast.success("Data tersedia.");
                this.setState({
                    data: result,
                    selected: this.state.tahun
                }, () => {
                    this.checkData(this.state.data)
                });
            } else {
                toast.error("Data tidak tersedia.");
                this.setState({
                    data: [],
                    selected: "",
                }, () => {
                    this.checkData(this.state.data)
                });
            }
        })
    }

    handleExport() {
        if (this.state.export_tipe === "PDF") {
            ipcRenderer.invoke("export", true, false, { data: this.state.data, selected: this.state.selected, shift: this.state.shift, start_time: this.state.start_time, end_time: this.state.end_time }).then((result) => {
                console.log(result);
                this.clearState();
                this.props.closeModal();
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
                            </select>
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="">Shift Tipe</label>
                            <select className="form-control custom-input" onChange={this.handleShift}>
                                <option value="">Pilih Shift Tipe</option>
                                <option value="Semua">Semua</option>
                                <option value="Pagi">Shift Pagi</option>
                                <option value="Malam">Shift Malam</option>
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
                        <button className="btn btn-primary btn-primary-cozy" disabled={this.state.disabled} onClick={this.handleExport}>Export</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalExport;