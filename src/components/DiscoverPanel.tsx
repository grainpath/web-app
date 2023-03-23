import { Box } from "@mui/material";
import { useAppSelector } from "../features/hooks";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import DiscoverModeSelector from "./Discover/DiscoverModeSelector";
import DiscoverPlacesSection from "./Discover/DiscoverPlacesSection";
import DiscoverRoutesSection from "./Discover/DiscoverRoutesSection";

export default function DiscoverPanel(): JSX.Element {

  const { mod } = useAppSelector(state => state.discover);

  return (
    <Box>
      <LogoCloseMenu logo={() => {}} />
      <MainMenu value={0} />
      <Box sx={{ mx: 2, mt: 1, mb: 4 }} >
        <DiscoverModeSelector />
        { (mod)
          ? (<DiscoverRoutesSection />)
          : (<DiscoverPlacesSection />)
        }
      </Box>
    </Box>
  );
}
