import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { EraseButton, ListButton } from './Button';

type PanelProps = {
  visibility: boolean;
  onHide: React.MouseEventHandler<HTMLButtonElement>;
}

export function Panel({ visibility, onHide }: PanelProps) {

  return(
    <Offcanvas show={visibility} onHide={onHide} scroll={true} backdrop={false} keyboard={false}>
      <Offcanvas.Header closeButton>
        <EraseButton onClick={() => {}} />
        <ListButton onClick={() => {}} />
      </Offcanvas.Header>
    </Offcanvas>
  );
}
