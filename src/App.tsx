import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from './component/Login'
import Dashboard from './component/Dashboard'
import WaitingList_Container from "./component/WaitingList";
import Member_Container from "./component/member/Member";

class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Login/>}></Route>
                    <Route path="/dashboard" element={<Dashboard/>}></Route>
                    <Route path="/waiting-list" element={<WaitingList_Container/>}></Route>
                    <Route path="/member" element={<Member_Container/>}></Route>

                </Routes>
            </HashRouter>
        )
    }
}

export default App