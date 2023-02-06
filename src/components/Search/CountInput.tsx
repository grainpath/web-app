import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { setCount } from '../../features/searchSlice';

export function CountInput(): JSX.Element {

  const [valid, setValid] = useState(true);

  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.search.count);

  const verify = (input: string) => {

    var c = parseInt(input);
    var s = input !== "" && c >= 0 && c <= 1000;

    setValid(s);
    if (s) { dispatch(setCount(c)); }
  };

  return (
    <Form.Group className='mb-2'>
      <Form.Label>Count</Form.Label>
      <InputGroup>
        <Form.Control type='number' defaultValue={count} min={1} max={1000} step={1} isInvalid={!valid} onChange={(e) => { verify(e.target.value); }} />
        <InputGroup.Text>pts</InputGroup.Text>
      </InputGroup>
      <Form.Text>Integer between 0 and 1000.</Form.Text>
    </Form.Group>
  );
}
