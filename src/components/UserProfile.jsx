import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getUserProfile } from '../utils/modelStorage';
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

  if (!user) return null;

  const isPremium = profile?.subscription_tier === 'premium';
  const userInitial = user.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="user-profile">
      <button 
        className="profile-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="profile-avatar">
          {userInitial}
        </div>
        {isPremium && <span className="premium-badge">⭐</span>}
      </button>

      {showMenu && (
        <>
          <div className="profile-backdrop" onClick={() => setShowMenu(false)} />
          <div className="profile-menu">
            <div className="profile-header">
              <div className="profile-avatar large">
                {userInitial}
              </div>
              <div className="profile-info">
                <div className="profile-email">{user.email}</div>
                <div className={`profile-tier ${isPremium ? 'premium' : 'free'}`}>
                  {isPremium ? '⭐ Premium' : '🆓 Free'}
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            {!isPremium && (
              <button className="menu-item upgrade">
                <span className="menu-icon">⭐</span>
                <div>
                  <div className="menu-label">Upgrade to Premium</div>
                  <div className="menu-desc">Cloud sync & more</div>
                </div>
              </button>
            )}

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
