import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { setRemote, setSearch } from '../../features/panelsSlice';
import { SearchButton, RemoteButton } from '../PanelControl';

export function ResultHeader(): JSX.Element {

  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  return (
    <>
      <SearchButton onClick={() => dispatch(setSearch())} />
      <RemoteButton onClick={() => dispatch(setRemote())} disabled={!isLoggedIn} />
    </>
  );
}

export function ResultBody(): JSX.Element {

  return (<></>);
}
