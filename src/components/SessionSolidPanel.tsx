import { Alert, Box } from "@mui/material";
import { useAppSelector } from "../features/hooks";
import { HomeCloseMenu } from "./shared/menus";
import SolidContent from "./session/SolidContent";

/**
 * Panel corresponding to Solid storage provider.
 */
export default function SessionSolidPanel(): JSX.Element {

  const {
    login,
    solid
  } = useAppSelector(state => state.session);

  return (
    <Box>
      <HomeCloseMenu />
      <Box sx={{ m: 2 }}>
        {(login && solid)
          ? <SolidContent />
          : <Alert severity="info">
              Log in to your Solid Pod to see the content.
            </Alert>
        }
      </Box>
    </Box>
  );
}