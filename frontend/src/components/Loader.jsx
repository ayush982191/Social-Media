import React from 'react';

const Loader = () => {
  const spinnerStyle = {
    position: 'relative',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    marginLeft: '-75px',
  };

  const spanBaseStyle = {
    position: 'absolute',
    top: '50%',
    width: '35px',
    height: '7px',
    background: 'gray',
    animation: 'dominos 1s ease infinite',
    boxShadow: '2px 2px 3px 0px black',
  };

  const spanStyles = [
    { left: '80px', animationDelay: '0.125s' },
    { left: '70px', animationDelay: '0.3s' },
    { left: '60px', animationDelay: '0.425s' },
    { left: '50px', animationDelay: '0.54s' },
    { left: '40px', animationDelay: '0.665s' },
    { left: '30px', animationDelay: '0.79s' },
    { left: '20px', animationDelay: '0.915s' },
    { left: '10px' },
  ];

  const keyframesStyle = `
    @keyframes dominos {
      50% {
        opacity: 0.7;
      }
      75% {
        transform: rotate(90deg);
      }
      80% {
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style> {/* Inject keyframes for animation */}
      <div style={spinnerStyle}>
        {spanStyles.map((spanStyle, index) => (
          <span key={index} style={{ ...spanBaseStyle, ...spanStyle }}></span>
        ))}
      </div>
    </>
  );
};

export default Loader;
