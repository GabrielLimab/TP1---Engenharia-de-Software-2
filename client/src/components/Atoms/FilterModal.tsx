import { useState } from 'react';
import { Input, Button, Error } from ".";
import { getTagByName } from '../../services/tag';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import CloseIcon from '@mui/icons-material/Close';
import './Modal.css';

interface FilterModalProps {
  displayFilter: boolean;
  setDisplayFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FilterModal({ displayFilter, setDisplayFilter, setTag, setRender }: FilterModalProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const getTag = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await getTagByName(search);
      setTag(search);
      setLoading(false);
      setRender(true);
      setError('');
      setDisplayFilter(!displayFilter);
    }
    catch (error) {
      setLoading(false);
      setError('Tag not found');
    }
  };
  
  return (
    <div className={displayFilter ? 'modal-open' : 'modal-closed'} onClick={e => e.stopPropagation()}>
      <div className='modal-body'>
        <div className='modal-header'>
          <h4> Search a tag </h4>
          <CloseIcon onClick={() => {setDisplayFilter(false); setSearch(''); setError('');}} className='modal-close-icon'></CloseIcon>  
        </div>
        <div className="modal-container">
          <form onSubmit={getTag} className="modal-form">
            <Input type="text" placeholder="Search" loading={loading} setValue={setSearch} value={search} Icon={TagOutlinedIcon} />
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