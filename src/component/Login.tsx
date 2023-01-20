import { ipcRenderer } from 'electron';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends React.Component<any, any> {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: "",
            isLogging: false,
            error: "",
            isError: false,
            disabled: false
        }


        this.handleUsername = this.handleUsername.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.clearState = this.clearState.bind(this)
        this.getShift = this.getShift.bind(this)
    }

    clearState() {
        this.setState({
            username: "",
            password: "",
            isLogging: false,
            error: "",
            isError: false,
            disabled: false
        })
    }

    componentDidMount(): void {
        this.getShift();
    }

    async getShift() {
        await ipcRenderer.invoke("getShift", "Pagi").then((result) => {
            localStorage.setItem("shift_pagi", `{"start_jam": "${result.data[0].start_jam}", "end_jam": "${result.data[0].end_jam}"}`);
        });

        await ipcRenderer.invoke("getShift", "Malam").then((result) => {
            localStorage.setItem("shift_malam", `{"start_jam": "${result.data[0].start_jam}", "end_jam": "${result.data[0].end_jam}"}`);
        })
    }

    handleUsername(e) {
        if (e.target.value === '') {
            this.setState({ isError: true, error: "Username harus diisi", username: e.target.value });

        } else {
            this.setState({ username: e.target.value, isError: false })
        }
    }

    handlePassword(e) {
        if (e.target.value === '') {
            this.setState({ isError: true, error: "Password harus diisi", password: e.target.value });
        } else {
            this.setState({ password: e.target.value, isError: false })
        }
    }

    handleSubmit(e) {
        const username = this.state.username;
        const password = this.state.password;

        ipcRenderer.invoke("login", username, password).then((result) => {
            console.log(result.response)
            this.setState({ 'disabled': true });
            if (result.response === true) {
                sessionStorage.setItem("user", result.data[0].id_user);
                sessionStorage.setItem("username", result.data[0].username);
                sessionStorage.setItem("nama", result.data[0].nama);

                this.setState({ isLogging: true });

            } else {
                this.setState({ isError: true, error: "Username atau Password salah" });
                setTimeout(() => {
                    if (this.state.isError) {
                        toast(this.state.error)
                        this.setState({ 'disabled': false });
                        this.clearState();
                    }
                }, 1000)
            }
        })
    }

    render() {
        let alert_error: any;
        const error = this.state.isError

        if (this.state.isLogging) {
            return <Navigate to="/dashboard" replace={true} />
        }

        return (

            <div className="login-box">
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <div className="login-logo text-center mb-3">
                    <img src="assets/img/logo-login.png" alt="" />
                </div>
                <div className="card card-custom-dark">
                    <div className="card-body">
                        <div className="title-report text-center">
                            <h4>Login</h4>
                        </div>

                        <div className="pl-20 pr-20">

                            <div className="">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" className="form-control custom-input" autoFocus value={this.state.username} onChange={this.handleUsername} />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Password</label>
                                    <input type="password" className="form-control custom-input" value={this.state.password} onChange={this.handlePassword} />
                                </div>

                            </div>
                            <div className="d-grid mt-3">
                                <button id="login"
                                    className="btn btn-primary btn-primary-cozy d-block" onClick={this.handleSubmit} disabled={this.state.disabled}
                                >Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login