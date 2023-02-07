import type { SimpleButtonProps } from "./types";
import {
  Login
} from "@mui/icons-material";

function LoggerButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button id='login-button' className='standard-button control-button' onClick={onClick}>
      <Login fontSize='large' />
    </button>
  );
}

export default function LoggerControl():JSX.Element {

  // TODO: logging logic

  return (
    <LoggerButton onClick={() => {}} />
  );
}
