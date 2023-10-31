import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Post from '../Post/Post';
import { CreateModal, ExploreModal, FilterModal, SectionButton } from '../Atoms';
import { getSelectedPictures } from '../../services/picture';
import './Home.css';

export default function Home() {
  const [selected, setSelected] = useState('For You');
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displayExplore, setDisplayExplore] = useState(false);
  const [displayFilter, setDisplayFilter] = useState(false);
  const [tag, setTag] = useState('');
  const [posts, setPosts] = useState([]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    const getPictures = async (selected: string, tag: string) => {
      try {
        const response = await getSelectedPictures(selected, tag);
        setPosts(response.data);
        setRender(false);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };

    getPictures(selected, tag);
  }, [selected, render]);

  function handleClick( text: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    setSelected(text);
    if (text === 'Filter') {
      setRender(true);
      setDisplayFilter(!displayFilter);
      e.stopPropagation();
    }
  }

  return (
    <div className="home" onClick={() => {setDisplayCreate(false); setDisplayExplore(false); setDisplayFilter(false)}}>
      <Sidebar displayCreate={displayCreate} displayExplore={displayExplore}  setDisplayCreate={setDisplayCreate} setDisplayExplore={setDisplayExplore} setDisplayFilter={setDisplayFilter} />
      <div className="home-content" >
        <div className="home-header">
          <SectionButton text='For You' link='#' selected={selected} handleClick={handleClick} />
          <SectionButton text='Following' link='#' selected={selected} handleClick={handleClick} />
          <SectionButton text='Filter' link='#' selected={selected} handleClick={handleClick} />
        </div>
        <CreateModal displayCreate={displayCreate} setDisplayCreate={setDisplayCreate} setRender={setRender} />
        <ExploreModal displayExplore={displayExplore} setDisplayExplore={setDisplayExplore} />
        <FilterModal displayFilter={displayFilter} setDisplayFilter={setDisplayFilter} setTag={setTag} setRender={setRender}/>

        <div className="home-photos">
          {posts.map((post, index) => (
            <Post key={index} post={post} render={render} setRender={setRender} />
          ))}
        </div>
      </div>
    </div>
  );
}