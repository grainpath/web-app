import Offcanvas from 'react-bootstrap/Offcanvas';
import { PanelView } from '../utils/types';
import { erase } from '../features/searchSlice';
import { setRemote } from '../features/panelsSlice';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { RemoteButton, EraseButton } from './Button';

type PanelProps = {
  visibility: boolean;
  onHide: React.MouseEventHandler<HTMLButtonElement>;
}

type SearchHeaderProps = {
  erase: React.MouseEventHandler<HTMLButtonElement>;
  remote: React.MouseEventHandler<HTMLButtonElement>;
}

function SearchHeader({ erase, remote }: SearchHeaderProps): JSX.Element {

  return (
    <>
      <RemoteButton onClick={remote} />
      <EraseButton onClick={erase} />
    </>
  );
}

export function Panel({ visibility, onHide }: PanelProps) {

  const dispatch = useAppDispatch();
  const panel = useAppSelector(state => state.panels.value);

  return(
    <Offcanvas show={visibility} onHide={onHide} scroll={true} backdrop={false} keyboard={false}>
      <Offcanvas.Header closeButton>
        {panel === PanelView.Search && <SearchHeader erase={() => { dispatch(erase()) }} remote={() => { dispatch(setRemote()) }} />}
        {panel === PanelView.Result && <></>}
        {panel === PanelView.Result && <></>}
      </Offcanvas.Header>
    </Offcanvas>
  );
}
