import React from 'react';

export const ErrorPage: React.FC = () => (
  <div className="error-page">
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <button className="back-btn" onClick={() => window.history.back()}>Go Back</button>
  </div>
);