import { useContext } from 'react';
import {
  Login,
  Logout
} from '@mui/icons-material';
import { AppContext } from '../App';
import { handleRedirectAfterLogin, login } from '../features/inrupt';
// import type { SimpleButtonProps } from './types';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { setLogger } from '../features/loggerSlice';

function LoggerButton(): JSX.Element {

  const session = useContext(AppContext).inrupt.session;
  const loggedIn = useAppSelector(state => state.logger.value);

  const func = () => { loggedIn ? session.logout() : login(session) };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {loggedIn && <span>{ session.info.webId }</span>}
      <button id='login-button' className='standard-button control-button' onClick={func} style={{ marginLeft: '5px' }}>
        {loggedIn ? <Logout fontSize='large' /> : <Login fontSize='large' />}
      </button>
    </div>
  );
}

export default function LoggerControl():JSX.Element {

  const dispatch = useAppDispatch();

  const session = useContext(AppContext).inrupt.session;

  console.log('x');

  session.onLogin(() => { dispatch(setLogger(true)); });
  session.onLogout(() => { dispatch(setLogger(false)); });

  session.onError(() => { alert('interaction with solid ended up with an error.'); });
  session.onSessionRestore(() => { alert('solid session is restored'); });
  session.onSessionExpiration(() => { alert('solid session has expired'); });

  handleRedirectAfterLogin(session);

  return (
    <div style={{ top: '10px', right: '10px', zIndex: 1000, position: 'absolute' }}>
      <LoggerButton />
    </div>
  );
}
