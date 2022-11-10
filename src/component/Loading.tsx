import React from "react";

class Loading extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            show_loading: false,
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="overlay">
                    <div className="overlay__inner">
                        <div className="overlay__content text-center"><img src="assets/img/logo-login.png" alt=""/>
                            <h3>{this.props.title}</h3>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Loading