import FavoriteIcon from '@mui/icons-material/Favorite';
import './ProfilePost.css';

interface ProfilePostProps {
  post: {
    id: string;
    user_id: string;
    picture_url: string;
    profile_picture: boolean;
    likes: string[];
    tags: string[];
    created_at: string;
  }
}

export function ProfilePost({post}: ProfilePostProps) {
  return (
    <div className="profile-post-wrapper">
      <img src={'../../../' + post.picture_url} alt='post' className="profile-post-image" />
      <div className="profile-post-overlay">
        <div className="profile-post-overlay-text">
          <FavoriteIcon style={{alignItems: 'center'}} className="profile-post-icon" />
          <div className="profile-post-likes-count">{post.likes.length}</div>
        </div>  
      </div>
    </div>
  )
}