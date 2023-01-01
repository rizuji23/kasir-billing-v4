import { ipcRenderer } from "electron";
import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";

class ModalStokMasuk extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            stok_masuk: 0,
            stok_awal: 0,
            id_menu: "",
            id_stok_main: "",
            data_stok: {
                masuk_input: "",
                keterangan: "",
            },
            user_in: sessionStorage.getItem("username"),
        }

        this.handleMenu = this.handleMenu.bind(this);
        this.handleMasukInput = this.handleMasukInput.bind(this);
        this.handleKeterangan = this.handleKeterangan.bind(this);
        this.handleTambah = this.handleTambah.bind(this);
    }

    handleMenu(e) {
        // [0] is id_menu [1] is id_stok_main
        const parseArr = JSON.parse(e.target.value);

        ipcRenderer.invoke("fetchStokMenu", { id_menu: parseArr[0], id_stok_main: parseArr[1] }).then((result) => {
            if (result.response === true) {
                const total_stok = result.data[0].stok_awal + result.data[0].stok_masuk;
                this.setState({
                    stok_masuk: result.data[0].stok_masuk,
                    stok_awal: result.data[0].stok_awal,
                    id_menu: parseArr[0],
                    id_stok_main: parseArr[1],
                    masuk_input: total_stok,
                });
            }
        })
    }

    handleMasukInput(e) {
        if (e.target.value.length === 0) {
            this.setState({
                masuk_input: e.target.value,
            });
            toast.error("Stok Masuk harus diisi");

        } else {
            this.setState(prevState => ({
                data_stok: {
                    ...prevState.data_stok,
                    masuk_input: e.target.value,
                }
            }));
        }
    }

    handleKeterangan(e) {
        this.setState(prevState => ({
            data_stok: {
                ...prevState.data_stok,
                keterangan: e.target.value
            }
        }))
    }

    handleTambah() {
        swal({
            title: "Apa kamu yakin?",
            text: "Stok masuk akan ditambah!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const data = {
                    id_menu: this.state.id_menu,
                    id_stok_main: this.state.id_stok_main,
                    stok_masuk: this.state.data_stok.masuk_input,
                    keterangan: this.state.data_stok.keterangan,
                    user_in: this.state.user_in,
                }

                ipcRenderer.invoke("addStokMasuk", data).then((result) => {
                    console.log(result);
                    if (result.response === true) {
                        toast.success("Stok masuk berhasil ditambah.");
                        this.props.getMenu();
                        this.props.closeModalMasuk();
                    }
                })
            }
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <Modal
                    show={this.props.isOpenMasuk}
                    keyboard={false}
                    onHide={this.props.closeModalMasuk}
                    size="lg">
                    <Modal.Header closeButton onClick={this.props.closeModalMasuk}>
                        <Modal.Title>Tambah Stok Masuk</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-booking">
                            <div className="booking-content">
                                <div className="form-group">
                                    <label htmlFor="">Menu</label>
                                    <select name="" onChange={this.handleMenu} className="form-control custom-input">
                                        <option value="">Pilih Menu</option>
                                        {this.props.option_menu}
                                    </select>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Stok Awal</label>
                                    <div className="card card-custom-dark-light pb-0">
                                        <div className="ps-3">
                                            <p>{this.state.stok_awal} Item</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Stok Masuk</label>
                                    <div className="card card-custom-dark-light pb-0">
                                        <div className="ps-3">
                                            <p>{this.state.stok_masuk} Item</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Stok Masuk Input</label>
                                    <input type="number" onChange={this.handleMasukInput} className="form-control custom-input" />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="">Keterangan</label>
                                    <input type="text" onChange={this.handleKeterangan} className="form-control custom-input" />
                                </div>

                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                            data-bs-dismiss="modal" onClick={this.props.closeModalMasuk} id="close-modal-active">Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.handleTambah}>Tambah</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModalStokMasuk;