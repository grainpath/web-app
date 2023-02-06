import Offcanvas from 'react-bootstrap/Offcanvas';
import { PanelView } from '../utils/types';
import { useAppSelector } from '../features/hooks';
import { RemoteHeader, RemoteBody } from './Remote';
import { ResultHeader, ResultBody } from './Result';
import { SearchHeader, SearchBody } from './Search';

type PanelProps = {
  visibility: boolean;
  onHide: React.MouseEventHandler<HTMLButtonElement>;
}

export function Panel({ visibility, onHide }: PanelProps) {

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
