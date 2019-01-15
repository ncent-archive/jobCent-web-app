import React, { Component } from "react";
import { HashLink as Link } from "react-router-hash-link";
import "../scss/components/landing.css";
import "../scss/components/bubbles.css";
import ncentLogo from "../img/logo_white.png";
import ncentHeaderLogo from "../img/ncent_header.png";
import { Bubbles } from "./bubbles";
import jobCentGraphic from "../img/jobCentGraphic.png";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

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
                Login
              </Link>
              <Link to="/signup" className="button button-round signUpBtn">
                Sign up
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
                {/* <div className="header-sign-in">
                  
                  <Link to="/login" className="test-button">
                    Login
                  </Link>
                  <Link to="/signup" className="test-button">
                    Sign up
                  </Link>
                </div> */}
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
                    <b>Get Hired. Get Your Network Hired. Get Paid.</b>
                  </p>
                  <p>
                      jobCent is a platform that provides incentives for people to find the most qualified candidates for jobs.
                  </p>
                  <p>
                      jobCent is simple and easy to use. Sign in with your email to view your challenge invitations. Hang onto an invitation and get hired, or send it along until someone else does. Either way, you get paid!
                  </p>
                </div>
              </div>
            </div>
              <h1 className="how-it-works">How It Works</h1>
            <VerticalTimeline className="verticalTimelineLanding">
                  <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                      <h3 className="vertical-timeline-element-title">Startup Co.</h3>
                      <h4 className="vertical-timeline-element-subtitle">The Sponsor</h4>
                      <p>
                          Startup Co. is eager to hire 10 software developers. Startup Co. buys NCNT and stamps them to create 100 jobCents. They distribute the jobCents to the most promising CS majors at Dev University.                      
                      </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                      <h3 className="vertical-timeline-element-title">Alice</h3>
                      <h4 className="vertical-timeline-element-subtitle">President of Dev U Computer Club</h4>
                      <p>
                          Alice receives a jobCent from Startup Co. She can apply for the job and if she is hired receive a 10k NCNT signing bonus. However, she has already committed to working at FacePamphlet Inc. so she sends the jobCent to Bob instead.                      </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                      <h3 className="vertical-timeline-element-title">Bob</h3>
                      <h4 className="vertical-timeline-element-subtitle">Alice's Hardworking Peer</h4>
                      <p>
                          Bob wants to take a gap year after graduating, so he chooses not to apply for the job. However, he knows Carol is still looking for a job and that she would fit well with this company. He sends the jobCent to Carol.                      </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                      <h3 className="vertical-timeline-element-title">Carol</h3>
                      <h4 className="vertical-timeline-element-subtitle">Bob's CS Partner</h4>
                      <p>
                          Upon receiving the jobCent Carol applies for the job. She must keep her jobCent during the application process if she wants to receive a bonus upon hire. After several interviews, Startup Co. decides that Carol would be a great addition to their team. When Carol gets hired, she receives the 10k NCNT signing bonus. For referring Carol, Bob gets 5k, half of Carol's signing bonus. Alice gets 2.5k, half of Bob's reward, for helping to find the hired candidate.                      </p>
                  </VerticalTimelineElement>
              </VerticalTimeline>
            <div className="header-sign-in timelineBtn">

              <Link to="/login" className="test-button">
                Login
              </Link>
              <Link to="/signup" className="test-button">
                Sign up
              </Link>
            </div>
          </div>
        </section>
          <footer className="footer">
              <div className="headerLogo">
                  <img className="headerLogoImage" src={ncentHeaderLogo}/>
              </div>
              <div className="contactUs">
                  <div className="followUsHeader">Follow Us</div>
                  <div className="contactButtons">
                      <a className="fab fa-github contactImg" href="https://github.com/ncent/ncent.github.io">
                      </a>
                      <a className="fab fa-twitter contactImg" href="https://twitter.com/kk_ncnt">
                      </a>
                      <a className="fab fa-telegram contactImg" href="https://t.me/ncent">
                      </a>
                      <a className="fab fa-medium contactImg" href="https://medium.com/@kk_ncnt">
                      </a>
                      <a className="fab fa-youtube contactImg"
                         href="https://www.youtube.com/watch?v=Op6t4u9rwMA&t=841s">
                      </a>
                      <a className="fab fa-linkedin contactImg" href="https://www.linkedin.com/company/ncent">
                      </a>
                  </div>
              </div>
              <div className="moreInfo">
                  <span className="phone"><b>Phone: </b>(650) 503-8785</span>
                  <span className="email">Email our Founder at <a href="mailto:kk@ncnt.io" className="emailLink">kk@ncnt.io</a></span>
                  <div className="copyright">
                      <span>&copy; nCent Labs 2018. </span>
                      <span>All Rights Reserved.</span>
                  </div>
              </div>
          </footer>
      </div>
    );
  }
}

export default Landing;
