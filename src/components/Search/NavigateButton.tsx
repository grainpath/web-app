import { Button } from "react-bootstrap";

export function NavigateButton(): JSX.Element {

  const navigate = () => {
    // try {
    //   setComm(true);
    //   const response = await grainpathFetch(GRAINPATH_SHORT_URL, { source: source, target: target, waypoints: sequence.map(place => place.location) });
    //   const result = (await response.json()) as Result;
    //   dispatch(setResult(result));
    //   navigate(RESULT_ADDR);
    // }
    // finally { setComm(false); }
  };
  
  return (
    <div className="mt-4" style={{ display: "flex", justifyContent: "center" }}>
      <Button variant="primary">Navigate</Button>
    </div>
  );
}
