import { ReactElement } from "react";
import { DeleteOutline, Route } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { PinKind } from "./shared-types";
import { HolePinButton } from "./shared-pin-buttons";

type ListItemLabelProps = {
  label?: string;
};

function ListItemLabel({ label }: ListItemLabelProps): JSX.Element {

  return (
    <div className="grain-list-item-label" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
      <Typography noWrap>{label}</Typography>
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
    <div onClick={onClick} style={{ display: "flex", alignItems: "stretch", cursor: "pointer", color: "gray" }}>
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
  return (<FreeListItem {...props} left={<FreePinListItem kind="center" />} label="Select point..." />);
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
    <div style={{ display: "flex", alignItems: "stretch" }}>
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
    <BusyListItem
      {...rest}
      right={<IconButton onClick={onDelete} size="small"><DeleteOutline className="grain-action-btn" /></IconButton>}
    />
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

  /** Action upon clicking on the marker. */
  onMarker: React.MouseEventHandler<Element>;

  /** Label of the pin presented to the user. */
  label: string;

  /** Action upon clicking on the remove button. */
  onDelete: React.MouseEventHandler<Element>;
};

export function RemovableSourceListItem({ onMarker, ...rest }: ConcreteRemovableListItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<BusyPinListItem kind="source" onMarker={onMarker} />} />);
}

export function RemovableTargetListItem({ onMarker, ...rest }: ConcreteRemovableListItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<BusyPinListItem kind="target" onMarker={onMarker} />} />);
}

type SimplePinListItemProps = {

  /** Kind of a pin presented to the user. */
  kind: PinKind;

  /** Action upon clicking on the marker. */
  onMarker: React.MouseEventHandler<Element>;

  /** Label on the item presented to the user. */
  label: string;
};

export function SimplePinListItem({ label, ...rest }: SimplePinListItemProps): JSX.Element {
  return (<BusyListItem left={<BusyPinListItem {...rest} />} label={label} right={<></>} />)
}

type RemovablePinListItemProps = SimplePinListItemProps & {

  /** Action upon clicking on the delete button. */
  onDelete: React.MouseEventHandler<Element>;
};

export function RemovablePinListItem({ kind, onMarker, ...rest }: RemovablePinListItemProps): JSX.Element {
  return (<RemovableListItem {...rest} left={<BusyPinListItem kind={kind} onMarker={onMarker} />} />);
}

type MenuPinListItemProps = SimplePinListItemProps & {

  /** Menu element, typically a button with an icon and a popup. */
  menu: ReactElement;
};

export function MenuPinListItem({ label, menu, ...rest }: MenuPinListItemProps): JSX.Element {
  return (<BusyListItem left={<BusyPinListItem {...rest} />} label={label} right={menu} />);
}

type MenuRouteListItemProps = {
  label: string;
  onIcon: () => void;
  menu: ReactElement;
};

export function MenuRouteListItem({ label, onIcon, menu }: MenuRouteListItemProps): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <IconButton onClick={onIcon} size="small">
        <Route fontSize="medium" sx={{ color: "grey" }} />
      </IconButton>
      <ListItemLabel label={label} />
      {menu}
    </div>
  )
}
