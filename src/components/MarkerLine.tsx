import { Form } from 'react-bootstrap';
import { Point } from '../utils/types';
import { MarkerButton } from './Button';
import { marker2view } from '../utils/views';

type MarkerLineProps = {
  kind: string;
  point?: Point;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function SteadyMarkerLine({ kind, point, onClick }: MarkerLineProps) {

  return (
    <div className='mt-2 mb-2'>
      <div className="marker-line">
        <MarkerButton onClick={onClick} kind={kind} buttonStyle={{ marginRight: "0.5rem" }} />
        <Form.Control type='text' placeholder={(point) ? marker2view(point) : ""} disabled readOnly />
      </div>
    </div>
  );
}
