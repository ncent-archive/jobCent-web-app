import React from "react";
import "../../scss/components/transfer.css";
import x from "../../img/x.png";
import ncentLogo from "../../img/logo.png";


export default class Transfer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="fs-transfer-sheet">
        <div className="transfer-content">
          <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
            {/* <i className="close-button-icon" /> */}
            <img src={x} alt=""/>
          </div>
          <form autoComplete="off" spellCheck="true" noValidate="true" onSubmit={this.props.handleTransfer}>
            <div className="initiate-transfer">
              <div className="display-amount-fixed">
                <div className="bottom-margin">
                    <img className="logoImg" src={ncentLogo} alt="ncent logo" />
                </div>
              </div>
              <div className="enter-email">
                <label htmlFor="">To:</label>
                <div className="recipiens">
                  <div className="token-list">
                    <input className="transfer-input-field" autoComplete="off" spellCheck="false" placeholder="Email address" autoCorrect="false" autoCapitalize="off" type="text" onChange={this.props.update("to")} />
                  </div>
                </div>
                <div className="anchor" />
                <div className="error-box" />
              </div>
              <button className="theme-button transfer-button">
                Send {this.props.tokenName}
              </button>
            </div>
          </form>
        </div>
      </div>;
  }
}
