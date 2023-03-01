import { DeleteSweepOutlined } from "@mui/icons-material";

import type { SimpleButtonProps } from "../types";

export default function EraseButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick} title='Clear all'>
      <DeleteSweepOutlined fontSize="large" />
    </button>
  );
}
