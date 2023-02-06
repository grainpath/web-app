import React from 'react';
import {
  DeleteSweep,
  Search,
  Storage,
} from '@mui/icons-material';

type SimpleButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function SearchButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button id='search-button' className='standard-button control-button' onClick={onClick}>
      <Search fontSize='large' />
    </button>
  );
}

export function RemoteButton({ onClick }: SimpleButtonProps): JSX.Element {
  return (
    <button className="standard-button" onClick={onClick}>
      <Storage fontSize="large" />
    </button>
  );
}

export function EraseButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className='standard-button' onClick={onClick}>
      <DeleteSweep fontSize='large' />
    </button>
  );
}
