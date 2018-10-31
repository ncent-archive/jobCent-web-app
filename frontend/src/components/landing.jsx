import React, { Component } from "react";
import { HashLink as Link } from "react-router-hash-link";
import "../scss/components/landing.css";
import "../scss/components/bubbles.css";
import ncentLogo from "../img/logo_white.png";
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
                    <b>Get Hired. Get Your Network Hired. Get Paid.</b>
                  </p>
                  <p>
                      jobCent is a platform that provides incentives for people to find the most qualified candiates for jobs.
                  </p>
                  <p>
                      jobCent is simple and easy to use. Sign in with your email to view your challenge invitations. Hang onto an invitation and get hired, or send it along until someone else does. Either way, you get paid!
                  </p>
                </div>
              </div>
            </div>
              <h1 className="how-it-works">How It Works</h1>
              <VerticalTimeline>
                  <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                      <h3 className="vertical-timeline-element-title">Startup Co.</h3>
                      <h4 className="vertical-timeline-element-subtitle">The Sponsor</h4>
                      <p>
                          Startup Co. is eager to hire 10 software developers. Startup Co. buys NCNT and stamps them to create 100 jobCents. They distribute the jobCents to the most promising CS majors at Dev University.                      </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                      <h3 className="vertical-timeline-element-title">Alice</h3>
                      <h4 className="vertical-timeline-element-subtitle">President of Dev U Computer Club</h4>
                      <p>
                          Alice recieves a jobCent from Startup Co. She can apply for the job and if she is hired recieve a 10k NCNT signing bonus. However, she has already committed to working at FacePamphlet Inc. so she sends the jobCent to Bob instead.                      </p>
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
