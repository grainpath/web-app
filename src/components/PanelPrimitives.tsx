import { ReactElement } from "react";
import { Form } from "react-bootstrap";
import {
  DeleteOutline,
  DescriptionOutlined,
  KeyboardCommandKey,
  LocationOn,
  Search,
  Storage
} from "@mui/icons-material";

export type SimpleButtonProps = {
  onClick?: React.MouseEventHandler<Element>;
};

export const lineContainerStyle = {
  style: { display: "flex", alignContent: "center", gap: "0.5rem" } as React.CSSProperties
};

export const lineContainerProps = {
  style: lineContainerStyle.style
};

export const keywordBadgeProps = {
  pill: true,
  bg: "success",
  style: { margin: "0.2rem" } as React.CSSProperties
};

export type LineLabelFieldProps = {
  label: string;
};

export function LineLabelField({ label }: LineLabelFieldProps): JSX.Element {
  return (<Form.Control type="text" value={label} readOnly />);
}

export const centerContainerProps = {
  style: { display: "flex", justifyContent: "center" } as React.CSSProperties
};

type PanelButtonProps = SimpleButtonProps & {
  disabled: boolean;
}

export function PanelButton(props: PanelButtonProps): JSX.Element {

  return (
    <div style={{ top: "10px", left: "10px", zIndex: 1000, position: "absolute" }}>
      <button {...props} id="panel-button" className="standard-button control-button" title="Control panel">
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
};

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
  return (<StandardButton {...props} icon={<DescriptionOutlined fontSize="large" />} title="Inspect item" />);
}

export function DeleteButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<DeleteOutline fontSize="large" />} title="Delete item" />);
}

type MarkerButtonProps = {
  kind: string;
  onMarker: React.MouseEventHandler<HTMLElement>;
};

export function MarkerButton({ kind, onMarker }: MarkerButtonProps) {
  return (<StandardButton onClick={onMarker} icon={<LocationOn id={`${kind}-marker`} fontSize="large" />} title="Marker button" />);
}

type MarkerLineProps = {
  kind: string;
  label?: string;
  onMarker: React.MouseEventHandler<HTMLButtonElement>;
};

type RemovableMarkerLineProps = MarkerLineProps & {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
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
      <Form.Group>
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
