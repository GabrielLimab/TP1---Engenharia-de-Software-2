import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Atoms';
import { getLoggedUser, toggleFollow } from '../../services/user';
import { toggleLike } from '../../services/picture';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import './Post.css'

interface User {
  id: string;
  username: string;
  picture: {
    picture_url: string;
  }[]
  following: {id: string}[];
  followed_by: {id: string}[];
}

interface PostProps {
  post: {
    id: string;
    user: User;
    picture_url: string;
    tags: string[];
    likes: {id: string}[];
  },
  render: boolean;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Post({post, render, setRender}: PostProps) {
  const [firstRender, setFirstRender] = useState(true);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [renderFollowers, setRenderFollowers] = useState(false);

  useEffect(() => {
    const getLoggedUserData = async () => {
      try {
        const response = await getLoggedUser();
        setRenderFollowers(false);
        setLoggedUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    getLoggedUserData();
  }, [renderFollowers, render]);

  async function handleLike() {
    try {
      await toggleLike(post.id);
      setFirstRender(false);
      setRender(true);
    }
    catch (error) {
      console.error('Error liking post:', error);
    }
  }

  const handleFollow = async (id: string) => {
    try {
      await toggleFollow(id);
      setRenderFollowers(true);
      setRender(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  return (
    <div className="post">
      <div className="post-header">
        <div className="post-header-left">
          <Link to={'/profile/' + post.user.username}>
            <img src={'../../../' + post.user.picture[0].picture_url} alt="user" />
          </Link>
          <h4>
            <Link to={'/profile/' + post.user.username}>
              {post.user.username}
            </Link>
          </h4>
        </div>
        <div className="post-header-right">       
          {loggedUser && loggedUser.id !== post.user.id && 
          <Button buttonText={(loggedUser.following.some((user) => user.id === post.user.id)) ? 'Unfollow' : 'Follow'} onClick={() => handleFollow(post.user.id)} />
          }
        </div>
      </div>
      <div className="post-image-container" onDoubleClick={handleLike}>
        <img className="post-photo" src={'../../../' + post.picture_url} alt={post.picture_url} />
        { !firstRender && post.likes.some((like) => like.id === loggedUser?.id) &&
        <div className="post-overlay">
          <FavoriteIcon sx={{ fontSize: "8em", color: "white" }} className='post-overlay-heart' />
        </div>}
      </div>
      <div className="post-footer">
        <div className="post-footer-left">
          {post.likes.some((like) => like.id === loggedUser?.id) ? (
            <FavoriteOutlinedIcon onClick={handleLike} sx={{ fontSize: "2.2rem", fill: "red"}} className='post-heart-icon' />
          ) : (
            <FavoriteBorderOutlinedIcon onClick={handleLike} sx={{fontSize: "2.2rem"}} className='post-heart-icon' />
          )}
          
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "2.2rem" }} className='post-footer-icon' />
        </div>
        <div className="post-footer-right">
          <h3>{post.likes.length} likes</h3>
        </div>
      </div>
    </div>
  );
} 