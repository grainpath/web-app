import { ReactElement } from "react";
import { Badge, Form } from "react-bootstrap";
import { Info, KeyboardCommandKey, LocationOn, Search, Storage } from "@mui/icons-material";
import { point2view } from "../utils/functions";
import type { SimpleButtonProps } from "./types";
import { LightGrain, Point } from "../domain/types";

type StandardButtonProps = {
  title: string;
  icon: ReactElement;
  onClick: React.MouseEventHandler<HTMLElement>;
}

type CenteredContainerProps = { element: ReactElement; }

type MarkerLineProps = {
  kind: string;
  point?: Point;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

type MarkerButtonProps = SimpleButtonProps & {
  kind: string;
  buttonStyle: React.CSSProperties | undefined;
}

type LightGrainPopupProps = { grain: LightGrain; }

export function CenteredContainer({ element }: CenteredContainerProps): JSX.Element {

  return (
    <div className="mt-2 mb-2" style={{ display: "flex", justifyContent: "center" }}>
      {element}
    </div>
  );
}

export function PanelButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <div style={{ top: "10px", left: "10px", zIndex: 1000, position: "absolute" }}>
      <button id="panel-button" className="standard-button control-button" onClick={onClick} title="Control panel">
        <KeyboardCommandKey fontSize="large" />
      </button>
    </div>
  );
}

export function StandardButton({ icon, ...rest }: StandardButtonProps): JSX.Element {
  return (<button {...rest} className="standard-button">{icon}</button>);
}

export function SearchButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<Search fontSize="large" />} title="Search panel" />);
}

export function LockerButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<Storage fontSize="large" />} title="Locker panel" />);
}

export function LightGrainPopup({ grain }: LightGrainPopupProps): JSX.Element {

  return (
    <>
      <b>{grain.tags.name ?? "Noname"}</b>
      {
        (!!grain.id) &&
        <>
          <hr style={{opacity: 1.0, margin: "0.25rem 0"}} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <button id={(grain.id) ? `popup-${grain.id}` : undefined} className="standard-button" style={{ borderRadius: "50%", marginRight: "0.2rem" }} disabled={!grain.id}>
              <Info fontSize="large" />
            </button>
            <div className="mt-1 mb-1" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", width: "150px" }}>
              {
                grain.keywords.map((keyword, i) => <Badge key={i} bg="success" pill style={{ margin: "0.1rem", display: "block" }}>{keyword}</Badge>)
              }
            </div>
          </div>
        </>
      }
    </>
  );
}

export function MarkerButton({ onClick, kind, buttonStyle }: MarkerButtonProps) {

  return (
    <button className="standard-button" onClick={onClick} style={buttonStyle} title="Marker button">
      <LocationOn id={`${kind}-marker`} fontSize="large" />
    </button>
  );
}

export function SteadyMarkerLine({ kind, point, onClick }: MarkerLineProps) {

  return (
    <div className="mt-2 mb-2">
      <div className="marker-line">
        <MarkerButton onClick={onClick} kind={kind} buttonStyle={{ marginRight: "0.5rem" }} />
        <Form.Control type="text" value={(point) ? point2view(point) : ""} readOnly />
      </div>
    </div>
  );
}
