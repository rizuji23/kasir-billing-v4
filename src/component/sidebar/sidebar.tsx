import React from "react";
import { NavLink } from "react-router-dom";

class Sidebar extends React.Component<any, any> {
    handleLogout() {
        sessionStorage.setItem("username", "");
        sessionStorage.setItem("nama", "");
        sessionStorage.setItem("user", "");

        window.location.href = "/"
    }
    render() {
        return (
            <div className="l-navbar show-sidebar" id="nav-bar">
                <nav className="nav">
                    <div>
                        <a href="javascript:void(0)" className="nav_logo">
                            <span className="nav_logo-name"><img src="assets/img/logo.png" alt="" /></span>
                        </a>
                        <div className="nav_list">
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-home-alt nav_icon'></i>
                                <span className="nav_name">Home</span>
                            </NavLink>

                            <NavLink to="/waiting-list" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-notepad nav_icon'></i>
                                <span className="nav_name">Waiting List</span>
                            </NavLink>

                            <NavLink to="/member" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-user-plus nav_icon'></i>
                                <span className="nav_name">Member</span>
                            </NavLink>

                            <NavLink to="/menu-makanan" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-bowl-rice nav_icon'></i>
                                <span className="nav_name">Menu</span>
                            </NavLink>

                            <NavLink to="/laporan-summary" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-money nav_icon'></i>
                                <span className="nav_name">Laporan</span>
                            </NavLink>

                            <NavLink to="/stok" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-package nav_icon'></i>
                                <span className="nav_name">Stok</span>
                            </NavLink>

                            <NavLink to="/analisis" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-line-chart nav_icon'></i>
                                <span className="nav_name">Analisis</span>
                            </NavLink>

                            <NavLink to="/manual-lampu" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"} title="Manual">
                                <i className='bx bx-desktop nav_icon'></i>
                                <span className="nav_name">Manual Lampu</span>
                            </NavLink>

                            <NavLink to="/pengaturan" className={({ isActive }) => isActive ? "nav_link active" : "nav_link"}>
                                <i className='bx bx-cog nav_icon'></i>
                                <span className="nav_name">Pengaturan</span>
                            </NavLink>


                        </div>
                    </div>
                    <a href="javascript:void(0)" onClick={this.handleLogout} className="nav_link" title="Logout" id="logout-side">
                        <i className='bx bx-log-out nav_icon'></i>
                        <span className="nav_name">Logout</span>
                    </a>
                </nav>
            </div>
        )
    }
}

export default Sidebar