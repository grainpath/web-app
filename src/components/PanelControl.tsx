import { ReactElement } from "react";
import { Form, Stack } from "react-bootstrap";
import { Chip } from "@mui/material";
import { Info, KeyboardCommandKey, LocationOn, Search, Storage } from "@mui/icons-material";
import { point2view } from "../utils/functions";
import type { SimpleButtonProps } from "./types";
import { LightGrain, Point } from "../domain/types";

type StandardButtonProps = {
  title: string;
  icon: ReactElement;
  onClick: React.MouseEventHandler<HTMLElement>;
}

type MarkerLineProps = {
  kind: string;
  point?: Point;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

type MarkerButtonProps = SimpleButtonProps & {
  kind: string;
  buttonStyle: React.CSSProperties | undefined;
}

type LightGrainPopupProps = SimpleButtonProps & {
  grain: LightGrain;
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

export function LightGrainPopup({ grain, ...rest }: LightGrainPopupProps): JSX.Element {

  const name = (!!grain.tags.name) ? grain.tags.name : "Noname"

  return (
    <>
      <b>{name}</b>
      {
        (!!grain.id) &&
        <>
          <hr style={{opacity: 1.0, margin: "0.25rem 0"}} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <button {...rest} className="standard-button" style={{ borderRadius: "50%" }} disabled={!grain.id}>
              <Info fontSize="large" />
            </button>
            <Stack direction="horizontal" gap={1}>
              {
                grain.keywords.map((keyword, i) => <Chip key={i} color="success" label={keyword} size="small" />)
              }
            </Stack>
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
