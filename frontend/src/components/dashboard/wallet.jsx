import React from "react";
import x from "../../img/x.png";

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }


  }

  render() {
    return (
      <div title="jobCents" className="close-button" onClick={this.props.handleInput("formType")}>
        <img src={x} alt="" />
      </div>
    )
  }
}

export default Wallet;