import './Avatar.css';

// Reusable Avatar component for use throughout the application
// Perfect for hamburger menus, group members, map pins, etc.
const Avatar = ({
  user,
  size = 'medium',
  showPremium = false,
  onClick,
  className = ''
}) => {
  if (!user) return null;

  const isPremium = user.user_metadata?.subscription_tier === 'premium';
  const userInitial = user.email?.[0]?.toUpperCase() || '?';

  // Get avatar from social providers or uploaded avatar
  const getAvatarContent = () => {
    if (user.user_metadata?.avatar_url) {
      return <img src={user.user_metadata.avatar_url} alt="Avatar" className="avatar-img" />;
    }
    if (user.user_metadata?.picture) {
      return <img src={user.user_metadata.picture} alt="Avatar" className="avatar-img" />;
    }
    return userInitial;
  };

  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium',
    large: 'avatar-large',
    xlarge: 'avatar-xlarge'
  };

  return (
    <div
      className={`avatar ${sizeClasses[size]} ${onClick ? 'avatar-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {getAvatarContent()}
      {showPremium && isPremium && <span className="avatar-premium-badge">⭐</span>}
    </div>
  );
};

export default Avatar;