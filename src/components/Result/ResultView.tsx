import { useAppDispatch } from '../../features/hooks';
import { setRemote, setSearch } from '../../features/panelsSlice';
import { SearchButton, RemoteButton } from '../PanelControl';

export function ResultHeader(): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <>
      <SearchButton onClick={() => { dispatch(setSearch()); }} />
      <RemoteButton onClick={() => { dispatch(setRemote()); }} />
    </>
  );
}

export function ResultBody(): JSX.Element {

  return (<></>);
}
