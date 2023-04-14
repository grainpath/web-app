import { useContext, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setLoaded, setPlaces } from "../features/favouritesSlice";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import { AppContext } from "../App";
import { MyRoutesSection } from "./Favourites/MyRoutesSection";
import { MyPlacesSection } from "./Favourites/MyPlacesSection";

export default function FavouritesPanel(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { loaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!loaded) {
        try {
          dispatch(setPlaces(await storage.getAllPlaces()));
          dispatch(setLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [loaded]);

  return (
    <Box>
      <LogoCloseMenu logo={() => {}} />
      <MainMenu value={3} />
      <Box sx={{ mt: 2, mx: 2 }}>
        <MyPlacesSection />
        <MyRoutesSection />
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>My Directions</Typography>
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
