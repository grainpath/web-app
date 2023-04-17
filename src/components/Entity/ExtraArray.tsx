import { Stack, Typography } from "@mui/material";

type ExtraArrayProps = {
  label: string;
  array: string[];
};

export default function ExtraArray({ label, array }: ExtraArrayProps): JSX.Element {
  return (
    <Stack direction="row" gap={2}>
      <Typography>{label}:</Typography>
      <Typography>{array.join(", ")}</Typography>
    </Stack>
  );
}
