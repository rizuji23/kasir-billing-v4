import React from "react";
import {Header, ModalUser} from './header/header';
import Sidebar from "./sidebar/sidebar";
import DataTable, { createTheme } from 'react-data-table-component';
import { ipcRenderer } from "electron";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';

createTheme('solarized', {
    background: {
        default: '#1A1B1F'
    },
    text: {
        primary: '#fff',
        secondary: '#fff'
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#fff',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: '#fff',
    },
}, 'dark')

async function deleteWaiting(data) {
    return new Promise(res => {
        setTimeout(() => {
            ipcRenderer.invoke("waitinglist", false, false, true, data, []).then((result) => {
                console.log(result)
                res(result)
            })
        }, 1000)
    })
}

function showLoading(current, max) {
    if (current === max) {
        toast.success('Waiting List Sudah Dihapus')
        return true;
    }
}

class WaitingList extends React.Component<any,any> {
    constructor(props) {
        super(props)
    
        this.state = {
            columns: [
                {
                    name: 'No',
                    selector: row => row.number,
                    sortable: true,
                },
                {
                    name: 'Nama',
                    selector: row => row.nama_waiting,
                    sortable: true,
                },
                {
                    name: 'Table',
                    selector: row => row.table_waiting,
                    sortable: true,
                },

            ],
            data: [
                
            ],
            name: '',
            list_table: '',
            disabled: true,
            table_id: '',
            id_waiting_arr: [],
            deletes: true,
            name_empty: '',
        }

        this.handleName = this.handleName.bind(this);
        this.handleTable = this.handleTable.bind(this);
        this.addWaiting = this.addWaiting.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.checkForm = this.checkForm.bind(this);
    }

    getData() {
        ipcRenderer.invoke("waitinglist", true, false, false, '', []).then((result) => {
            var i = 1;
            if (result.response !== false){
                result.data.map(elem => elem['number'] = i++);
                this.setState({
                    data: result.data
                })
            } else {
                toast.error("Data Waiting List Kosong!")
                this.setState({
                    data: []
                })
            }
            
        })
    }

    handleSelected(selectedRow) {
        if (selectedRow.selectedCount !== 0) {
            const data = selectedRow.selectedRows;
            var data_id = Array<string>();
            data.forEach(element => {
                data_id.push(element.id_waiting)
            });
            this.setState({id_waiting_arr: data_id, deletes: false})
        } else {
            this.setState({id_waiting_arr: [], deletes: true})
        }
    }

    handleDelete() {
        swal({
            title: "Apa kamu yakin?",
            text: "Data akan dihapus!",
            icon: "warning",
            buttons: ["Batal", true],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                console.log(this.state.id_waiting_arr)
                const data_arr = this.state.id_waiting_arr;
                let current = 1;
                data_arr.map((val, i) => deleteWaiting(val).then(() => {
                    const del = showLoading(current++, data_arr.length);
                    if (del) {
                        this.getData();
                        this.clearState();
                    }
                }))
            }
          });
    }

    handleName(e) {
        if (e.target.value.length === 0) {
            this.checkForm()
            this.setState({disabled: true, name: ''});
        } else {
            this.checkForm()
            this.setState({disabled: false, name: e.target.value});
        }
    }

    handleTable(e) {
        if (e.target.value.length === 0) {
            this.checkForm()
            this.setState({disabled: true});
        } else {
            this.checkForm()
            this.setState({disabled: false, table_id: e.target.value});
        }
    }

    getAllTable():void {
        ipcRenderer.invoke("getAllTable", true).then((result) => {
            var data_list = '';
            result.data.forEach(element => {
                data_list += `<option value='${element.nama_table}'>${element.nama_table}</option>`;
            });

            this.setState({
                list_table:data_list
            })
        })
    }

    clearState() {
        this.setState({
            name: '',
            disabled: true,
            table_id: '',
            id_waiting_arr: [],
            deletes: true,
        })
    }

    checkForm() {
        if (this.state.table_id.length === 0 || this.state.name.length === 0) {
            this.setState({disabled: true});
        } else {
            this.setState({disabled: false})
        }
    }

    addWaiting() {
        if (this.state.name !== '' || this.state.table_id !== ''){
            const data_waiting = {
                nama_waiting: this.state.name,
                table_waiting: this.state.table_id,
            }
    
            ipcRenderer.invoke("waitinglist", false, true, false, '', data_waiting).then((result) => {
                if (result.response === true) {
                    toast.success('Waiting List Berhasil Ditambah...');
                    this.clearState()
                    this.getData()
                }
            })
        } else {
            toast.error("Semua harus diinput!.")
        }
        
    }

    componentDidMount(): void {
        this.getData();
        this.getAllTable();
    }

    render() {
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
                    <div className="overview-pemb mb-5">
                        <div className="bg-dark box-dark">
                            <h5 className="text-center">Tambah Waiting List</h5>
                            <div className="box-booking mt-3">
                                <div className="booking-content">
                                    <div className="row">
                                        <div className="col-lg mb-2">
                                            <div className="form-group">
                                                <label>Nama</label>
                                                <input type="text" onChange={this.handleName} value={this.state.name} className="form-control custom-input" />
                                            </div>
                                            <div className="mt-3">
                                                <label>Table</label>
                                                <select className="form-control custom-input mt-2" onChange={this.handleTable} dangerouslySetInnerHTML={{__html: this.state.list_table}} >
                                                </select>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="text-end mt-3">
                                <button className="btn btn-primary btn-primary-cozy" onClick={this.addWaiting} disabled={this.state.disabled} type="button" id="buat_waiting">Buat
                                    Sekarang</button>

                            </div>

                        </div>
                        <div className="keuangan-list mt-2 mb-5">
                            <div className="card card-custom-dark">
                                <div className="card-header">
                                    <div className="d-flex">
                                        <div className="p-2 w-100">
                                            <h4>List Waiting</h4>
                                        </div>
                                        <div className="p-2">
                                            <button className="btn btn-danger-cozy" onClick={this.handleDelete} disabled={this.state.deletes}>Hapus</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTable columns={this.state.columns} selectableRows onSelectedRowsChange={this.handleSelected} data={this.state.data} pagination  theme="solarized" fixedHeader/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </>
        )
    }
}

class WaitingList_Container extends React.Component<any,any> {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <>
                <div id="body-pd" className="body-pd">
                    <Header/>
                    <Sidebar/>
                    <div className="box-bg">
                        <WaitingList/>
                    </div>
                </div>
                <ModalUser/>
            </>
        )
    }
}

export default WaitingList_Container;