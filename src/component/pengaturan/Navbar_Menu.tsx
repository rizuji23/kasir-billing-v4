import React from "react";
import { NavLink } from "react-router-dom";

class Navbar_Menu extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div className="p-1">
                    <NavLink to="/pengaturan" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        List Menu
                    </NavLink>
                </div>
                <div className="p-1">
                    <NavLink to="/kategori-menu" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        List Kategori Menu
                    </NavLink>

                </div>

                <div className="p-1">
                    <NavLink to="/voucher" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        Voucher
                    </NavLink>
                </div>

                <div className="p-1">
                    <NavLink to="/api" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        API
                    </NavLink>
                </div>

                {/* <div className="p-1">
                    <NavLink to="/admin" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        Admin
                    </NavLink>
                </div> */}

                <div className="p-1">
                    <NavLink to="/tentang" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        Tentang Aplikasi
                    </NavLink>
                </div>
            </>
        )
    }
}

export default Navbar_Menu