import React, { Component } from "react";
import { HashLink as Link } from "react-router-hash-link";
import "../scss/components/landing.css";
import "../scss/components/bubbles.css";
import ncentLogo from "../img/logo_white.png";
import { Bubbles } from "./bubbles";
import jobCentGraphic from "../img/jobCentGraphic.png";

class Landing extends React.Component {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  // componentDidUpdate() {
  //   let hash = this.props.location.hash.replace('#', '');
  //    if (hash) {
  //        let node = React.findDOMNode(this.refs[hash]);
  //        if (node) {
  //            node.scrollIntoView();
  //        }
  //    }
  // }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  smoothScroll() {
    document
      .getElementById("about")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }

  handleScroll() {
    let windowHeight = window.innerHeight;
    let scrollPosition = window.scrollY;
    let scrollPercentage = scrollPosition / windowHeight;
    let opacity = 1 - scrollPercentage;
    document.getElementById("opaque").style.opacity = opacity;
  }
  render() {
    return (
      <div className="landing">
        <section id="opaque" className="background height">
          <Bubbles />
          <header className="jc-header-bar">
            <div className="ncent-logo" onClick={this.smoothScroll}>
              <div className="test-button small">
                <img src={ncentLogo} alt="ncent logo" />
              </div>
              <div className="logo-title">jobCent</div>
            </div>
            <div>
              <a
                onClick={this.smoothScroll}
                className="button button-round button-about"
              >
                About
              </a>
              <Link to="/login" className="button button-round">
                Sign In
              </Link>
            </div>
          </header>
          <div className="nav-arrow">
            <div id="arrow" onClick={this.smoothScroll} className="arrow" />
          </div>
        </section>
        <section id="about" ref="about" className="scrolling height">
          <div className="about-jobcent">
            <div>
              <header className="about-header-bar">
                <div className="ncent-logo">
                  <div className="test-button small">
                    <img src={ncentLogo} alt="ncent logo" />
                  </div>
                  <div className="logo-title">jobCent</div>
                </div>
                <div className="header-sign-in">
                  
                  <Link to="/login" className="test-button">
                    Sign In
                  </Link>
                </div>
              </header>

              <div className="about-content">
                <div className="app-image">
                 
                  <picture>
                    <source srcSet={jobCentGraphic} media="(min-width: 1278px)" />
                    <source srcSet={jobCentGraphic} media="(min-width: 1024px)" />
                    <img src={jobCentGraphic} />
                  </picture>
                </div>
                <div className="app-info">
                  <p>
                    <b>Hire Better and Faster with the Widest Net</b>
                  </p>
                  <p>
                      jobCent incentivizes people to find the most qualified candidates for a job opening by rewarding everyone involved in referral chain.
                  </p>
                  <p>
                      With jobCent, you can utilize incentives to reach the broadest possible candidate pool, while drawing out the best candidates and referrers.
                  </p>
                </div>
              </div>
            </div>
            <footer className="footer">
              <div className="social-media">
                <a
                  className="fab fa-twitter fa-lg"
                  target="_blank"
                  href="https://twitter.com/kk_ncnt"
                />
                <a
                  className="fab fa-medium fa-lg"
                  target="_blank"
                  href="https://medium.com/@kk_ncnt"
                />
                <a
                  className="fab fa-youtube fa-lg"
                  target="_blank"
                  href="https://www.youtube.com/watch?v=Op6t4u9rwMA&t=841s"
                />
              </div>
              <div className="links" />
            </footer>
          </div>
        </section>
      </div>
    );
  }
}

export default Landing;
