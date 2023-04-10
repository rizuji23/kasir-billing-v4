import React from "react";
import { Header, ModalUser } from "../header/header";
import Sidebar from "../sidebar/sidebar";
import { ToastContainer } from "react-toastify";
import Navbar_Menu from "./Navbar_Menu";
import { ipcRenderer } from "electron";

class Tentang extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            version: "",
        }

        this.getVersion = this.getVersion.bind(this);
    }

    getVersion() {
        ipcRenderer.invoke("getVersion").then((result) => {
            if (result.response === true) {
                this.setState({
                    version: result.data[0].url,
                })
            }
        })
    }

    componentDidMount(): void {
        this.getVersion();
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

                <div className="overview-pemb">
                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex">
                                <Navbar_Menu />
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)"
                                        className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10"><img
                                            src="assets/img/icon/refresh-ccw.png" id="refresh_table" alt="" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="keuangan-list mb-5 mt-4">
                    <div className="bg-dark box-dark mb-3">
                        <div className="box-booking">
                            <div className="booking-content p-5">
                                <div className="d-flex">
                                    <div className="pe-5 me-5">
                                        <img src="assets/img/weworks.png" width={200} alt="" />
                                    </div>
                                    <div>
                                        <div className="box-tentang">
                                            <h5>Tentang Kami</h5>
                                            <p>Kami adalah studio Desain dan Software
                                                Development(pengembang Aplikasi) yang
                                                berbasis dibandung dan terbentuk diatas 3 nilai dasar yang.</p>
                                            <div className="d-flex justify-content-center mt-5 mb-5">
                                                <div className="pe-5">
                                                    <div className="box-nilai">
                                                        <span>Eksplorer</span>
                                                    </div>
                                                </div>
                                                <div className="pe-5">
                                                    <div className="box-nilai">
                                                        <span>Solusi</span>
                                                    </div>
                                                </div>
                                                <div className="pe-5">
                                                    <div className="box-nilai">
                                                        <span>Inovasi</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p>Weworks berdiri pada tahun 2018 dan kami membuat program
                                                yaitu "Weworks Solution". program tersebut bertujuan untuk
                                                menunjukan kemampuan, kreativitas dan fleksibelitas
                                                kami dalam membantu pelaku bisnis untuk menjadi lebih bernilai
                                                dengan modal yang fleksibel. Semua itu bisa terjadi dengan
                                                sentuhan kreativitas kami.</p>

                                            <div className="mt-4">
                                                <h5>Kontak Kami</h5>
                                                <p>Email: weeeeworks@gmail.com
                                                    <br />Telepon: 085172110864
                                                    <br />Website: https://weworks.ink/
                                                    <br />Instagram: weworks.ink
                                                </p>
                                            </div>

                                            <div className="mt-4">
                                                <h5>Informasi Aplikasi</h5>
                                                <div className="alert alert-primary">
                                                    <span>Untuk informasi detail aplikasi ini dapat dilihat pada website <b>https://billing.weworks.ink</b></span>
                                                </div>

                                                <div className="alert alert-danger">
                                                    <span>Jika mengalami kendala pada software/hardware, silakan hubungi nomor <b>(089657581114 - Rizki Fauzi)</b> atau bisa mengunjungi web <b>https://ticket.weworks.ink</b>. Kami siap membantu anda 24 Jam.</span>
                                                </div>

                                                <div className="box-booking mb-0">
                                                    <div className="booking-content">
                                                        <p>Versi aplikasi: {this.state.version}</p>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary btn-primary-cozy">Check Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class TentangContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <Tentang />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default TentangContainer;