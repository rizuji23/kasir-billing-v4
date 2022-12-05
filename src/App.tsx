import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from './component/Login'
import Dashboard from './component/Dashboard'
import WaitingList_Container from "./component/WaitingList";
import Member_Container from "./component/member/Member";
import Menu_Container from "./component/menu_makanan/Menu";
import ListMenu_Container from "./component/pengaturan/List_Menu";
import KategoriMenuContainer from "./component/pengaturan/kategori_menu/KategoriMenu";
import KeuanganContainer from "./component/keuangan/Keuangan";
import KeuanganCafeContainer from "./component/keuangan/cafe/KeuanganCafe";
import VoucherContainer from "./component/pengaturan/voucher/Voucher";
import TransaksiShiftContainer from "./component/keuangan/transaksi_shift/TransaksiShift";

class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                    <Route path="/waiting-list" element={<WaitingList_Container />}></Route>
                    <Route path="/member" element={<Member_Container />}></Route>
                    <Route path="/menu-makanan" element={<Menu_Container />}></Route>

                    <Route path="/pengaturan" element={<ListMenu_Container />}></Route>
                    <Route path="/kategori-menu" element={<KategoriMenuContainer />}></Route>
                    <Route path="/voucher" element={<VoucherContainer />}></Route>


                    <Route path="/keuangan" element={<KeuanganContainer />}></Route>
                    <Route path="/keuangan-cafe" element={<KeuanganCafeContainer />}></Route>

                    <Route path="/transaksi-shift" element={<TransaksiShiftContainer />}></Route>

                </Routes>
            </HashRouter>
        )
    }
}

export default App