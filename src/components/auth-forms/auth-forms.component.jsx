import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { LifeSystemContext } from '../../context/life-system.context';
import { auth, createUserProfileDocument } from '../../utils/firebase/firebase.utils';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './auth-forms.styles.scss';

const AuthForms = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const { user } = useContext(AuthContext);
  const { isDemo, setIsDemo } = useContext(LifeSystemContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfileDocument(user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const toggleForm = () => setIsSignUp(!isSignUp);

  const enterDemoMode = () => {
    setIsDemo(true);
    navigate('/');
  };

  if (user || isDemo) {
    navigate('/');
    return null;
  }

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
      <button onClick={enterDemoMode}>Enter Demo Mode</button>
    </div>
  );
};

export default AuthForms;