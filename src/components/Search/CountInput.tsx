import { useEffect, useRef, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { setCount } from '../../features/searchSlice';

export function CountInput(): JSX.Element {

  const [valid, setValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.search.count);

  useEffect(() => {
    if (inputRef.current) { inputRef.current!.value = count.toString(); }
  }, [count]);

  const checkIn = (input: string) => {

    var c = parseInt(input);
    var s = input !== "" && c >= 0 && c <= 1000;

    setValid(s);
    if (s) { dispatch(setCount(c)); }
  };

  return (
    <Form.Group className='mt-4 mb-4'>
      <Form.Label>Count</Form.Label>
      <InputGroup>
        <Form.Control ref={inputRef} type='number' defaultValue={count} min={1} max={1000}
                      step={1} isInvalid={!valid} onChange={(e) => { checkIn(e.target.value); }} />
        <InputGroup.Text>pts</InputGroup.Text>
      </InputGroup>
      <Form.Text>integer between 0 and 1000</Form.Text>
    </Form.Group>
  );
}
