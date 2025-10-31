import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getUserProfile } from '../utils/modelStorage';
import { createCheckoutSession } from '../utils/stripe';
import './UserProfile.css';

const UserProfile = ({ onSignOut }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      loadProfile();
    }
  };

  const loadProfile = async () => {
    const profileData = await getUserProfile();
    setProfile(profileData);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
    if (onSignOut) onSignOut();
  };

  const handleAddMember = () => {
    alert('👥 Team member feature coming soon! This will allow you to collaborate with others on your 3D projects.');
    setShowMenu(false);
  };

  if (!user) return null;

  const isPremium = profile?.subscription_tier === 'premium';
  const userInitial = user.email?.[0]?.toUpperCase() || '?';
  
  // Get avatar from social providers or use initial
  const getAvatar = () => {
    if (user.user_metadata?.avatar_url) {
      return <img src={user.user_metadata.avatar_url} alt="Avatar" className="profile-avatar-img" />;
    }
    if (user.user_metadata?.picture) {
      return <img src={user.user_metadata.picture} alt="Avatar" className="profile-avatar-img" />;
    }
    return userInitial;
  };

  const getDisplayName = () => {
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.user_metadata?.name) return user.user_metadata.name;
    return user.email;
  };

  return (
    <div className="user-profile">
      <div className="profile-container">
        <button 
          className="profile-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="profile-avatar">
            {getAvatar()}
          </div>
          {isPremium && <span className="premium-badge">⭐</span>}
        </button>
        
        <button className="add-member-btn" title="Add Team Member">
          <span>+</span>
        </button>
      </div>

      {showMenu && (
        <>
          <div className="profile-backdrop" onClick={() => setShowMenu(false)} />
          <div className="profile-menu">
            <div className="profile-header">
              <div className="profile-avatar large">
                {getAvatar()}
              </div>
              <div className="profile-info">
                <div className="profile-name">{getDisplayName()}</div>
                <div className="profile-email">{user.email}</div>
                <div className={`profile-tier ${isPremium ? 'premium' : 'free'}`}>
                  {isPremium ? '⭐ Premium' : '🆓 Free'}
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            {!isPremium && (
              <button className="menu-item upgrade" onClick={handleUpgrade}>
                <span className="menu-icon">⭐</span>
                <div>
                  <div className="menu-label">Upgrade to Premium</div>
                  <div className="menu-desc">Cloud sync & more</div>
                </div>
              </button>
            )}

            <button className="menu-item" onClick={handleAddMember}>
              <span className="menu-icon">👥</span>
              <div>
                <div className="menu-label">Add Team Member</div>
                <div className="menu-desc">Collaborate on projects</div>
              </div>
            </button>

            <button className="menu-item" onClick={handleSignOut}>
              <span className="menu-icon">🚪</span>
              <span className="menu-label">Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
