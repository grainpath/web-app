import { ReactElement } from "react";
import { Badge, Form } from "react-bootstrap";
import {
  DeleteOutline,
  DescriptionOutlined,
  Info,
  KeyboardCommandKey,
  LocationOn,
  Search,
  Storage
} from "@mui/icons-material";

import { LightGrain } from "../utils/grainpath";

export const standardContainerClassName = "mt-2 mb-2";

export type SimpleButtonProps = {
  onClick: React.MouseEventHandler<HTMLElement>;
}

export const lineContanerStyle = {
  style: { display: "flex", alignContent: "center" } as React.CSSProperties
}

export const lineContainerProps = {
  className: standardContainerClassName,
  style: lineContanerStyle.style
}

export type LineLabelFieldProps = {
  label: string;
};

export function LineLabelField({ label }: LineLabelFieldProps): JSX.Element {
  return (<Form.Control type="text" value={label} readOnly />);
}

export const centerContainerProps = {
  className: standardContainerClassName,
  style: { display: "flex", justifyContent: "center" } as React.CSSProperties
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

type StandardButtonProps = {
  icon: ReactElement;
  title?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
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

export function FileButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<DescriptionOutlined fontSize="large" />} title="Inspect item" style={{marginRight: "0.5rem"}} />);
}

export function DeleteButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<DeleteOutline fontSize="large" />} title="Delete item" style={{ marginLeft: "0.5rem" }} />);
}

type MarkerButtonProps = {
  kind: string;
  onMarker: React.MouseEventHandler<HTMLElement>;
};

export function MarkerButton({ kind, onMarker }: MarkerButtonProps) {
  return (
    <StandardButton onClick={onMarker} icon={<LocationOn id={`${kind}-marker`}
      fontSize="large" />} style={{ marginRight: "0.5rem" }} title="Marker button" />
  );
}

type MarkerLineProps = {
  kind: string;
  label?: string;
  onMarker: React.MouseEventHandler<HTMLButtonElement>;
};

export function SteadyMarkerLine({ label, ...rest }: MarkerLineProps) {

  return (
    <div {...lineContainerProps}>
      <MarkerButton {...rest} />
      <LineLabelField label={label ?? ""} />
    </div>
  );
}

type RemovableMarkerLineProps = MarkerLineProps & {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
};

export function RemovableMarkerLine({ label, onDelete, ...rest }: RemovableMarkerLineProps) {

  return (
    <div {...lineContainerProps}>
      <MarkerButton {...rest} />
      <LineLabelField label={label ?? ""} />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

type LightGrainPopupProps = { grain: LightGrain; };

export function LightGrainPopup({ grain }: LightGrainPopupProps): JSX.Element {

  const buttonId = (grain.id) ? `popup-${grain.id}` : undefined;
  const buttonStyle = { borderRadius: "50%", marginRight: "0.2rem" };

  return (
    <>
      <b>{grain.name}</b>
      {
        (!!grain.id) &&
        <>
          <hr style={{opacity: 1.0, margin: "0.25rem 0"}} />
          <div className={standardContainerClassName} style={{ display: "flex", alignItems: "center" }}>
            <button id={buttonId} className="standard-button" style={buttonStyle} disabled={!grain.id}>
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

export type StandardModalProps = {
  centered: boolean;
  keyboard: boolean;
  backdrop: true | false | "static";
};

export const standardModalProps: StandardModalProps = {
  centered: true,
  keyboard: false,
  backdrop: "static"
};

export const maxLockerItemNoteLength = 150;

type UserInputPaneProps = {
  note: string;
  setNote: (note: string) => void;
  modified?: Date;
};

export function UserInputPane({ note, setNote, modified }: UserInputPaneProps): JSX.Element {

  return (
    <>
      <Form.Group className={standardContainerClassName}>
        <Form.Label>
          Note (optional, {maxLockerItemNoteLength - note.length} chars left)</Form.Label>
        <Form.Control as="textarea" value={note} rows={3} maxLength={maxLockerItemNoteLength} onChange={(e) => setNote(e.target.value)} />
      </Form.Group>
      { (modified) &&
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <small style={{ opacity: 0.7 }}>{`modified: ${modified.toLocaleString()}`}</small>
        </div>
      }
    </>
  );
}
