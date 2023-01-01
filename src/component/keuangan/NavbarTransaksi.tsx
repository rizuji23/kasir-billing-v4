import React from "react";
import { NavLink } from "react-router-dom";

class NavbarTransaksi extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div className="d-flex mb-2">
                    <div className="p-1">
                        <NavLink to={"/keuangan"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                            Transaksi Billing + Cafe
                        </NavLink>
                    </div>

                    <div className="p-1">
                        <NavLink to={"/keuangan-cafe"} className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                            Transaksi Cafe
                        </NavLink>

                    </div>

                    {/* <div className="p-1">
                        <a href="list_stok_cafe.html" className="btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">
                            Cafe Stok</a>
                    </div>
                    <div className="p-1">
                        <a href="list_stok_masuk.html" className="btn btn-primary btn-primary-cozy-dark btn-home-top border-r-13 pl-20 pr-20 pt-10 pb-10">
                            Stok Masuk</a>
                    </div> */}
                </div>
            </>
        )
    }
}

export default NavbarTransaksi;