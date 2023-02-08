import type { SimpleButtonProps } from "../types";
import { DeleteSweepOutlined } from "@mui/icons-material";

export default function EraseButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick}>
      <DeleteSweepOutlined fontSize="large" />
    </button>
  );
}
