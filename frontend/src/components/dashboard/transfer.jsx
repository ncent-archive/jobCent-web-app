import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import ncentLogo from "../../img/logo.png";


export default class Transfer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageLoadErrBool: true
        }

        this.imgLoadError = this.imgLoadError.bind(this);
    }

    componentWillMount() {
        document.title = "jobCent - Transfer";
        window.history.pushState({}, document.title, window.location.href);
    }

    componentWillUnmount() {
        this.props.removeURLParams();
        this.props.clearErrorMessage();
    }

    imgLoadError(e) {
        if (this.state.imageLoadErrBool) {
            this.setState({ imageLoadErrBool: false });
            e.target.src = ncentLogo;
        }
    }

    render() {
        let close = "";
        if (this.props.closing) {
            close += " fadeOutAnimation";
        }
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.closeWithDelay}>
                    <img src={x} alt=""/>
                </div>
                <form autoComplete="off" className={"transferForm" + close} spellCheck="true" noValidate="true" onSubmit={this.props.handleTransfer}>
                    <div className="initiate-transfer">
                        <div className="errorMessage"><span>{this.props.errorMessage}</span></div>
                        <div className="display-amount-fixed">
                            <div className="bottom-margin">
                                <img className="logoImg" src={this.props.imageUrl || ncentLogo} alt="ncent logo" 
                                    onError={this.imgLoadError}
                                />
                            </div>
                        </div>
                        <div className="enter-email">
                            <label htmlFor="">To:</label>
                            <div className="recipients">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Email address" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("toAddress")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <div className="enter-email">
                            <label htmlFor="">Amount:</label>
                            <div className="recipients">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                           placeholder="Number of jobCents to Send" autoCorrect="false" autoCapitalize="off"
                                           type="text" onChange={this.props.update("numShares")}/>
                                </div>
                            </div>
                            <div className="anchor"/>
                            <div className="error-box"/>
                        </div>
                        <button className="theme-button transfer-button">
                            Send jobCents
                        </button>
                        <p className="disclaimerText">*Please note that rewards can only be redeemed if you have a jobCent balance greater than 0 for the challenge you get hired for.</p>
                    </div>
                </form>
            </div>
        </div>;
    }
}
