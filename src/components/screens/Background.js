import React from 'react';
import './Background.css'; // Import any necessary CSS file for styling
import backgroundImage from './bat.jpg'; // Import the background image for the website
const Background = () => {
    return (
      <div className="background">
        <img src={backgroundImage} alt="Background" className="background-image" />
        {/* You can add other content or components within the background component if needed */}
      </div>
    );
  };
  
  export default Background;