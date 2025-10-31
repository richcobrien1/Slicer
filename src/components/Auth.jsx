import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        setMessage('✅ Successfully logged in!');
        if (onAuthSuccess) onAuthSuccess(data.user);
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage('✅ Account created! Check your email to confirm.');
        }
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
    }
  };

  const handleTwitterAuth = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back!' : 'Get started with premium features'}
        </p>

        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? '⏳ Loading...' : isLogin ? '🔓 Sign In' : '🚀 Sign Up'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button 
          type="button" 
          className="auth-btn google" 
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <span>🔐</span> Continue with Google
        </button>

        <div className="social-buttons">
          <button 
            type="button" 
            className="auth-btn social facebook" 
            onClick={handleFacebookAuth}
            disabled={loading}
          >
            <span>📘</span> Facebook
          </button>

          <button 
            type="button" 
            className="auth-btn social linkedin" 
            onClick={handleLinkedInAuth}
            disabled={loading}
          >
            <span>💼</span> LinkedIn
          </button>

          <button 
            type="button" 
            className="auth-btn social twitter" 
            onClick={handleTwitterAuth}
            disabled={loading}
          >
            <span>🐦</span> X (Twitter)
          </button>
        </div>

        {message && (
          <div className={`auth-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            disabled={loading}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
