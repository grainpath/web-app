import { Box } from "@mui/material";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import { MyRoutesSection } from "./Favourites/MyRoutesSection";
import MyPlacesSection from "./Favourites/MyPlacesSection";
import MyDirectionsSection from "./Favourites/MyDirectionsSection";

export default function FavouritesPanel(): JSX.Element {

  return (
    <Box>
      <LogoCloseMenu onLogo={() => {}} />
      <MainMenu panel={3} />
      <Box sx={{ m: 2 }}>
        <MyPlacesSection />
        <MyRoutesSection />
        <MyDirectionsSection />
      </Box>
    </Box>
  );
}
