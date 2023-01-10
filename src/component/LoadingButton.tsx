import React from "react";

class LoadingButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                {
                    this.props.loading === true ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <></>
                }
            </>
        )
    }
}

export default LoadingButton;