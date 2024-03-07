import React from 'react';

const LoadingPage = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Loading...</h1>
      </div>
    );
  } else {
    return null; //render nothing if not loading
  }
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to bottom, #f9f9f9, #e9e9e9)',
  },
  heading: {
    color: 'black',
    fontSize: '32px',
    fontFamily: 'Arial, sans-serif',
    animation: 'pulse 1.5s infinite',
  },
};

export default LoadingPage;