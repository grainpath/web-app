import { useAppDispatch } from '../../features/hooks';
import { setSearch } from '../../features/panelsSlice';
import { SearchButton } from '../PanelControl';

export function RemoteHeader(): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <>
      <SearchButton onClick={() => { dispatch(setSearch()) }} />
    </>
  );
}

export function RemoteBody(): JSX.Element {

  return (<></>);
}
