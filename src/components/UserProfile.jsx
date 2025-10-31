import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getUserProfile } from '../utils/modelStorage';
import { createCheckoutSession } from '../utils/stripe';
import Avatar from './Avatar';
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

  const handleUpgrade = async () => {
    try {
      setShowMenu(false);
      alert('⏳ Redirecting to checkout...');
      await createCheckoutSession();
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('❌ Failed to start checkout. Please try again.');
    }
  };

  const handleUploadAvatar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          setShowMenu(false);
          alert('⏳ Uploading avatar...');
          
          // Upload to Supabase storage
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/avatar.${fileExt}`;
          
          console.log('Uploading file:', fileName);
          const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (error) {
            console.error('Upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
          }

          console.log('Upload successful:', data);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          console.log('Public URL:', publicUrl);

          // Update user metadata
          const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
          });

          if (updateError) {
            console.error('Update user error:', updateError);
            throw new Error(`Failed to update profile: ${updateError.message}`);
          }

          alert('✅ Avatar uploaded successfully!');
          
          // Reload user data
          loadUser();
        } catch (error) {
          console.error('Avatar upload error:', error);
          alert(`❌ ${error.message || 'Failed to upload avatar. Please try again.'}`);
        }
      }
    };
    input.click();
  };

  if (!user) return null;

  const isPremium = profile?.subscription_tier === 'premium';
  
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
          <Avatar user={user} size="small" showPremium={isPremium} />
        </button>
        
        <button className="add-member-btn" title="Upload Avatar" onClick={handleUploadAvatar}>
          <span>+</span>
        </button>
      </div>

      {showMenu && (
        <>
          <div className="profile-backdrop" onClick={() => setShowMenu(false)} />
          <div className="profile-menu">
            <div className="profile-header">
              <Avatar user={user} size="large" />
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

            <button className="menu-item" onClick={handleUploadAvatar}>
              <span className="menu-icon">📸</span>
              <div>
                <div className="menu-label">Upload Avatar</div>
                <div className="menu-desc">Change your profile photo</div>
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
