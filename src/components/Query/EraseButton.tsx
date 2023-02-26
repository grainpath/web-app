import type { SimpleButtonProps } from "../types";
import { DeleteSweepOutlined } from "@mui/icons-material";

export default function EraseButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick} title='Clear form'>
      <DeleteSweepOutlined fontSize="large" />
    </button>
  );
}
