import { Button } from "react-bootstrap";
import { useAppSelector } from "../../features/hooks";

export default function DiscoverButton(): JSX.Element {

  const mod = useAppSelector(state => state.search.mod);

  const source = useAppSelector(state => state.discover.source);
  const target = useAppSelector(state => state.discover.target);

  const routes = () => {

  };

  const places = () => {

  };

  const discover = () => {
    mod ? routes() : places();
  };

  return (
    <div className="mt-4" style={{ display: "flex", justifyContent: "center" }}>
      <Button disabled={!source || !target} variant="primary" onClick={() => { discover(); }}>Discover</Button>
    </div>
  );
}
