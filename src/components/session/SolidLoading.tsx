import {
  Box,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { SomethingKind } from "../shared/types";

type SessionSolidLoadingProps = {
  cur?: number;
  tot?: number;
  what: SomethingKind;
}

export default function SolidLoading({ cur, tot, what }: SessionSolidLoadingProps): JSX.Element {

  const label = what.slice(0, 1).toUpperCase() + what.slice(1);
  const progress = (cur && tot) ? Math.min((cur / tot * 100), 100) : 0;

  return (
    <Stack gap={2}>
      <Typography>{label}s: {cur ?? "?"} / {tot ?? "?"}</Typography>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </Stack>
  );
}
