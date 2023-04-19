import { ReactElement } from "react";
import { IconButton } from "@mui/material";
import {
  AddLocation,
  DeleteOutline,
  Directions,
  LocationOn,
  Route
} from "@mui/icons-material";
import { PlaceKind } from "./shared-types";

type IconWrapperProps = {
  icon: ReactElement
  onClick?: React.MouseEventHandler<Element>;
};

function IconWrapper({ icon, onClick }: IconWrapperProps): JSX.Element {
  return (
    <IconButton onClick={onClick} size="small">
      {icon}
    </IconButton>
  );
}

type RouteButtonProps = {
  onRoute: React.MouseEventHandler<Element>;
};

export function RouteButton({ onRoute }: RouteButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onRoute}
      icon={<Route className="stored-route" fontSize="medium" />}
    />
  );
}

type PlaceButtonProps = {

  /** Kind of a place presented to the user. */
  kind: PlaceKind;

  /** Button event handler. */
  onPlace: React.MouseEventHandler<Element>;
};

export function PlaceButton({ kind, onPlace }: PlaceButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onPlace}
      icon={<LocationOn className={`${kind}-place`} fontSize="medium" />}
    />
  );
}

type AddPlaceButtonProps = PlaceButtonProps & {

  /** Size of an icon. */
  size: "medium" | "large";
};

export function AddPlaceButton({ kind, size, onPlace }: AddPlaceButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onPlace}
      icon={<AddLocation className={`${kind}-place`} fontSize={size} />}
    />
  );
}

type DirecButtonProps = {
  onDirec: React.MouseEventHandler<Element>;
};

export function DirecButton({ onDirec }: DirecButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onDirec}
      icon={<Directions className="stored-direc" fontSize="medium" />}
    />
  );
}

type DeleteButtonProps = {
  onDelete: React.MouseEventHandler<Element>;
};

export function DeleteButton({ onDelete }: DeleteButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onDelete}
      icon={<DeleteOutline sx={{ color: "gray" }} />}
    />
  )
}
