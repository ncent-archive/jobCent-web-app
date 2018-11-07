import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";

export default class ChallengeDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="fs-transfer-sheet">
            <div className="transfer-content">
                <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
                    <img src={x} alt=""/>
                </div>
                <div className="not-x-button">
                    <h1 className="challengeName">{this.props.challengeDetails.name}</h1>
                    <div className="headerChallengeImage">
                        <img src={this.props.challengeDetails.imageUrl} className="challengeImage"/>
                    </div>
                    <div className="challengeContent">
                        <h2 className="challengeReward">Total
                            Reward: {this.props.challengeDetails.rewardAmount} Tokens</h2>
                        <p className="challengeDescription">{this.props.challengeDetails.description}</p>
                    </div>
                </div>
            </div>
        </div>;
    }
}
