import { IconButton } from "@mui/material";
import { AddLocation, LocationOn } from "@mui/icons-material";

type PinSize = "large" | "medium";
export type PinKind = "stored" | "tagged" | "source" | "target" | "adding" | "center" | "custom";

type PinProps = {
  kind: PinKind;
  size?: PinSize;
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
