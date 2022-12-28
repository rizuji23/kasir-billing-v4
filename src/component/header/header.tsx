import React from "react";

class Header extends React.Component<any, any> {
    render() {
        return (
            <header className="header body-pd" id="header">

                <div className="header_img" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="assets/img/user.png" alt="" />
                    <p className="header-name">Aye Shabira</p>
                </div>
            </header>
        )
    }
}

class ModalUser extends React.Component<any, any> {
    render() {
        return (
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Profile</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="list-group">
                                <a href="updateProfile.html" className="list-group-item list-group-item-action">Edit Profit</a>
                                <a href="#" className="list-group-item list-group-item-action"
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