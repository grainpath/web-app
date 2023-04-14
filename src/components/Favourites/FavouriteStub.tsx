import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Stack,
  SxProps,
  Typography
} from "@mui/material";

type FavouriteStubProps = {
  link: string;
  text: string;
  icon: (sx: SxProps) => ReactElement;
};

export function FavouriteStub({ link, text, icon }: FavouriteStubProps): JSX.Element {
  const nav = useNavigate();

  return (
    <Stack gap={1} direction="column">
      <Box display="flex" justifyContent="center">
        <IconButton onClick={() => nav(link)}>
          {icon({ fontSize: 50, color: "grey" })}
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography fontSize="large" sx={{ fontWeight: "medium" }}>
          {`No ${text} found`}
        </Typography>
      </Box>
    </Stack>
  );
}
