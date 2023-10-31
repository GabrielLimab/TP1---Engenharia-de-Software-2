import { Link, useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

import { useState } from 'react';
import { Error, Input, Button } from '../Atoms';
import { signup, login } from '../../services/authenticate';
import '../Form.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Senhas não conferem');
      setLoading(false);
      return;
    }

    if (name === '' || username === '' || email === '' || password === '' || confirmPassword === '') {
      setError('Preencha todos os campos');
      setLoading(false);
      return; 
    }

    if (file === null) {
      setFile(new File([], ''));
    }

    await signup(name, username, email, password, file!).catch((err) => {
      setError(err);
      setLoading(false);
      throw err;
    }).then(() => {
       login(email, password).catch((err) => {
        setError(err);
        setLoading(false);
        throw err;
      }).then(() => {
        navigate('/home');
      });
    });
  }

  return(
    <div className="form-wrapper">
      <h1>photon</h1>
      <h2>Photos for everyone.</h2>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Name" loading={loading} setValue={setName} value={name} Icon={AccountCircleOutlinedIcon} />
        <Input type="text" placeholder="Username" loading={loading} setValue={setUsername} value={username} Icon={BadgeOutlinedIcon} />
        <Input type="text" placeholder="Email" loading={loading} setValue={setEmail} value={email} Icon={EmailOutlinedIcon} />
        <Input type="password" placeholder="Password" loading={loading} setValue={setPassword} value={password} Icon={HttpsOutlinedIcon} />
        <Input type="password" placeholder="Confirm password" loading={loading} setValue={setConfirmPassword} value={confirmPassword} Icon={HttpsOutlinedIcon} />
        <input type="file" accept='.png, .jpg, .jpeg' onChange={(e) => {setFile(e.target.files![0]); setError('')}} />
        <Button loading={loading} buttonText='Sign Up'/>
      </form>
      {error ? <Error error={error} /> : null}  
      <h4>ALREADY HAVE AN ACCOUNT? <Link to='/'>LOG IN</Link></h4>
    </div>
  );
}