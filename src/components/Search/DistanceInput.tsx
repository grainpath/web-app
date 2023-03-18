import { useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setDistance } from "../../features/discoverSlice";

export function DistanceInput(): JSX.Element {

  const [valid, setValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const distance = useAppSelector(state => state.discover.distance);

  useEffect(() => {
    if (inputRef.current) { inputRef.current!.value = distance.toString(); }
  }, [distance]);

  const check = (input: string) => {
    var d = parseFloat(input);
    var v = input !== "" && d >= 0.0 && d <= 30.0;
    setValid(v);
    if (v) { dispatch(setDistance(d)); }
  };

  return (
    <Form.Group className="mt-4">
      <Form.Label>How far are you willing to walk?</Form.Label>
      <InputGroup>
        <Form.Control ref={inputRef} type="number" defaultValue={distance} min={0} max={30.0} step={0.1} isInvalid={!valid} onChange={(e) => { check(e.target.value); }} />
        <InputGroup.Text>km</InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
}
