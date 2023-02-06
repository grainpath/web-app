import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setDistance } from "../../features/searchSlice";

export function DistanceInput(): JSX.Element {

  const [valid, setValid] = useState(true);

  const dispatch = useAppDispatch();
  const distance = useAppSelector(state => state.search.distance);

  const verify = (input: string) => {

    var d = parseFloat(input);
    var s = input !== "" && d >= 0.0 && d <= 30.0;

    setValid(s);
    if (s) { dispatch(setDistance(d)); }
  };

  return (
    <Form.Group className='mb-2 mt-2'>
      <Form.Label>Distance</Form.Label>
      <InputGroup>
        <Form.Control type='number' defaultValue={distance} min={0} max={30.0} step={0.1} isInvalid={!valid} onChange={(e) => { verify(e.target.value) }} />
        <InputGroup.Text>km</InputGroup.Text>
      </InputGroup>
      <Form.Text>Double between 0.0 and 30.0.</Form.Text>
    </Form.Group>
  );
}
