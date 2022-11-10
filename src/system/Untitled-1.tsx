<div className="modal fade" id={"booking" + this.props.table_id} tabIndex={-1} aria-labelledby="bookingLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="bookingLabel">Booking Form</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" data-bs-dismiss="modal" id="close-modal" className="btn btn-primary btn-primary-cozy-dark"
                            >Close</button>
                        <button className="btn btn-primary btn-primary-cozy" onClick={this.props.startTimer} disabled={this.props.disableSubmit}>Booking Sekarang</button>
                    </div>
    
                </div>
            </div>
        </div>