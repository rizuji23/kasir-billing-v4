import React from "react";
import {Header, ModalUser} from '../header/header';
import Sidebar from "../sidebar/sidebar";
import { ipcRenderer } from "electron";
import DotAdded from "../../system/DotAdded";

class MenuBox extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            data_menu: []
        }
    }



    // getMenu() {
    //     ipcRenderer.invoke("menu", true, false, false, false, []).then((result) => {
    //         if (result.response === true) {
    //             this.setState({data_menu: result.data});
    //             console.log(result)
    //         }
    //     });
    // }

    render(): React.ReactNode {
        const dot = new DotAdded();
        return (
           <>
            <div className="col" key={this.props.value.toString()}>
                <div className="card card-custom-dark h-100 card-table">
                        <div className="menu-img">
                            <img src={`assets/img/menu/${this.props.value.img_file}`} className="img-menu" alt="..."/>
                        </div>
                            <div className="card-body">
                                <div className="container-biliiard">
                                    <span className="badge rounded-pill text-bg-light mb-2">{this.props.value.kategori_menu[0].nama_kategori}</span>
                                    <h4>{this.props.value.nama_menu}</h4>
                                    <div className="d-flex mt-2">
                                        <div className="p-1">
                                            <img src="assets/img/icon/rp_2.png" alt=""/>
                                        </div>
                                        <div className="p-1">
                                            <p>Rp. {dot.parse(this.props.value.harga_menu)}</p>
                                        </div>
                                    </div>

                                    <div className="d-grid mt-2">
                                        <button className="btn btn-primary btn-primary-cozy btn-menu">Tambah Keranjang</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
           </>
        )
    }
}

export default MenuBox