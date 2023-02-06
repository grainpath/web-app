import { setSearch } from '../features/panelsSlice';
import { useAppDispatch } from '../features/hooks';
import { ReturnButton } from './Button';

export function RemoteHeader(): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <>
      <ReturnButton onClick={() => { dispatch(setSearch()) }} />
    </>
  );
}

export function RemoteBody(): JSX.Element {

  return (<></>);
}
