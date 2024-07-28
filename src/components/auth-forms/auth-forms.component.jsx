import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { LifeSystemContext } from '../../context/life-system.context';
import { useNavigate } from 'react-router-dom';
import './auth-forms.styles.scss';

const AuthForms = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const { signIn, signUp, signInWithGoogle, signInWithApple } = useContext(AuthContext);
  const { isDemo, enterDemoMode } = useContext(LifeSystemContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      
      setEmail('');
      setPassword('');
      setDisplayName('');
      navigate('/');
    } catch (error) {
      console.error('Error during authentication:', error);
      // Here you might want to set an error state and display it to the user
    }
  };

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleEnterDemoMode = async () => {
    console.log('Entering demo mode');
    enterDemoMode();
    navigate('/');
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error during Google sign in:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      navigate('/');
    } catch (error) {
      console.error('Error during Apple sign in:', error);
    }
  };

  return (
    <div className="auth-forms">
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button onClick={toggleForm}>
        {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
      </button>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <button onClick={handleAppleSignIn}>Sign in with Apple</button>
      <button onClick={handleEnterDemoMode}>Enter Demo Mode</button>
    </div>
  );
};

export default AuthForms;