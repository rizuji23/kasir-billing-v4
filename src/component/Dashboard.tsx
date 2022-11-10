import React, {useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import {Header, ModalUser} from './header/header';
import Sidebar from "./sidebar/sidebar";
import Home from './Home';

class Table_01 extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            timer: "",
            jam: "",
            disabled: false
        }

        this.handleJam = this.handleJam.bind(this)
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.getTimeString = this.getTimeString.bind(this)
    }
    

    handleJam(e) {
        this.setState({jam: e.target.value})
    }

    startTimer(): void {
        if (this.state.jam != '') {
            const durasi_minute = this.state.jam * 60;
            const minutetoms = durasi_minute * 60000;
    
            ipcRenderer.invoke("start", "table001", minutetoms, 0, true, false).then(() => {
                console.log("start 01 is created");
                this.setState({disabled: true})
            })
        } else {
            console.log("table 01 error")
        }
        
    }

    stopTimer(): void {
        ipcRenderer.invoke("start", "table001", 0, 0, true, true).then(() => {
            console.log("stop 01 is done")
            this.setState({disabled: false})
        })
    }

    componentDidMount(): void {
        setInterval(() => {
            this.getTimeString()
        }, 1000)
    }

    getTimeString(): void {
        ipcRenderer.on("table001", (event, msg) => {
            this.setState({timer: msg.data})
            if (msg.reponse === true) {
                this.setState({disabled: true})
            } else {
                this.setState({disabled: true})
            }
        })
    }

    render() {
        return (
            <li>
                        <span>Table 01</span> = <input type="number" onChange={this.handleJam} id="table001" placeholder="jam"/> <button
                            id="start01" onClick={this.startTimer} disabled={this.state.disabled}>Start</button>
                        <button id="stop01" onClick={this.stopTimer}>Stop</button>
                        <button id="addon01">Addon</button>
                        <br/>
                        <p>Timer: <span id="timer01">{this.state.timer}</span></p>
                    </li>
        )
    }
}

class Dashboard extends React.Component {
    render(){
        return(
            <React.StrictMode>
                <div id="body-pd" className="body-pd">
                    <Header/>
                    <Sidebar/>
                    <div className="box-bg">
                        <Home/>
                    </div>
                </div>
                <ModalUser/>
            </React.StrictMode>

          )
      }
}

export default Dashboard