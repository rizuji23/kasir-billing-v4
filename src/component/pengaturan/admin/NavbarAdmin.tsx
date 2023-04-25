import React from "react";
import { NavLink } from "react-router-dom";

class NavbarAdmin extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div className="p-1">
                    <NavLink to="/admin" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        Umum
                    </NavLink>
                </div>
                <div className="p-1">
                    <NavLink to="/aktivitas" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        Aktivitas Kasir
                    </NavLink>
                </div>
                {/* <div className="p-1">
                    <NavLink to="/pengaturan" className={({ isActive }) => isActive ? "btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10" : "btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10"}>
                        Waktu
                    </NavLink>
                </div> */}
            </>
        )
    }
}

export default NavbarAdmin