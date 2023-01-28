import React from "react";
import { ToastContainer } from "react-toastify";

class LoginAdmin extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <div className="box-login-admin" style={{ display: this.props.visible }}>
                    <div className="box-login-content">
                        <div className="box-login-title mt-1">
                            <h3>Login Admin</h3>
                        </div>
                        <hr />
                        {this.props.error && <div className="alert alert-danger">
                            Username atau Password salah!
                        </div>}
                        <div className="form-group">
                            <label htmlFor="">Username</label>
                            <input type="text" onChange={this.props.handleUsername} className="form-control custom-input" />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="">Password</label>
                            <input type="password" onChange={this.props.handlePassword} className="form-control custom-input" />
                        </div>

                        <div className="d-grid mt-3">
                            <button className="btn btn-primary btn-primary-cozy" onClick={this.props.handleLogin}>Login</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default LoginAdmin;