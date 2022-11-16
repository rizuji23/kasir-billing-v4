import React from "react";
import {Header, ModalUser} from '../header/header';
import Sidebar from "../sidebar/sidebar";

class Menu extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="overview-pemb mb-5">
            <div className="row">
                <div className="col-sm">
                    <div className="d-flex mb-2" id="button_kategori">
                       <div className="p-1">
                            <a href="javascript:void(0)"
                                className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10">Makanan</a>
                        </div>
                        <div className="p-1">
                            <a href="javascript:void(0)"
                                className="btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10">Minuman</a>
                        </div>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="d-flex mb-2 float-end">
                        <div className="p-1">
                            <a href="checkout_menu_only.html"
                                className="btn btn-primary btn-primary-cozy-dark border-r-13 pl-20 pr-20 pt-10 pb-10 position-relative"><img
                                    src="assets/img/icon/shopping-cart.png" alt=""/><span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    <span id="cart_count">0</span>
                                    <span className="visually-hidden">unread messages</span>
                                </span></a>
                        </div>
                        <div className="p-1">
                            <a href="javascript:void(0)"
                                className="btn btn-primary btn-primary-cozy border-r-13 pl-20 pr-20 pt-10 pb-10"
                                id="refresh_page"><img src="assets/img/icon/refresh-ccw.png" alt=""/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4" id="menu-list">

            </div>
        </div>
        )
    }

}

class Menu_Container extends React.Component<any,any> {
    render() {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header/>
                    <Sidebar/>
                    <div className="box-bg">
                        <Menu/>
                    </div>
                </div>
                <ModalUser/>
            </>
        )
    }
}

export default Menu_Container;