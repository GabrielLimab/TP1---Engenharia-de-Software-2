import Sidebar from "../Sidebar/Sidebar";
import { Button, CreateModal, ExploreModal, ProfilePost } from "../Atoms";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserByUsername, getLoggedUser, toggleFollow } from "../../services/user";
import { getPicturesByUserID } from "../../services/picture";
import "./Profile.css";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  following: {id: string}[];
  followed_by: {id: string}[];
  picture: {
    id: string;
    picture_url: string;
  }[]
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displayExplore, setDisplayExplore] = useState(false);
  const [render, setRender] = useState(false);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    if (!username) return;
    const getUserData = async () => {
      try {
        const response = await getUserByUsername(username);
        setUser(response.data);
        setRender(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, [render, username]);

  useEffect(() => {
    const getLoggedUserData = async () => {
      try {
        const response = await getLoggedUser();
        setLoggedUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getLoggedUserData();
          
  }, [render, user]);
  

  useEffect(() => {
    if (!user) return;
    const getPosts = async () => {
      try {
        const response = await getPicturesByUserID(user.id);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getPosts();
  }, [render, user]);

  const handleFollow = async () => {
    try {
      console.log(loggedUser!.following);
      await toggleFollow(user!.id);
      console.log(loggedUser!.following.includes({id: user!.id}));
      setRender(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };


  return (
    <div className="profile-page">
      <Sidebar displayCreate={displayCreate} displayExplore={displayExplore} setDisplayCreate={setDisplayCreate} setDisplayExplore={setDisplayExplore} setDisplayFilter={() => {}} />
      <div className="profile-content">
        <div className="profile">
          <div className="profile-header">
            <img src={'../../../' + user?.picture[0].picture_url} alt="profile" className="profile-avatar" />
            {user && (
              <div className="profile-header-info">
                <div className="profile-names">
                  <h3>{user.name.substring(0, 40)}</h3>
                  <h3>@{user.username.substring(0, 40)}</h3>
                  {(loggedUser) && loggedUser.id !== user.id && (
                    <Button buttonText={(loggedUser.following.some((user) => user.id === user.id)) ? 'Unfollow' : 'Follow'} onClick={() => handleFollow()} />
                  )}
                </div>
                <div className="profile-numbers">
                  <h4>Posts: {posts.length}</h4>
                  <h4>Following: {user.following.length}</h4>
                  <h4>Followers: {user.followed_by.length}</h4>
                </div>
              </div>
            )}
          </div>
          <CreateModal displayCreate={displayCreate} setDisplayCreate={setDisplayCreate} setRender={setRender} />
          <ExploreModal displayExplore={displayExplore} setDisplayExplore={setDisplayExplore} />
          <div className="profile-posts">
            {posts.map((post, index) => (
              <ProfilePost post={post} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}