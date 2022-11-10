import React, {useEffect, useState } from "react";

class Sidebar extends React.Component<any, any> {

    render() {
        return (
            <div className="l-navbar show-sidebar" id="nav-bar">
        <nav className="nav">
            <div>
                <a href="javascript:void(0)" className="nav_logo">
                    <span className="nav_logo-name"><img src="assets/img/logo.png" alt=""/></span>
                </a>
                <div className="nav_list">
                    <a href="javascript:void(0)" className="nav_link active" title="Home">
                        <i className='bx bx-home-alt nav_icon'></i>
                        <span className="nav_name">Home</span>
                    </a>
                    <a href="javascript:void(0)" className="nav_link" title="Waiting List">
                        <i className='bx bx-list-plus nav_icon'></i>
                        <span className="nav_name">Waiting List</span>
                    </a>
                    <a href="javascript:void(0)" className="nav_link" title="Add Member">
                        <i className='bx bx-user-plus nav_icon'></i>
                        <span className="nav_name">Add Member</span>
                    </a>

                    <a href="javascript:void(0)" className="nav_link" title="Menu Makanan">
                        <i className='bx bx-bowl-rice nav_icon'></i>
                        <span className="nav_name">Menu Makanan</span>
                    </a>
                    <a href="javascript:void(0)" className="nav_link" title="Menu Cafe">
                        <i className='bx bx-baguette nav_icon'></i>
                        <span className="nav_name">Menu Cafe</span>
                    </a>
                    <a href="javascript:void(0)" className="nav_link" title="Manual">
                        <i className='bx bx-desktop nav_icon'></i>
                        <span className="nav_name">Manual Lampu</span>
                    </a>

                    <a href="javascript:void(0)" className="nav_link" title="Pengaturan">
                        <i className='bx bx-cog nav_icon'></i>
                        <span className="nav_name">Pengaturan</span>
                    </a>
                </div>
            </div>
            <a href="javascript:void(0)" className="nav_link" title="Logout" id="logout-side">
                <i className='bx bx-log-out nav_icon'></i>
                <span className="nav_name">Logout</span>
            </a>
        </nav>
    </div>
        )
    }
}

export default Sidebar