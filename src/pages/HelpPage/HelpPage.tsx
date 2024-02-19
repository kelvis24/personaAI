import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Help Page</h1>
      <h2>Overview</h2>
      <p>This project leverages user-contributed data to train a custom GPT model tailored to your personality...</p>
      
      <h2>How It Works</h2>
      <ol>
        <li>Data Collection: Your text data is periodically collected with your consent...</li>
        <li>Data Processing: The collected data undergoes preprocessing...</li>
        <li>Model Training: The preprocessed data is used to train a custom GPT model...</li>
        <li>Model Deployment: Once trained, the personalized model is deployed...</li>
      </ol>

      <h2>Getting Started</h2>
      <ol>
        <li>Sign Up: Create an account with us to start the process...</li>
        <li>Select Data Sources: Choose the sources from which you'd like to contribute data...</li>
        <li>Review and Consent: Review the data collection and privacy policy...</li>
        <li>Interact with Your AI: Once your personalized model is ready...</li>
      </ol>

      <h2>Privacy and Security</h2>
      <p>Your privacy and security are our top priorities...</p>

      <h2>FAQs</h2>
      <p><strong>Can I delete my data?</strong> Yes, you can request data deletion at any time...</p>
      <p><strong>How long does the training process take?</strong> The training duration varies...</p>
      <p><strong>Is there a cost involved?</strong> The basic service is free, but premium features...</p>

      <h2>Support</h2>
      <p>If you have questions, need assistance, or want to provide feedback, please reach out to our support team...</p>
    </div>
  );
};

export default HelpPage;
