import React from "react";
import { NavLink } from "react-router-dom";

class NavbarAnalisis extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="overview-pemb mb-1 mt-3">
                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex mb-2">
                                <NavLink to={"/analisis"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                                    Pendapatan
                                </NavLink>

                                {/* <NavLink to={"/analisis-pendapatan"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                    Pelanggan
                                </NavLink>
                                <NavLink to={"/analisis-pendapatan"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10 ms-2"}>
                                    Stok
                                </NavLink> */}
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="d-flex mb-2 float-end">
                                <div className="p-1">
                                    <a href="javascript:void(0)" className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" id="refresh_page">
                                        Filter Data
                                    </a>
                                </div>
                                <div className="p-1">
                                    <a href="javascript:void(0)" className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" id="refresh_page"><img src="assets/img/icon/refresh-ccw.png" alt="" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default NavbarAnalisis;