import React from 'react';
import { Header, ModalUser } from '../header/header';
import Sidebar from '../sidebar/sidebar';
import StokContainer from './Stok';
import NavbarStok from './NavbarStok';
import DataTable from 'react-data-table-component';
import { ipcRenderer } from 'electron';

class List_StokKeluar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
            column: [
                {
                    name: "No",
                    selector: row => row.number,
                    sortable: true,
                },
                {
                    name: "Nama Menu",
                    selector: row => row.nama_menu,
                    sortable: true,
                },
                {
                    name: "Stok Keluar",
                    selector: row => row.stok_keluar,
                    sortable: true,
                },
                {
                    name: "Keterangan",
                    selector: row => row.keterangan,
                },
                {
                    name: "Shift",
                    selector: row => row.shift,
                    sortable: true,
                },
                {
                    name: "Tanggal",
                    selector: row => row.created_at,
                    sortable: true,
                }
            ]
        }

        this.getDataMasuk = this.getDataMasuk.bind(this);
    }

    componentDidMount(): void {
        this.getDataMasuk();
    }

    getDataMasuk() {
        ipcRenderer.invoke("getStokKeluar").then((result) => {
            if (result.response === true) {
                let no = 1;
                result.data.map((el) => {
                    el['number'] = no++;
                });

                this.setState({
                    data: result.data
                });

                console.log(result)

            }
        })
    }

    render(): React.ReactNode {
        return (
            <>
                <NavbarStok />

                <div className="keuangan-list mt-2 mb-5">
                    <div className="card card-custom-dark">
                        <div className="card-header">
                            <div className="d-flex">
                                <div className="p-2 w-100">
                                    <h4>List Stok Masuk</h4>
                                </div>
                                <div className="p-2 me-auto">
                                    <button className="btn btn-primary btn-primary-cozy" >Filter</button>
                                </div>
                                <div className="p-2 me-auto">
                                    <button className="btn btn-primary btn-primary-cozy-dark" >Reset</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <DataTable columns={this.state.column} data={this.state.data} pagination theme="solarized" selectableRowsSingle />
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

class List_StokKeluarContainer extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <>
                <div id="body-pd" className="body-pd">

                    <Sidebar />
                    <div className="box-bg">
                        <List_StokKeluar />
                    </div>
                </div>
                <ModalUser />
            </>
        )
    }
}

export default List_StokKeluarContainer;