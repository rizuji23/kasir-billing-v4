import React, {useEffect, useState } from "react";
import { ipcRenderer } from "electron";

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

class Table_02 extends React.Component<any, any> {
    render() {
        return (
            <li>
                        <span>Table 02</span> = <input type="number" id="table002" placeholder="jam"/> <button
                            id="start02">Start</button>
                        <button id="stop02">Stop</button>
                        <button id="addon02">Addon</button>

                        <br/>
                        <p>Timer: <span id="timer02"></span></p>
                    </li>
        )
    }
}

class Table_03 extends React.Component<any, any> {
    render() {
        return (
            <li>
                        <span>Table 03</span> = <input type="number" id="table003" placeholder="jam"/> <button
                            id="start03">Start</button>
                        <button id="stop03">Stop</button>
                        <button id="addon02">Addon</button>

                        <br/>
                        <p>Timer: <span id="timer03"></span></p>
                    </li>
        )
    }
}

class Table extends React.Component {
    render(){
        return(
            <div>
                <h1 >Testing Timer</h1>
                <ul>
                <React.StrictMode>
                    <Table_01/>
                    <Table_02/>
                    <Table_03/>
                </React.StrictMode>
                </ul>
            </div>
          )
      }
}

export default Table