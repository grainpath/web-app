import { setSearch } from "../features/panelsSlice";
import { useAppDispatch } from "../features/hooks";
import { ReturnButton } from "./Button";

export function ResultHeader(): JSX.Element {

  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    dispatch(setSearch());
  }

  return (
    <>
      <ReturnButton onClick={handleClick} />
    </>
  );
}

export function ResultBody(): JSX.Element {

  return (<></>);
}
