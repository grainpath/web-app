import React from 'react';
import {
  Search,
  DeleteSweep,
  InsertDriveFileOutlined,
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

export function EraseButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className='standard-button' onClick={onClick}>
      <DeleteSweep fontSize='large' />
    </button>
  );
}

export function ListButton({ onClick }: SimpleButtonProps): JSX.Element {
  return (
    <button className="standard-button" onClick={onClick}>
      <InsertDriveFileOutlined fontSize="large" />
    </button>
  );
}
