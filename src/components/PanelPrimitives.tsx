import { ReactElement } from "react";
import { Badge, Form } from "react-bootstrap";
import {
  AddLocation,
  DeleteOutline,
  DescriptionOutlined,
  Info,
  KeyboardCommandKey,
  LocationOn,
  Search,
  Storage
} from "@mui/icons-material";

import { MaybePlace } from "../utils/grainpath";

export const standardContainerClassName = "mt-2 mb-2";

export type SimpleButtonProps = {
  onClick?: React.MouseEventHandler<Element>;
};

export const lineContainerStyle = {
  style: { display: "flex", alignContent: "center", gap: "0.5rem" } as React.CSSProperties
};

export const lineContainerProps = {
  className: standardContainerClassName,
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
  className: standardContainerClassName,
  style: { display: "flex", justifyContent: "center" } as React.CSSProperties
};

type PanelButtoonProps = SimpleButtonProps & {
  disabled: boolean;
}

export function PanelButton(props: PanelButtoonProps): JSX.Element {

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



























// type HoleMarkerProps = SimpleButtonProps & {
//   classRef: string;
// }

type MarkerButtonPropsX = {
  onMarker?: React.MouseEventHandler<Element>;
}

type HoleMarkerProps = MarkerButtonPropsX & {
  classRef: string;
}

function HoleMarker({ classRef, onMarker }: HoleMarkerProps): JSX.Element {
  return (<LocationOn className={`${classRef}-marker`} fontSize="large" onClick={onMarker} style={{ cursor: "pointer" }} />);
}

function SourceMarker(props: MarkerButtonPropsX): JSX.Element {
  return (<HoleMarker {...props} classRef="source" />);
}

function TargetMarker(props: MarkerButtonPropsX): JSX.Element {
  return (<HoleMarker {...props} classRef="target" />);
}

function CenterMarker(props: MarkerButtonPropsX): JSX.Element {
  return (<HoleMarker {...props} classRef="center" />);
}

function KnownMarker(props: MarkerButtonPropsX): JSX.Element {
  return (<HoleMarker {...props} classRef="known" />);
}

function OtherMarker(props: MarkerButtonPropsX): JSX.Element {
  return (<HoleMarker {...props} classRef="other" />);
}

function AddingMarker(props: SimpleButtonProps): JSX.Element {
  return (<AddLocation {...props} className="adding-marker" fontSize="large" />);
}

type ListItemLabelProps = {
  label?: string;
  className?: string;
};

function ListItemLabel({ label, className }: ListItemLabelProps): JSX.Element {
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box", borderBottom: "solid #ced4da 1px" }}>
      <span style={{ fontSize: "large" }}>{label}</span>
    </div>
  );
}

type FreeListItemProps = MarkerButtonPropsX & {
  left: ReactElement;
  label:  string;
};

function FreeListItem({ left, label, onMarker }: FreeListItemProps): JSX.Element {
  const style = { display: "flex", gap: "0.2rem", alignItems: "stretch", cursor: "pointer" };

  return (
    <div onClick={onMarker} className="mt-3 mb-3" style={style}>
      <>
        {left}
        <ListItemLabel className="vacant-placeholder" label={label} />
      </>
    </div>
  );
}

export function FreeSourceMarkerItem(props: MarkerButtonPropsX): JSX.Element {
  return (<FreeListItem {...props} left={<SourceMarker />} label="Select starting point..." />)
}

export function FreeTargetMarkerItem(props: MarkerButtonPropsX): JSX.Element {
  return (<FreeListItem {...props} left={<TargetMarker />} label="Select destination..." />);
}

export function FreeCenterMarkerItem(props: MarkerButtonPropsX): JSX.Element {
  return (<FreeListItem {...props} left={<CenterMarker />} label="Select position..." />);
}

export function FreeAddingMarkerItem(props: MarkerButtonPropsX): JSX.Element {
  return (<FreeListItem {...props} left={<AddingMarker />} label="Append point..." />); 
}

type BusyListItemProps = {
  left: ReactElement;
  label: string;
  right: ReactElement;
};

function BusyListItem({ left, label, right }: BusyListItemProps): JSX.Element {
  const style = { display: "flex", gap: "0.2rem", alignItems: "stretch"};

  return (
    <div className="mt-4 mb-4" style={style}>
      {left}
      <ListItemLabel label={label} />
      {right}
    </div>
  );
}

type RemovableListItemProps = {
  left: ReactElement;
  label: string;
  onDelete: React.MouseEventHandler<Element>;
};

function RemovableListItem({ onDelete, ...rest }: RemovableListItemProps): JSX.Element {
  return (
    <BusyListItem {...rest} right={<DeleteOutline onClick={onDelete} className="center-marker" fontSize="large" />} /> // TODO: fix className
  );
}

type RemovableMarkerItemProps = {
  label: string;
  onDelete: React.MouseEventHandler<Element>;
  onMarker: React.MouseEventHandler<Element>;
}

export function RemovableKnownMarkerItem({ onMarker, ...rest }: RemovableMarkerItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<KnownMarker onMarker={onMarker} />} />);
}

export function RemovableOtherMarkerItem({ onMarker, ...rest }: RemovableMarkerItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<OtherMarker onMarker={onMarker} />} />);
}

export function RemovableSourceMarkerItem({ onMarker, ...rest }: RemovableMarkerItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<SourceMarker onMarker={onMarker} />} />);
}

export function RemovableTargetMarkerItem({ onMarker, ...rest }: RemovableMarkerItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<TargetMarker onMarker={onMarker} />} />);
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
