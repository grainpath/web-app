import { useState } from "react";
import {
  Box,
  Checkbox,
  Stack,
  Typography
} from "@mui/material";
import { PlaceCondition } from "../../domain/types";
import PlaceConditionModal from "./PlaceConditionModal";

type PlacesFilterProps = {

  /** Flag is set if this condition is satisfied by some place */
  found: boolean;

  /** Indicate if the user has selected this filter */
  active: boolean;

  /** Condition that forms filter */
  condition: PlaceCondition;

  /** Toggle filter selection */
  onToggle: () => void;
};

export default function PlacesFilter({ found, active, condition, onToggle }: PlacesFilterProps): JSX.Element {

  const [modal, setModal] = useState(false);

  return (
    <Box>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Checkbox disabled={!found} checked={active} onChange={onToggle} />
        <div onClick={() => { setModal(true); }} style={{ cursor: "pointer" }}>
          <Typography sx={{ textDecorationLine: found ? undefined : "line-through", color: found ? undefined : "grey" }}>
            {condition.keyword}
          </Typography>
        </div>
      </Stack>
      {modal && <PlaceConditionModal onHide={() => { setModal(false); }} condition={condition} />}
    </Box>
  );
}