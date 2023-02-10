import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  KeyboardCommandKey,
  LocationOn,
  Search,
  Storage,
} from '@mui/icons-material';
import { marker2view } from '../utils/funcs';
import type { SimpleButtonProps } from './types';
import { Point, PanelView } from '../utils/types';
import { useAppSelector } from '../features/hooks';
import { RemoteHeader, RemoteBody } from './Remote/RemoteView';
import { ResultHeader, ResultBody } from './Result/ResultView';
import { SearchHeader, SearchBody } from './Search/SearchView';

type PanelProps = {
  visibility: boolean;
  onHide: React.MouseEventHandler<HTMLButtonElement>;
}

type MarkerLineProps = {
  kind: string;
  point?: Point;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

type MarkerButtonProps = SimpleButtonProps & {
  kind: string;
  buttonStyle: React.CSSProperties | undefined;
}

type RemoteButtonProps = SimpleButtonProps & {
  disabled: boolean;
}

function Button({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button id='search-button' className='standard-button control-button' onClick={onClick} title='Control'>
      <KeyboardCommandKey fontSize='large' />
    </button>
  );
}

function Panel({ visibility, onHide }: PanelProps) {

  const panel = useAppSelector(state => state.panels.value);

  return(
    <Offcanvas show={visibility} onHide={onHide} scroll={true} backdrop={false} keyboard={false}>
      <Offcanvas.Header closeButton>
        {panel === PanelView.Search && <SearchHeader />}
        {panel === PanelView.Result && <ResultHeader />}
        {panel === PanelView.Remote && <RemoteHeader />}
      </Offcanvas.Header>
      <Offcanvas.Body>
        {panel === PanelView.Search && <SearchBody />}
        {panel === PanelView.Result && <ResultBody />}
        {panel === PanelView.Remote && <RemoteBody />}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default function PanelControl(): JSX.Element {

  const [panel, setPanel] = useState(false);

  return (
    <>
      <div style={{ top: '10px', left: '10px', zIndex: 1000, position: 'absolute' }}>
        <Button onClick={() => setPanel(true)} />
      </div>
      <Panel visibility={panel} onHide={() => setPanel(false)} />
    </>
  )
}

export function SearchButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick} title='Search pane'>
      <Search fontSize="large" />
    </button>
  );
}

export function RemoteButton({ onClick, disabled }: RemoteButtonProps): JSX.Element {

  return (
    <button className='standard-button' onClick={onClick} disabled={disabled} title='Remote storage'>
      <Storage fontSize='large' />
    </button>
  );
}

export function MarkerButton({ onClick, kind, buttonStyle }: MarkerButtonProps) {

  return (
    <button className="standard-button" onClick={onClick} style={buttonStyle} title='Marker button'>
      <LocationOn id={`${kind}-marker`} fontSize="large" />
    </button>
  );
}

export function SteadyMarkerLine({ kind, point, onClick }: MarkerLineProps) {

  return (
    <div className='mt-2 mb-2'>
      <div className="marker-line">
        <MarkerButton onClick={onClick} kind={kind} buttonStyle={{ marginRight: "0.5rem" }} />
        <Form.Control type='text' placeholder={(point) ? marker2view(point) : ""} disabled readOnly />
      </div>
    </div>
  );
}
