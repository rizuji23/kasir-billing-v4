import React from "react";
import { Header, ModalUser } from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import NavbarKeuangan from "../NavbarKeuangan";
import { ToastContainer } from "react-toastify";
import NavbarTransaksi from "../NavbarTransaksi";

class LaporanReset extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
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
                <div className="hr-white"></div>
                <div className="card card-custom mt-3">
                    <div className="card-body">
                        <div className="title-pemb">
                            <h4>Total transaksi reset:</h4>
                            <h4>Rp. <span id="total_hari"></span></h4>
                            <p id="date_locale"></p>
                        </div>
                    </div>
                </div>

                <div className="keuangan-list mt-3 mb-5">
                    <div className="card card-custom-dark">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 w-100">
                                    <h4>List Transaksi Reset</h4>
                                </div>

                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">

                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class LaporanResetContainer extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header />
                    <Sidebar />
                    <div className="box-bg">
                        <NavbarKeuangan />
                        <LaporanReset />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default LaporanResetContainer;