import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Error } from ".";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { getUserByUsername } from '../../services/user';
import './Modal.css';

interface ExploreModalProps {
  displayExplore: boolean;
  setDisplayExplore: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ExploreModal({ displayExplore, setDisplayExplore }: ExploreModalProps) {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const getUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!search) {
      setError('Please enter a username');
      return;
    }
    setLoading(true);
    try {
      const response = await getUserByUsername(search);
      setLoading(false);
      setDisplayExplore(false);
      navigate(`/profile/${response.data.username}`);
    } catch (error) {
      setLoading(false);
      setError('User not found');
    }
  };
  
  return (
    <div className={displayExplore ? 'modal-open' : 'modal-closed'} onClick={e => e.stopPropagation()}>
      <div className='modal-body'>
        <div className='modal-header'>
          <h4> Find a Profile</h4>
          <CloseIcon onClick={() => {setDisplayExplore(false); setError('');}} className='modal-close-icon'></CloseIcon>  
        </div>
        <div className="modal-container">
          <form onSubmit={getUser} className="modal-form">
            <Input type="text" placeholder="Search" loading={loading} setValue={setSearch} value={search} Icon={BadgeOutlinedIcon} />
            <div className='error-message-explore'>
              {error && <Error error={error} />}
            </div>
            <Button loading={loading} buttonText='Search' />
          </form>
        </div>
      </div>
    </div>
  );
}