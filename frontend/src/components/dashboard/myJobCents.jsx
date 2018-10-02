import React from "react";

export const MyJobCents = props => (
  <section className="myJobCents">
    <div className="balance">
      <h1 className="balance-amount">₿{props.jobCents}</h1>
      <h2 className="balance-subtitle">jobCents</h2>
    </div>
  </section>
);
