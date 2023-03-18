import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { VCARD } from "@inrupt/vocab-common-rdf";
import { getPodUrlAll, getSolidDataset, getStringNoLocale, getThing, Thing } from "@inrupt/solid-client";
import { fetch, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { Login } from "@mui/icons-material";
import { SteadyModalProps, SteadyModalPropsFactory } from "./shared-types";
import { SimpleButtonProps } from "./PanelPrimitives";
import { initSolidSession, SOLID_WELL_KNOWN_PROVIDERS } from "../utils/solid";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { erase, setPodList } from "../features/lockerSlice";
import { setLoggedIn, setUserName } from "../features/loggerSlice";

const SOLID_LOGO_FILENAME = "/solid/logo.svg";
const ASSETS_FOLDER =  process.env.PUBLIC_URL + "/assets";

type ButtonProps = SimpleButtonProps & {
  isLoggedIn: boolean;
}

type DialogProps = SteadyModalProps & {
  show: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function StatusButton({ onClick, isLoggedIn }: ButtonProps): JSX.Element {

  return (
    <button id="login-button" className="standard-button control-button" onClick={onClick} title={ !isLoggedIn ? "Log in" : "Log out" }>
      { !isLoggedIn ? <Login fontSize="large" /> : <img src={ASSETS_FOLDER + SOLID_LOGO_FILENAME} alt={SOLID_LOGO_FILENAME} /> }
    </button>
  );
}

function LoginDialog({ onClick, ...rest }: DialogProps): JSX.Element {

  const session = getDefaultSession();

  const [logging, setLogging] = useState(false);
  const [provider, setProvider] = useState("https://");

  const login = async () => {

    setLogging(true);

    try {
      if (!session.info.isLoggedIn) {
        await session.login({
          oidcIssuer: provider,
          clientName: "GrainPath App",
          redirectUrl: window.location.href
        });
      }
    } catch (ex) { alert("[Login Error] " + ex); }

    setLogging(false);
  };

  const list = "list-solid-providers";

  return (
    <Modal {...rest}>
      <Modal.Body>
        <Form.Label>Enter an address of a <a href="https://solidproject.org/users/get-a-pod" rel="noopener noreferrer" target="_blank">Solid Pod</a> provider.</Form.Label>
        <Form.Control autoFocus list={list} defaultValue={provider} type='text' onChange={(e) => setProvider(e.target.value)} />
        <datalist id={list}>{
          SOLID_WELL_KNOWN_PROVIDERS.map((prov, idx) => <option key={idx} value={prov}></option>)
        }</datalist>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClick}>Close</Button>
        <Button variant="primary" onClick={login} disabled={logging}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
}

function LogoutDialog({ onClick, ...rest }: DialogProps): JSX.Element {

  const dispatch = useAppDispatch();
  const userName = useAppSelector(state => state.logger.userName);
  const session = getDefaultSession();

  useEffect(() => {

    const fetcher = async () => {
      let wid = session.info.webId!;
      dispatch(setUserName(wid));
      let url = new URL(wid); url.hash = "";

      return getSolidDataset(url.href, { fetch: fetch })
        .then(dataset => getThing(dataset, wid))
        .then(profile => getStringNoLocale(profile as Thing, VCARD.fn))
        .then(name => {
          if (name) { dispatch(setUserName(name)); }
        })
        .catch((ex) => alert("[UserName Error] " + ex));
    };
    fetcher();
  }, [dispatch, session]);

  useEffect(() => {

    const fetcher = async () => {
      const pods = await getPodUrlAll(session.info.webId!);
      dispatch(setPodList(pods));
      if (!pods.length) { alert("[SolidPod Error] No available Solid pods associated with the account."); }
    };
    fetcher();
  }, [dispatch, session]);

  const label = (userName) ? userName : session.info.webId;

  return (
    <Modal {...rest}>
      <Modal.Body>
        Logged in as <a href={session.info.webId} rel="noopener noreferrer" target="_blank">{label}</a>.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClick}>Close</Button>
        <Button variant="danger" onClick={() => session.logout()}>Logout</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function LoggerControl():JSX.Element {

  const dispatch = useAppDispatch();

  const [showLi, setShowLi] = useState(false);
  const [showLo, setShowLo] = useState(false);
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  const fi = () => { dispatch(setLoggedIn(true)); };
  const fo = () => { dispatch(setLoggedIn(false)); dispatch(erase()); setShowLo(false); }

  initSolidSession(fi, fo);

  const click = !isLoggedIn ? () => setShowLi(true) : () => setShowLo(true);

  const li: DialogProps = { ...SteadyModalPropsFactory.getStandard(), show: showLi, onClick: () => setShowLi(false) };
  const lo: DialogProps = { ...SteadyModalPropsFactory.getStandard(), show: showLo, onClick: () => setShowLo(false) };

  return (
    <>
      <div style={{ top: "10px", right: "10px", zIndex: 1000, position: "absolute" }}>
        <StatusButton onClick={click} isLoggedIn={isLoggedIn} />
      </div>
      { !isLoggedIn ? <LoginDialog {...li} /> : <LogoutDialog {...lo} /> }
    </>
  );
}
