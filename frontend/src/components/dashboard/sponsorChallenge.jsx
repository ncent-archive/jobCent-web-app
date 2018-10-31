import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";

export default class Transfer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
                    <img src={x} alt=""/>
                </div>
                <form autoComplete="off" spellCheck="true" noValidate="true" onSubmit={this.props.createChallenge}>
                    <div className="initiate-transfer">
                        <div className="errorMessage"><span>{this.props.errorMessage}</span></div>
                        <div className="display-amount-fixed">
                            <div className="bottom-margin">
                                <div className="currency-symbol">Sponsor a jobCent Program Here!</div>
                            </div>
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false" placeholder="Job Title" autoCorrect="false" autoCapitalize="off" type="text" onChange={this.props.update("challengeTitle")} />
                                </div>
                            </div>
                            <div className="anchor" />
                            <div className="error-box" />
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false" placeholder="Job Description" autoCorrect="false" autoCapitalize="off" type="text" onChange={this.props.update("description")} />
                                </div>
                            </div>
                            <div className="anchor" />
                            <div className="error-box" />
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false" placeholder="Maximum Tokens for Reward Distribution" autoCorrect="false" autoCapitalize="off" type="text" onChange={this.props.update("rewardAmount")} />
                                </div>
                            </div>
                            <div className="anchor" />
                            <div className="error-box" />
                        </div>
                        <div className="enter-email">
                            <div className="recipiens">
                                <div className="token-list">
                                    <input className="transfer-input-field" autoComplete="off" spellCheck="false" placeholder="Image Link to Display for the Posting" autoCorrect="false" autoCapitalize="off" type="text" onChange={this.props.update("imageUrl")} />
                                </div>
                            </div>
                            <div className="anchor" />
                            <div className="error-box" />
                        </div>
                        <button className="theme-button transfer-button">
                            Create Challenge
                        </button>
                    </div>
                </form>
            </div>
        </div>;
    }
}
