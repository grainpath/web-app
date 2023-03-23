import { Box } from "@mui/material";
import { LogoCloseMenu, MainMenu } from "./shared-menus";

export default function FavoritePanel(): JSX.Element {

  return (
    <Box>
      <LogoCloseMenu logo={() => {}} />
      <MainMenu value={2} />
    </Box>
  );
}
