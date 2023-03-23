import { Box } from "@mui/material";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import { NavigateButton } from "./Search/NavigateButton";
import NavigateSequence from "./Search/NavigateSequence";

export default function NavigatePanel(): JSX.Element {

  return (
    <Box>
      <LogoCloseMenu logo={() => {}} />
      <MainMenu value={1} />
      <NavigateSequence />
      <NavigateButton />
    </Box>
  );
}
