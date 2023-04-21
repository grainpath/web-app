import { Box } from "@mui/material";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import MyDirecsSection from "./Favourites/MyDirecsSection";
import MyPlacesSection from "./Favourites/MyPlacesSection";
import MyRoutesSection from "./Favourites/MyRoutesSection";

export default function FavouritesPanel(): JSX.Element {

  return (
    <Box>
      <LogoCloseMenu onLogo={() => {}} />
      <MainMenu panel={3} />
      <Box sx={{ m: 2 }}>
        <MyPlacesSection />
        <MyRoutesSection />
        <MyDirecsSection />
      </Box>
    </Box>
  );
}
