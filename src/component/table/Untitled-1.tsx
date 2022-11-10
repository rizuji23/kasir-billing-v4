<div className="modal fade " id={'bookingActive' + this.props.table_id} tabIndex={-1} aria-labelledby="bookingLabel" aria-modal="true" role={'dialog'}>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="bookingLabel">Penambahan Form</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="box-booking">
                                <div className="booking-content">
                                    <h5>Setting Table</h5>
                                    <div className="hr-white"></div>
                                    <label  className="label-white mb-2" >Table terpilih</label>
                                    <div className="detail-table">
                                        <p><img src="assets/img/icon/archive.png" alt="" /><span
                                                id="table_ids_active"> {this.props.table_name}</span>
                                        </p>
                                    </div>
                                    <div className="d-flex">
                                        <div className="p-1">
                                            <div className="mt-2">
                                                <div>
                                                    <button id="reset_table" onClick={this.props.stopTimer} className="btn btn-warning">Reset Table</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-1">
                                            <div className="mt-2">
                                                <div>
                                                    <button id="print_struk_billing" className="btn btn-info">Print Struk
                                                        Billing</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="mt-2">Pindah Table</h5>
                                    <div className="hr-white"></div>
                                    <div className="mt-2">
                                        <label >Pilih Meja</label>
                                        <select name=""  onChange={this.props.handlePindah} className="form-control custom-input" id="pilih_meja" dangerouslySetInnerHTML={{__html: this.state.list_table}}>
                                        </select>
                                    </div>
                                    <div className="mt-2  text-end">
                                        <div className="">
                                            <button id="pindah_meja_btn" className="btn btn-primary btn-primary-cozy">Pindah
                                                Meja</button>
                                        </div>
                                    </div>
                                    <div id="info_customer">

                                    </div>
                                </div>
                            </div>
                            <div className="box-booking mt-3">
                                <div className="booking-content">
                                    <h5>Tambah Durasi Table</h5>
                                    <label  className="label-white mb-2 mt-3">Tambah Durasi penyewaan
                                    </label><br/>
                                    <label  className="label-white-regular mb-1">Durasi (Per jam)</label>
                                    <div id="peringatan">

                                    </div>
                                    
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default"><img
                                                src="assets/img/icon/clock2.png" width="20" alt=""/></span>
                                        <input type="number" onChange={this.props.handleJam} className="form-control group-input-custom"
                                            aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                            id="durasi_booking_active"/>
                                    </div>
                                    <label  className="label-white mb-2">Detail harga</label>

                                    <div className="detail-table  mb-3">
                                        <ul dangerouslySetInnerHTML={{__html: this.props.harga_detail}}>
                                        </ul>
                                </div>
                                    <label  className="label-white mb-2">Total harga</label>
                                    <div className="detail-table">
                                    <p><img src="assets/img/icon/rp.png" alt=""/> <span
                                            id="harga_total_text"> {this.props.total_harga}</span>
                                    </p>
                                    <p className="mt-3"><img src="assets/img/icon/clock.png" width="25" alt=""/> <span
                                            id="durasi_total_text">{this.props.jam} Jam</span></p>
                                    </div>
                                    <input type="hidden" id="harga_booking_active"/>
                                    <div className="form-group-2 mt-4">
                                        <select name="" className="form-control custom-input" id="input_setting_blink_active">
                                            <option value="">Pilih Setting Blink</option>
                                            <option value="Iya">Iya</option>
                                            <option value="Tidak">Tidak</option>
                                        </select>
                                    </div>
                                    <div className="text-end mt-2">
                                        <button className="btn btn-primary btn-primary-cozy" id="add_on_send">Tambah</button>
                                    </div>
                                </div>
                            </div>
                            <div className="box-booking mt-3">
                                <div className="booking-content">
                                    <h5>Detail Pesanan</h5>
                                    <hr/>
                                    <p>Tanggal Mulai: <span id="jam_mulai_active">{ this.state.start_time }</span></p>
                                    <ul className="list-group" id="detail_struk_table">
                                        <li className="list-group-item"><small>Nama Pemesan</small> <br/><span
                                                id="nama_pemesan_active"></span> {this.props.name_customer} ({this.props.id_booking})</li>
                                        <li className="list-group-item"><small>List Billing</small> <br/>
                                            <ul>
                                                <div id="list_billing" dangerouslySetInnerHTML={{__html: this.state.list_billing}}></div>
                                                <div id="list_billing_detail"></div>
                                            </ul>
                                        </li>

                                        <li className="list-group-item">
                                            <small>List Menu</small> <br/>
                                            <ul dangerouslySetInnerHTML={{__html: this.state.list_menu}}>
                                                
                                            </ul>
                                        </li>

                                        <li className="list-group-item">
                                        <small>Total Harga Menu:</small><br />
                                            {this.state.detail_pesanan}
                                        </li>
                                    </ul>
                                    <div className="total-all mt-3">
                                        <h6>Total Harga Semua: </h6>
                                        <h4>Rp. <span id="total_struk_active">{this.props.total_harga}</span></h4>
                                    </div>
                                    <div className="box-kembalian mb-3">
                                        <label >Uang Cash</label>
                                        <div className="input-group mt-2">
                                            <span className="input-group-text" id="inputGroup-sizing-default">Rp.</span>
                                            <input type="text" className="form-control group-input-custom"
                                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                id="uang_cash_active"/>
                                        </div>
                                    </div>
                                    <div className="total-all">
                                        <h6>Kembalian: </h6>
                                        <h4>Rp. <span id="kembalian_struk_text">0</span></h4>
                                    </div>
                                </div>

                            </div>
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary btn-primary-cozy-dark"
                                    data-bs-dismiss="modal" id="close-modal-active">Close</button>
                                <button className="btn btn-primary btn-primary-cozy" id="bayar_now">Bayar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>