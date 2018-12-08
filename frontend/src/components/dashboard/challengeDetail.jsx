import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import ncentLogo from "../../img/logo.png";

const convertToDays = dateString => {
    const date = Date.parse(dateString);
    const now = Date.now();

    return (date - now)/(1000*60*60*24);
};

export default class ChallengeDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            referralCode: "",
            tokensPerReferral: 1
        };

        this.handleSetTokensPerReferral = this.handleSetTokensPerReferral.bind(this);
    }

    componentWillMount() {
        this.props.getReferralCode(this.props.currentUser.uuid, this.props.challengeDetails.uuid)
            .then(referralCodeResp => {
                this.setState({

                    referralCode: referralCodeResp.challengeUserData.data.challengeUser.referralCode,
                    tokensPerReferral: referralCodeResp.challengeUserData.data.challengeUser.tokensPerReferral


                });
            });

    }

    async handleSetTokensPerReferral(e) {
        e.preventDefault();
        const challengeUuid = this.props.challengeDetails.uuid;
        const userUuid = this.props.currentUser.uuid;
        const tokensPerReferral = this.state.tokensPerReferral;
        console.log(tokensPerReferral);
        await this.props.setTokensPerReferral(userUuid, challengeUuid, tokensPerReferral);
    }


    render() {
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
                    <img src={x} alt=""/>
                </div>
                <div className="not-x-button">
                    <h1 className="challengeName">{this.props.challengeDetails.name}</h1>
                    <h1 className="challengeName">{this.props.challengeDetails.company}</h1>
                    <div className="headerChallengeImage">
                        <img src={this.props.challengeDetails.imageUrl || ncentLogo} className="challengeImage"/>
                    </div>
                    <div className="challengeContent">
                        <h2 className="challengeReward">Total Reward: ${this.props.challengeDetails.rewardAmount}</h2>
                        <p className="challengeDescription">Description: {this.props.challengeDetails.description}</p>
                        <h2>Your balance: {this.props.challengeBalance} jobCent(s)</h2>
                        <h2>{Math.floor(convertToDays(this.props.challengeDetails.expiration))} days remaining!</h2>
                        <h2>Your referral code for this challenge: {this.state.referralCode}</h2>
                        <form className="tokensPerReferralForm" autoComplete="off" spellCheck="true" noValidate="true" onSubmit={this.handleSetTokensPerReferral}>
                            <div className="enter-email">
                                <div className="recipients">
                                    <div className="token-list">
                                        <input className="transfer-input-field" autoComplete="off" spellCheck="false"
                                               placeholder="Total jobCents to send  per referral code redemption (Default of 1)"
                                               autoCorrect="false" autoCapitalize="off" type="text"
                                               value={this.state.tokensPerReferral}
                                               onChange={(e) => this.setState({tokensPerReferral: e.currentTarget.value})}/>
                                    </div>
                                </div>
                                <div className="anchor"/>
                                <div className="error-box"/>
                            </div>
                            <button className="theme-button transfer-button">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>;
    }
}