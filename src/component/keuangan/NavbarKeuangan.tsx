import React from "react";
import { NavLink } from "react-router-dom";
import ModalExport from "./ModalExport";

class NavbarKeuangan extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({
            isOpen: false,
        });
    }

    handleOpen() {
        this.setState({
            isOpen: true,
        })
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="overview-pemb mb-1">
                    <div className="d-flex mb-2">
                        <div className="me-auto">
                            <NavLink to={"/laporan-summary"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                                Summary
                            </NavLink>

                            <NavLink to={"/keuangan"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                List Transaksi
                            </NavLink>

                            <NavLink to={"/transaksi-shift"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                List Transaksi Shift
                            </NavLink>

                            <NavLink to={"/laporan-split-bill"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                List Split Bill
                            </NavLink>

                            <NavLink to={"/laporan-belum-bayar"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                List Belum Bayar
                            </NavLink>

                            <NavLink to={"/laporan-reset"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                List Reset
                            </NavLink>
                        </div>

                        <div className="flex-shrink-1">
                            <div className="d-flex mb-2 text-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)" className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" id="refresh_page"><img src="assets/img/icon/refresh-ccw.png" alt="" /></a>
                                </div>

                                <div className="p-1">
                                    <a href="javascript:void(0)" className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" onClick={this.handleOpen}>Print Transaksi</a>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>



                <ModalExport isOpen={this.state.isOpen} closeModal={this.handleClose} />
            </>
        )
    }
}

export default NavbarKeuangan