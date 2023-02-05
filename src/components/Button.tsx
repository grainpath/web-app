import React from 'react';
import { BsSearch } from 'react-icons/bs';

type SearchButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function SearchButton({ onClick }: SearchButtonProps) {

  return (
    <button id='search-button' className='standard-button control-button' onClick={onClick}>
      <BsSearch fontSize='1.5rem' />
    </button>
  );
}
