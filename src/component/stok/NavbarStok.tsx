import React from "react";
import { NavLink } from "react-router-dom";

class NavbarStok extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    refreshPage() {
        window.location.reload();
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="overview-pemb mb-1 mt-3">
                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex mb-2">
                                <NavLink to={"/stok"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                                    Management
                                </NavLink>

                                <NavLink to={"/stok-masuk"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                    List Stok Masuk
                                </NavLink>
                                <NavLink to={"/stok-keluar"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                    List Stok Keluar
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)" onClick={this.refreshPage} className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" id="refresh_page"><img src="assets/img/icon/refresh-ccw.png" alt="" /></a>
                                </div>
                                <div className="p-1">
                                    <button className="btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10" disabled={this.props.disabled_new} onClick={this.props.handleOpenNewStok}>Buka Stok Baru</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default NavbarStok;