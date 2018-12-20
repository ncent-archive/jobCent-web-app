import React, { Component } from "react";
import "../../scss/components/session.css";

class SessionForm extends React.Component {
  constructor(props) {
    super(props);

    const search = props.location.search; // get ?email=foo@bar.com
    const params = new URLSearchParams(search);
    const emailarg = params.get("email");
    this.state = {
      email: emailarg || "",
      code: "",
      otpReq: true,
      formType: "signup",
      password: "",
      confirmPassword: "",
      errorMessage: ""
    };


    this.returnToSignUp = this.returnToSignUp.bind(this);
    this.enterKey = this.enterKey.bind(this);
  }

  update(input) {
    return e =>
      this.setState({
        [input]: e.currentTarget.value
      });
  }

  componentWillMount() {
    this.props.clearErrors();
    let currentForm = window.location.pathname.slice(1);
    this.setState({ formType: currentForm });
  }

  componentDidMount() {
    document.getElementById("textEmail").value = this.state.email;
  }

  componentWillReceiveProps() {
    document.getElementById("textEmail").value = "";
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log("handleSubmit in session_form.jsx");
    const processForm = this.state.formType === "signup" ? this.props.signup : this.props.login;
    const user = Object.assign({}, this.state);

    if (this.state.formType === "signup") {
      if (this.state.email.length === 0 ||
      this.state.password.length === 0 ||
      this.state.confirmPassword.length === 0) {
        this.setState({ errorMessage: "Please fill in all fields." });
        return;
      } else if (!this.state.email.match(/[^@]+@\w+\.\w+((\.\w+)(?!\1\.{2,)*?)*/gim)) {
        this.setState({ errorMessage: "Please enter a valid email."})
        return;
      } else if (this.state.password !== this.state.confirmPassword) {
        this.setState({ errorMessage: "Passwords don't match." });
        return;
      } else {
        this.setState({ errorMessage: "" });
      }
    }

    console.log("state being sent to signup func is", this.state);


    // processForm(user).then(user => {
      //   if (this.state.formType === "signup") {
        //     document.getElementById("text").value = "";
        //     this.setState({ formType: "login" });
      //   }
      // });
  };
      
  enterKey(e) {
    // console.log(e.target);
    // if (e.key === "Enter") {
    //   this.handleSubmit(e);
    // }
  }

  returnToSignUp() {
    this.setState({
        formType: "signup"
    });
  }

  render() {
    if (this.state.formType === "signup") {
      return (
        <div className="signup-form">
          <div className="signup-component">
            <div />
            <section className="flex-container">
              <div className="login-container">
                <h1 className="step-title">Sign up for jobCent</h1>
                <span className="errorMessage">{this.state.errorMessage}</span>

                <form
                  autoComplete="off"
                  spellCheck="true"
                  noValidate="true"
                  className="login-form"
                  onSubmit={this.handleSubmit}
                >
                  <div className="field">
                    <input
                      id="textEmail"
                      type="text"
                      aria-label="Enter your email"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Email address"
                      onChange={this.update("email")}
                    />
                  </div>
                  <div className="field">
                    <input
                      id="textPassword"
                      type="text"
                      aria-label="Enter your password"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Password"
                      onChange={this.update("password")}
                      type="password"
                    />
                  </div>
                  <div className="field">
                    <input
                      id="textConfirmPassword"
                      type="text"
                      aria-label="Confirm your password"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Confirm Password"
                      onChange={this.update("confirmPassword")}
                      type="password"
                      onKeyDown={this.enterKey}
                    />
                  </div>
                  <div className="alias-submit">
                    <div className="submit-button-component ">
                      <button
                        type="submit"
                        aria-label="Request Sign In Code"
                        className="theme-button"
                      >
                        Request Sign In Code
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                </form>
              </div>
            </section>
            <div className="modal-manager ">
              <div className="modal-overlay " />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="signup-form">
          <div className="signup-component">
            <div />
            <section className="flex-container">
              <div className="login-container">
                <h1 className="step-title">
                  {this.props.errors.length === 0
                    ? `We emailed a code to ${this.state.email}`
                    : 'There was an error. Please try again'}
                </h1>

                <form
                  autoComplete="off"
                  spellCheck="true"
                  noValidate="true"
                  className="login-form"
                  onSubmit={this.handleSubmit}
                >
                  <div className="field">
                    <input
                      id="text"
                      type="text"
                      aria-label="confirmation code"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Confirmation Code"
                      onChange={this.update("code")}
                    />
                  </div>

                  <div className="alias-submit">
                    <div className="submit-button-component ">
                      <button
                        type="submit"
                        aria-label="Request Sign In Code"
                        className="theme-button"
                      >
                        Sign In
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                </form>
                <span className="returnToSignup">Wrong email address? Click <a className="signupLink" onClick={this.returnToSignUp}>here</a> to start over</span>
              </div>
            </section>
            <div className="modal-manager ">
              <div className="modal-overlay " />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default SessionForm;
