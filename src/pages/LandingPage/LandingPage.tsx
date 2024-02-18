import React from 'react';
import { Button } from 'antd';
// import './LandingPage.css'; // Ensure this file reflects the futuristic theme

const LandingPage = () => {

  return (
    <div className="landing-page">
      <div className="landing-page-content">
        <h1 className="landing-page-title">Persona AI: Your Future Self</h1>
        <p className="landing-page-subtitle">
          Step into the future of personalized AI interaction. Craft an AI persona that mirrors your essence, understanding you like no other.
        </p>
        <div className="landing-page-features">
          <div className="landing-page-feature">
            <img
              src={"https://www.kommunicate.io/blog/wp-content/uploads/2023/07/Personalization-at-Scale-How-Chatbots-Drive-Customized-Customer-Experiences-1.png"}
              alt="Data Collection"
              className="landing-page-feature-image"
            />
            <h3>Data Collection</h3>
            <p>
              Utilize our cutting-edge iOS app to securely gather personalized speech and text data.
            </p>
          </div>
          <div className="landing-page-feature">
            <img
              src={"https://images.prismic.io/chatling-integrations/65832448531ac2845a26d3d5_PersonalizedAIChatbotGuide.jpeg?auto=format,compress"}
              alt="Model Training"
              className="landing-page-feature-image"
            />
            <h3>Model Training</h3>
            <p>
              Harness the power of advanced transfer learning to tailor AI models to your unique communication style.
            </p>
          </div>
          <div className="landing-page-feature">
            <img
              src={"https://www.eweek.com/wp-content/uploads/2023/08/ew08292023-conversational-ai-platforms.png"}
              alt="Interactive Engagement"
              className="landing-page-feature-image"
            />
            <h3>Interactive Engagement</h3>
            <p>
              Dive into interactive sessions with your AI persona, enriched with personalized prompts for a unique experience.
            </p>
          </div>
        </div>
        <Button
          href="/signUp"
          type="primary"
          size="large"
          className="landing-page-button"
        >
          Begin Crafting Your AI Persona
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
