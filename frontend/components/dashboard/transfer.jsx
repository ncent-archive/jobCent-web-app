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
            {/* <i className="close-button-icon" /> */}
            <img src={x} alt=""/>
          </div>
          <form autoComplete="off" spellCheck="true" noValidate="true" onSubmit={this.props.handleTransfer}>
            <div className="initiate-transfer">
              <div className="display-amount-fixed">
                <div className="bottom-margin">
                  <div className="display-amount-input">
                    <div className="currency-symbol">₿</div>
                    <input placeholder="0" autoComplete="off" maxLength="5" type="tel" className="whole-amount-value" onChange={this.props.update("amount")} />
                    {/* <input type="tel" name="fractional-amount-value" autocomplete="off" tabindex="-1" placeholder="00" maxlength="2" id="ember1284" class=""/> */}
                  </div>
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
                Send jobCent
              </button>
            </div>
          </form>
        </div>
      </div>;
  }
}
