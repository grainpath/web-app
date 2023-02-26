import { useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { setCount } from "../../features/searchSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

export function CountInput(): JSX.Element {

  const defaultInput = "";
  const minVal = 1, maxVal = 1000;

  const [valid, setValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.search.count);

  useEffect(() => {
    if (inputRef.current) { inputRef.current!.value = count.toString(); }
  }, [count]);

  const checkIn = (input: string) => {
    var c = parseInt(input);
    var s = input !== defaultInput && c >= minVal && c <= maxVal;

    setValid(s);
    if (s) { dispatch(setCount(c)); }
  };

  return (
    <Form.Group className="mt-4 mb-4">
      <Form.Label>Count</Form.Label>
      <InputGroup>
        <Form.Control ref={inputRef} type="number" defaultValue={count} min={minVal} max={maxVal}
          step={1} isInvalid={!valid} onChange={(e) => { checkIn(e.target.value); }} />
        <InputGroup.Text>pts</InputGroup.Text>
      </InputGroup>
      <Form.Text>integer between {minVal} and {maxVal}</Form.Text>
    </Form.Group>
  );
}
