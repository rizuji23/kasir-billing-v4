import { session } from "electron";
import React from "react";

class Header extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            nama: sessionStorage.getItem("nama")
        }
    }
    render() {
        return (
            <header className="header body-pd" id="header">

                <div className="header_img" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="assets/img/user.png" alt="" />
                    <p className="header-name">{this.state.nama}</p>
                </div>
            </header>
        )
    }
}

class ModalUser extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    handleLogout() {
        sessionStorage.setItem("username", "");
        sessionStorage.setItem("nama", "");
        sessionStorage.setItem("user", "");

        window.location.href = "/"
    }

    render() {
        return (
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="list-group">
                                <a href="javascript:void(0)" onClick={this.handleLogout} className="list-group-item list-group-item-action"
                                    id="logout">Logout</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export { Header, ModalUser }