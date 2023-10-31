import { Link, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { useState } from 'react';
import { Error, Input, Button } from '../Atoms';
import { login } from '../../services/authenticate';
import '../Form.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email === '' || password === '') {
      setError('Fill in all inputs');
      setLoading(false);
      return;
    }

    await login(email, password).catch((err) => {
      setError(err);
      setLoading(false);
      throw err;
    }).then(() => {
      navigate('/home');
    });
  }

  return(
    <div className="form-wrapper">
      <h1>photon</h1>
      <h2>Photos for everyone.</h2>
      <form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" loading={loading} setValue={setEmail} value={email} Icon={EmailOutlinedIcon} />
        <Input type="password" placeholder="Password" loading={loading} setValue={setPassword} value={password} Icon={HttpsOutlinedIcon} />
        <Button loading={loading} buttonText='LOGIN'/>
      </form>
      {error ? <Error error={error} /> : null}
      <h4>DOESN'T HAVE AN ACCOUNT? <Link to='/signup'>SIGN UP</Link></h4>
      <h5><Link
      to = ''>Forgot your password?</Link></h5>
    </div>
  );
}