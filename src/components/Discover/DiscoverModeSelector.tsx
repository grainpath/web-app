import { Box, Button } from "@mui/material";
import { Grain, Route } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setRoutes, setPlaces } from "../../features/discoverSlice";

export default function DiscoverModeSelector(): JSX.Element {

  const dispatch = useAppDispatch();
  const { mod } = useAppSelector(state => state.discover);

  const variant = (m: boolean) => m ? "contained" : "outlined";

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
        <Button variant={variant( mod)} startIcon={<Route />} onClick={() => { dispatch(setRoutes()); }}>Routes</Button>
        <Button variant={variant(!mod)} startIcon={<Grain />} onClick={() => { dispatch(setPlaces()); }}>Places</Button>
      </Box>
    </Box>
  );
}
