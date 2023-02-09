import { useContext, useEffect, useState, } from 'react';
import { Button, Form, Modal, } from 'react-bootstrap';
import { VCARD } from '@inrupt/vocab-common-rdf';
import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  Thing,
} from '@inrupt/solid-client';
import { Login, } from '@mui/icons-material';
import { AppContext, } from '../App';
import { useAppDispatch, useAppSelector, } from '../features/hooks';
import { SimpleButtonProps, } from './types';
import { setLoggedIn, setUserName, } from '../features/loggerSlice';

const CLIENT_NAME = 'GrainPath App';
const DEFAULT_PROVIDER = 'https://';
const WELL_KNOWN_PROVIDERS: Array<{ label: string }> = [
  {
    label: 'https://inrupt.net/',
  },
  {
    label: 'https://solidcommunity.net/',
  },
  {
    label: 'https://solidweb.org/',
  },
];

const SOLID_LOGO_FILENAME = '/solid/logo.svg';
const ASSETS_FOLDER =  process.env.PUBLIC_URL + '/assets';

type ButtonProps = SimpleButtonProps & {
  isLoggedIn: boolean;
}

type DialogProps = {
  onHide: React.MouseEventHandler<HTMLButtonElement>;
}

function StatusButton({ onClick, isLoggedIn }: ButtonProps): JSX.Element {

  return (
    <button id='login-button' className='standard-button control-button' onClick={onClick}>
      { !isLoggedIn ? <Login fontSize='large' /> : <img src={ASSETS_FOLDER + SOLID_LOGO_FILENAME} alt={SOLID_LOGO_FILENAME} /> }
    </button>
  );
}

function LoginDialog({ onHide }: DialogProps): JSX.Element {

  const [isLogging, setIsLogging] = useState(false);
  const [provider, setProvider] = useState(DEFAULT_PROVIDER);

  const session = useContext(AppContext).inrupt.session;

  const login = async () => {

    setIsLogging(true);

    try {
      await session.login({
        oidcIssuer: provider,
        clientName: CLIENT_NAME,
        redirectUrl: window.location.href
      });
    } catch(ex) { alert('[Login failure] ' + ex); }

    setIsLogging(false);
  };

  const list = 'list-solid-providers';

  return (
    <>
      <Modal.Body>
        <Form.Label>Enter an address of a Solid Pod provider.</Form.Label>
        <Form.Control autoFocus list={list} defaultValue={provider} type='text' onChange={(e) => setProvider(e.target.value)} />
        <datalist id={list}>{
          WELL_KNOWN_PROVIDERS.map((item, idx) => <option key={idx} value={item.label}></option>)
        }</datalist>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide} disabled={isLogging}>Close</Button>
        <Button variant='primary' onClick={login} disabled={isLogging}>Login</Button>
      </Modal.Footer>
    </>
  );
}

function LogoutDialog({ onHide }: DialogProps): JSX.Element {

  const session = useContext(AppContext).inrupt.session;

  const dispatch = useAppDispatch();
  const userName = useAppSelector(state => state.logger.userName);
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  useEffect(() => {

    if (isLoggedIn && !userName) {

      let fetcher = async () => {

        let wid = session.info.webId!;
        let url = new URL(wid); url.hash = '';
        return getSolidDataset(url.href, { fetch: session.fetch })
          .then(dataset => { return getThing(dataset, wid); })
          .then(profile => { return getStringNoLocale(profile as Thing, VCARD.fn); })
          .then(name => {
            if (name) { dispatch(setUserName(name)); }
            console.log('Fetched user name ' + name + '.');
          })
          .catch((ex) => alert('[UserName fetch] ' + ex));
      };

      fetcher();
    }
  }, [dispatch, isLoggedIn, session, userName]);

  const label = (userName) ? userName : session.info.webId;

  return (
    <>
      <Modal.Body>
        Logged in as <a href={session.info.webId} rel='noreferrer' target='_blank'>{label}</a>.
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>Close</Button>
        <Button variant='primary' onClick={() => session.logout()}>Logout</Button>
      </Modal.Footer>
    </>
  );
}

export default function LoggerControl():JSX.Element {

  const [showDialog, setShowDialog] = useState(false);
  const toggleDialog = () => setShowDialog(!showDialog);

  const dispatch = useAppDispatch();
  const session = useContext(AppContext).inrupt.session;
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  session.removeAllListeners();

  session.onLogin(() => {
    dispatch(setLoggedIn(true));
    console.log('Session ' + session.info.sessionId + ' logged in.');
  });

  session.onLogout(() => {
    dispatch(setLoggedIn(false)); toggleDialog();
    console.log('Session ' + session.info.sessionId + ' logged out.');
  });

  session.onError(() => {
    alert('Interaction with solid ended up with an error.');
  });

  session.onSessionRestore(() => { alert('Solid session is restored.'); });
  session.onSessionExpiration(() => { alert('Solid session has expired.'); });

  session.handleIncomingRedirect(window.location.href);

  return (
    <>
      <div style={{ top: '10px', right: '10px', zIndex: 1000, position: 'absolute' }}>
        <StatusButton onClick={() => setShowDialog(!showDialog)} isLoggedIn={isLoggedIn} />
      </div>
      <Modal show={showDialog} onHide={toggleDialog} backdrop='static' centered={true} keyboard={false}>
        <Modal.Header />
        { !isLoggedIn ? <LoginDialog onHide={toggleDialog} /> : <LogoutDialog onHide={toggleDialog} /> }
      </Modal>
    </>
  );
}
