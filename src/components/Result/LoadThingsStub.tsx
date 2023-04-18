import { Skeleton, Stack } from "@mui/material";

export default function LoadThingsStub(): JSX.Element {
  return (
    <Stack direction="column" gap={2}>
      <Skeleton variant="rounded" height={100} />
      <Skeleton variant="rounded" height={100} />
      <Skeleton variant="rounded" height={200} />
    </Stack>
  );
}
