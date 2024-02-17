import { Button } from "antd";

const LandingPage = () => {
  const baseUrl = "https://main.d1c93c02ir9dp3.amplifyapp.com/";

  return (
    <div className="landing-page">
      <div className="landing-page-content">
        <h1 className="landing-page-title">Real Estate Management</h1>
        <p className="landing-page-subtitle">
          Track, analyze, and manage your real estate assets with ease.
        </p>
        <div className="landing-page-features">
          <div className="landing-page-feature">
            <img
              src={baseUrl + "asset-mngt.png"}
              alt="Feature 1"
              className="landing-page-feature-image"
            />
            <h3>Asset Tracking</h3>
            <p>
              Effortlessly track and manage your real estate assets in one
              central location.
            </p>
          </div>
          <div className="landing-page-feature">
            <img
              src={baseUrl + "images/financial-analysis.png"}
              alt="Feature 2"
              className="landing-page-feature-image"
            />
            <h3>Financial Analysis</h3>
            <p>
              Analyze the financial performance of your assets with detailed
              reports and insights.
            </p>
          </div>
          <div className="landing-page-feature">
            <img
              src={baseUrl + "images/track-expenses.png"}
              alt="Feature 3"
              className="landing-page-feature-image"
            />
            <h3>Expense Management</h3>
            <p>
              Keep track of your expenses, streamline processes, and optimize
              your real estate operations.
            </p>
          </div>
        </div>
        <Button
          href="/signUp"
          type="primary"
          size="large"
          className="landing-page-button"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
