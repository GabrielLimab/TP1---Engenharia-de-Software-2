import { Link } from 'react-router-dom';
import { ListItem } from '../Atoms/ListItem';
import { logout } from '../../services/authenticate';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import './Sidebar.css';
import { useState, useEffect } from 'react';
import { getLoggedUser } from '../../services/user';

interface User {
  name: string;
  username: string;
  email: string;
  following: {id: string}[];
  followed_by: {id: string}[];
}

interface SidebarProps {
  displayCreate: boolean;
  displayExplore: boolean;
  setDisplayCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayExplore: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({displayCreate, displayExplore, setDisplayCreate, setDisplayExplore, setDisplayFilter}: SidebarProps) {
  async function handleClick() {
    await logout().catch((err) => {
      console.log(err);
      throw err;
    });
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await getLoggedUser();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);


  return (
    <div className="sidebar">
      <h1>
        <Link to='/home'>photon</Link>
      </h1>
      <div className="sidebar-list">
        <ListItem Icon={HomeOutlinedIcon} text="Home" link="/home" />
        <ListItem Icon={SearchOutlinedIcon} text="Explore" onClick={(e) => {e.stopPropagation(); setDisplayCreate(false); setDisplayFilter(false); setDisplayExplore(!displayExplore); } } link="#"/>
        <ListItem Icon={AddAPhotoOutlinedIcon} text="Create" onClick={(e) => {e.stopPropagation(); setDisplayExplore(false); setDisplayFilter(false); setDisplayCreate(!displayCreate); }} link="#"/>
        <ListItem Icon={SendOutlinedIcon} text="Messages" link="#" />
        <ListItem Icon={AccountCircleOutlinedIcon} text="Profile" link={`/profile/${user?.username}`} />
        <ListItem onClick={handleClick} Icon={LogoutOutlinedIcon} text="Logout" link="/" />
      </div>
    </div>
  );
}