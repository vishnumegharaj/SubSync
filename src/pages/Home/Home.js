import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import './home.css';
import '../../styles/styles.css';



function Home() {
  const navigate = useNavigate();


  return (
    <div className='bg-image'>
      <Header />
      <div className="home-container">

        <header className="header">
          <h1 className='heading'>Introducing <span className='font-pink'> SubSync </span> : Your Ultimate Subscription Tracker</h1>
          <p>Tired of AutoPay Surprises? Say Goodbye with SubSync!</p>
          <p>Take Control of Your Membership with Ease</p>
          <p>Never Miss a Renewal Again – Your Subscription Manager is Here!</p>

        </header>

        <section className="cta">
          <h2>Join SubSync Now!</h2>

          <button onClick={() =>{
            navigate("/signup")
          }} type="submit">Join Now</button>

        </section>

        <div className="intro">
          <h2>Why SubSync?</h2>
          <div className="intro-box">
            <p>In today's digital age, managing multiple subscriptions and expenses has become a complex task. From entertainment platforms like Netflix and Spotify to essential tools like Adobe Creative Cloud, keeping track of them all is challenging. SubSync simplifies this for you by providing a comprehensive solution that not only manages your subscriptions but also tracks your financial expenses.</p>
          </div>
          <h2>Personal Story</h2>
          <div className="intro-box">
            <p>A few months ago, my bank account was unexpectedly debited ₹1500 for an Amazon Prime auto-payment, disrupting my budget. This experience highlighted the need for better financial oversight, leading me to develop SubSync. Our solution offers enhanced clarity and control over finances, preventing such surprises and helping users manage their expenses effectively.</p>
          </div>
        </div>

        <section className="features">
          <h2>Key Features</h2>
          <ul>
            <li>All-in-One Dashboard: Monitor all your subscriptions at a glance.</li>
            <li>AI-Powered Insights: Receive personalized recommendations and alerts.</li>
            <li>Smart Alerts: Stay informed about renewals and price changes.</li>
            <li>Expense Tracking: Manage your budget with ease.</li>
            <li>Secure and Private: Your data is protected with advanced security measures.</li>
          </ul>
        </section>

        <p className='privacy'>Your privacy matters to us. We promise to keep your information secure and only use it to provide you with updates about SubSync.</p>
      </div>
    </div>
  );
}

export default Home;
