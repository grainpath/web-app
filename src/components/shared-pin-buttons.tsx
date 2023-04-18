import { IconButton } from "@mui/material";
import { AddLocation, LocationOn } from "@mui/icons-material";
import { PinKind } from "./shared-types";

type IconSize = "large" | "medium";

type PinProps = {
  kind: PinKind;
  size?: IconSize;
  onMarker?: React.MouseEventHandler<Element>;
};

export function HolePinButton({ kind, size, onMarker }: PinProps): JSX.Element {
  return (
    <IconButton onClick={onMarker} size="small">
      <LocationOn className={`grain-${kind}-pin`} fontSize={size} />
    </IconButton>
  );
}

export function PlusPinButton({ kind, size, onMarker }: PinProps): JSX.Element {
  return (
    <IconButton onClick={onMarker}>
      <AddLocation className={`grain-${kind}-pin`} fontSize={size} />
    </IconButton>
  );
}
