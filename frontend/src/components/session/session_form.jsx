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
      emailLogin: "",
      passwordLogin: "",
      errorMessage: "",
      codeMessage: ""
    };


    this.switchToSignUp = this.switchToSignUp.bind(this);
    this.enterKey = this.enterKey.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.switchToLogin = this.switchToLogin.bind(this);
    this.clearErrorMsg = this.clearErrorMsg.bind(this);
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
    setTimeout(() => {this.updateTitle()});
  }

  componentDidMount() {
    if (this.state.formType === "signup") {
      document.getElementById("textEmail").value = this.state.email;
    }
  }

  componentWillReceiveProps() {
    if (this.state.formType === "signup") {
      // document.getElementById("textEmail").value = "";
    }
  }

  updateTitle() {
    document.title = `jobCent - ${this.state.formType === "login" ? "Log in" : "Sign Up"}`;
  }

  clearErrorMsg() {
    this.setState({ errorMessage: "" });
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log("handleSubmit in session_form.jsx");
    this.setState({ errorMessage: ""});
    this.props.clearErrors();
    // const processForm = this.state.formType === "signup" ? this.props.signup : this.props.login;
    const user = Object.assign({}, this.state);

    //              Traditional User/Pass Login
    // if (this.state.formType === "signup") {
    //   if (this.state.email.length === 0 ||
    //   this.state.password.length === 0 ||
    //   this.state.confirmPassword.length === 0) {
    //     this.setState({ errorMessage: "Please fill in all fields." });
    //     return;
    //   } else if (!this.state.email.match(/[^@]+@\w+\.\w+((\.\w+)(?!\1\.{2,)*?)*/gim)) {
    //     this.setState({ errorMessage: "Please enter a valid email."})
    //     return;
    //   } else if (this.state.password !== this.state.confirmPassword) {
    //     this.setState({ errorMessage: "Passwords don't match." });
    //     return;
    //   } else {
    //     this.setState({ errorMessage: "" });
    //     console.log("in session_form.jsx, state being sent to signup func is", this.state);
    //     this.props.signup(user).then(res => {
    //       console.log("in session_form.jsx, signup function returned, user returned is", res);
    //       if (res.error) {
    //         this.setState({ errorMessage: res.error });
    //         return;
    //       } else {
    //         console.log("else statement in signup in session_form.js, formType is", this.state.formType);
    //         if (this.state.formType === "signup") {
    //           this.setState({ formType: "login" });
    //             this.props.history.push("/login");
    //             this.updateTitle();
    //         }
    //       }
    //     }).catch(err => {
    //       this.setState({ errorMessage: "There was an error. Please try again."})
    //     });
    //   }
    // } else {
    //   if (this.state.emailLogin.length === 0 || this.state.passwordLogin.length === 0) {
    //     this.setState({ errorMessage: "Please fill in all fields." });
    //     return;
    //   } else if (!this.state.emailLogin.match(/[^@]+@\w+\.\w+((\.\w+)(?!\1\.{2,)*?)*/gim)) {
    //     this.setState({ errorMessage: "Please enter a valid email." });
    //     return;
    //   } else {
    //     let credentials = {
    //       email: this.state.emailLogin,
    //       password: this.state.passwordLogin
    //     };
    //     console.log("about to send credentials to backend for login", credentials);
    //     this.props.login(credentials).then(res => {
    //       console.log("login in session_form just returned", res);
    //       if (res.error) {
    //         this.setState({ errorMessage: res.error });
    //         return;
    //       }
    //     });
    //   }
    // }

    //              Code-based Authentication (magic link)
    console.log(e.target);
    if (this.state.formType === "signup") {
      if (this.state.email.length === 0) {
        this.setState({ errorMessage: "Please fill in your email." });
        return;
      } else if (!this.state.email.match(/[^@]+@\w+\.\w+((\.\w+)(?!\1\.{2,)*?)*/gim)) {
        console.log("noemailmatch");
        this.setState({ errorMessage: "Please enter a valid email." });
        return;
      } else {
        this.setState({ errorMessage: ""});
        this.props.signup(user).then(res => {
          console.log("in handle in session_form, signup just returned", res);
          if (res.data.error) {
            this.setState({ errorMessage: res.data.error });
            return;
          } else {
            this.switchToLogin();
          }
        }).catch(err => {
          this.setState({ errorMessage: "There was an error. Please try again." });
        });
      }
    } else {
      if (e.target.id === "textEmailLogin" || e.target.id === "requestCodeBtn") {
        this.setState({ errorMessage: "" });
        if (this.state.emailLogin.length === 0) {
          this.setState({ errorMessage: "Please enter your email." });
          return;
        } else if (!this.state.emailLogin.match(/[^@]+@\w+\.\w+((\.\w+)(?!\1\.{2,)*?)*/gim)) {
          this.setState({ errorMessage: "Please enter a valid email." });
          return;
        } else {
          this.setState({ codeMessage: "" });
          this.props.sendMail({ email: this.state.emailLogin }).then(res => {
            if (res.data.error) {
              this.setState({ errorMessage: res.data.error });
              return;
            } else if (res.data.message === "Mail sent.") {
              this.setState({ codeMessage: "Mail sent!\nPlease check your email." });
              return;
            } else {
              this.setState({ errorMessage: "Something went wrong. Please try again." });
              return;
            }
          }).catch(err => {
            this.setState({ errorMessage: "There was an error. Please try again." });
          });
        }
      } else {
        if (this.state.emailLogin.length === 0) {
          this.setState({ errorMessage: "Please enter your email." });
          return;
        } else if (!this.state.emailLogin.match(/[^@]+@\w+\.\w+((\.\w+)(?!\1\.{2,)*?)*/gim)) {
          this.setState({ errorMessage: "Please enter a valid email." });
          return;
        } else if (this.state.passwordLogin.length === 0) {
          this.setState({ errorMessage: "Please enter the code sent to your email." });
          return;
        } else {
          this.props.login({ email: this.state.emailLogin, code: this.state.passwordLogin }).then(res => {
            console.log(".then after login in session_form.jsx", res);
            if (res.error) {
              this.setState({ errorMessage: res.error });
              return;
            } else {
              console.log("login successful in session_form.js");
              this.props.history.push("/dashboard");
            }
          }).catch(err => {
            console.log(".catch of login in session_form.jsx", err);
            this.setState({ errorMessage: err.error || "There was an error.  Please try again." });
          })
        }
      }
    }

  };
      
  enterKey(e) {
    // console.log(e.target);
    if (e.key === "Enter") {
      this.handleSubmit(e);
    }
  }

  switchToSignUp() {
    this.clearErrorMsg();
    this.setState({
        formType: "signup"
    });
    setTimeout(() => {
      this.updateTitle();
      // this.props.history.push("/signup");
    });
  }

  switchToLogin() {
    this.clearErrorMsg();
    this.setState({
      formType: "login",
      emailLogin: this.state.email
    });
    setTimeout(() => {
      console.log("current emailLogin", this.state.emailLogin);
      this.updateTitle();
      // this.props.history.push({
      //   pathname: "/login",
      //   state: {
      //     emailLogin: this.state.email
      //   }
      // });
      // this.setState({ emailLogin: this.props.location.state.emailLogin });
      // console.log("emailLogin after history push", this.state.emailLogin);
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
                  {/* <div className="field">
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
                  </div> */}
                  <div className="alias-submit">
                    <div className="submit-button-component ">
                      <button
                        type="submit"
                        aria-label="Request Sign In Code"
                        className="theme-button"
                      >
                        Sign Up
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                </form>
                <span className="returnToSignup">Already have an account? Click <a className="signupLink" onClick={this.switchToLogin}>here</a> to log in.</span>
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
                  Please log in.
                </h1>
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
                      id="textEmailLogin"
                      type="text"
                      aria-label="confirmation code"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Email"
                      onChange={this.update("emailLogin")}
                      onKeyPress={this.enterKey}
                      value={this.state.emailLogin}
                    />
                  </div>

                  <div className="alias-submit requestCode">
                    <div className="submit-button-component ">
                      <button
                        onClick={this.handleSubmit}
                        aria-label="Request Sign In Code"
                        className="theme-button"
                        id="requestCodeBtn"
                      >
                        Request Code
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                  <br />
                  <span className="step-title preWS">{this.state.codeMessage}</span>
                  <br />
                  <div className="field">
                    <input
                      id="textPasswordLogin"
                      type="text"
                      aria-label="confirmation code"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Code"
                      onChange={this.update("passwordLogin")}
                      onKeyPress={this.enterKey}
                      type="password"
                    />
                  </div>

                  <div className="alias-submit">
                    <div className="submit-button-component ">
                      <button
                        onClick={this.handleSubmit}
                        aria-label="Request Sign In Code"
                        className="theme-button"
                        button="loginBtn"
                      >
                        Log In
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                </form>
                <span className="returnToSignup">Don't have an account? Click <a className="signupLink" onClick={this.switchToSignUp}>here</a> to sign up.</span>
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
