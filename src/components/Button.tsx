import React from 'react';
import {
  ArrowBackOutlined,
  DeleteSweepOutlined,
  LocationOn,
  Search,
  Storage,
} from '@mui/icons-material';

type SimpleButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

type MarkerButtonProps = SimpleButtonProps & {
  kind: string;
  buttonStyle: React.CSSProperties | undefined;
}

export function PanelButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button id='search-button' className='standard-button control-button' onClick={onClick}>
      <Search fontSize='large' />
    </button>
  );
}

export function RemoteButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className='standard-button' onClick={onClick}>
      <Storage fontSize='large' />
    </button>
  );
}

export function EraseButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className='standard-button' onClick={onClick}>
      <DeleteSweepOutlined fontSize='large' />
    </button>
  );
}

export function ReturnButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className='standard-button' onClick={onClick}>
      <ArrowBackOutlined fontSize='large' />
    </button>
  );
}

export function MarkerButton({ onClick, kind, buttonStyle }: MarkerButtonProps) {
  return (
    <button className="standard-button" onClick={onClick} style={buttonStyle}>
      <LocationOn id={`${kind}-marker`} fontSize="large" />
    </button>
  );
}
