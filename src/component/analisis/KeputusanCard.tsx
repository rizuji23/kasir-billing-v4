import React from 'react';

class KeputusanCard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="card card-custom-dark-light mt-3 pt-2">
                    <div className="card-header pt-0" data-bs-toggle="collapse" data-bs-target={`#keputusan-${this.props.id}`} aria-expanded="false" aria-controls="keputusan">
                        Keputusan
                    </div>
                    <div className="collapse" id={`keputusan-${this.props.id}`}>
                        <div className='card-body'>
                            <div className="alert alert-info" role="alert">
                                <strong>Positive: </strong>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam beatae error iure enim nulla exercitationem voluptatem. Sapiente, dolore! Earum culpa sint, tempora architecto obcaecati sunt quos quisquam quae possimus deserunt.</p>
                            </div>
                            <div className="alert alert-danger" role="alert">
                                <strong>Negative: </strong>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam beatae error iure enim nulla exercitationem voluptatem. Sapiente, dolore! Earum culpa sint, tempora architecto obcaecati sunt quos quisquam quae possimus deserunt.</p>
                            </div>
                            <p className='keputusan-subs'><span className='text-danger'>*</span> Keputusan ini dibuat oleh sistem berdasarkan data yang ada.</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default KeputusanCard;