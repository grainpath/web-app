import { ReactElement } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { HolePinButton, PinKind } from "./shared-pin-buttons";

type ListItemLabelProps = {
  label?: string;
};

function ListItemLabel({ label }: ListItemLabelProps): JSX.Element {

  return (
    <div className="grain-list-item-label">
      <Typography>{label}</Typography>
    </div>
  );
}

type FreeListItemProps = {
  left: ReactElement;
  label:  string;
  onClick: React.MouseEventHandler<Element>;
};

function FreeListItem({ left, label, onClick }: FreeListItemProps): JSX.Element {

  return (
    <div className="grain-list-item" onClick={onClick} style={{ cursor: "pointer", color: "gray" }}>
      <>
        {left}
        <ListItemLabel label={label} />
      </>
    </div>
  );
}

type ConcreteFreeListItemProps = {
  onClick: React.MouseEventHandler<Element>;
};

function FreePinListItem(props: { kind: PinKind }) {
  return (<HolePinButton {...props} size="medium" />);
}

export function FreeSourceListItem(props: ConcreteFreeListItemProps): JSX.Element {
  return (<FreeListItem {...props} left={<FreePinListItem kind="source" />} label="Select starting point..." />)
}

export function FreeTargetListItem(props: ConcreteFreeListItemProps): JSX.Element {
  return (<FreeListItem {...props} left={<FreePinListItem kind="target" />} label="Select destination..." />);
}

export function FreeCenterListItem(props: ConcreteFreeListItemProps): JSX.Element {
  return (<FreeListItem {...props} left={<FreePinListItem kind="center" />} label="Select position..." />);
}

export function FreeAddingListItem(props: ConcreteFreeListItemProps): JSX.Element {
  return (<FreeListItem {...props} left={<FreePinListItem kind="adding" />} label="Append point..." />); 
}

type BusyListItemProps = {
  left: ReactElement;
  right: ReactElement;
  label: string;
};

function BusyListItem({ left, right, label }: BusyListItemProps): JSX.Element {

  return (
    <div className="grain-list-item">
      {left} <ListItemLabel label={label} /> {right}
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
    <BusyListItem {...rest} right={<IconButton onClick={onDelete} size="small"><DeleteOutline className="grain-action-btn" /></IconButton>} />
  );
}

type BusyPinListItemProps = {
  kind: PinKind;
  onMarker: React.MouseEventHandler<Element>;
};

function BusyPinListItem(props: BusyPinListItemProps) {
  return (<HolePinButton {...props} size="medium" />);
}

type ConcreteRemovableListItemProps = {
  label: string;
  onDelete: React.MouseEventHandler<Element>;
  onMarker: React.MouseEventHandler<Element>;
};

export function RemovableSourceListItem({ onMarker, ...rest }: ConcreteRemovableListItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<BusyPinListItem kind="source" onMarker={onMarker} />} />);
}

export function RemovableTargetListItem({ onMarker, ...rest }: ConcreteRemovableListItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<BusyPinListItem kind="target" onMarker={onMarker} />} />);
}

