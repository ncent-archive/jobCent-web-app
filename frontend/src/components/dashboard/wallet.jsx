import React from "react";
import x from "../../img/x.png";

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }


  }

  componentWillMount() {
    document.title = "jobCent - Wallet";
    window.history.pushState({}, document.title, window.location.href);
  }

  componentWillUnmount() {
    this.props.removeURLParams();
  }

  render() {
    let close = "";
    if (this.props.closing) {
      close += " fadeOutAnimation";
    }
    return (
      <div className="fs-transfer-sheet">
        <div className="transfer-content">
          <div title="jobCents" className="close-button" onClick={this.props.closeWithDelay}>
            <img src={x} alt="" />
          </div>
          <div className={"mainWalletContainer" + close}>
            Your current wallet
          </div>
        </div>
      </div>
    )
  }
}

export default Wallet;