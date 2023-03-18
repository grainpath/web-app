import { Offcanvas } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setTab } from "../features/searchSlice";
import DiscoverButton from "./Search/DiscoverButton";
import DiscoverModeSelector from "./Search/DiscoverModeSelector";
import DiscoverRoutesSection from "./Search/DiscoverRoutesSection";
import DiscoverPlacesSection from "./Search/DiscoverPlacesSection";
import DiscoverKeywordsInput from "./Search/DiscoverKeywordsInput";
import { NavigateButton } from "./Search/NavigateButton";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import NavigateSequence from "./Search/NavigateSequence";

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel({ children, value, index }: TabPanelProps) {

  return (
    <div role="tabpanel" hidden={value !== index}>
      { (value === index) && (<div>{children}</div>) }
    </div>
  );
}

export default function SearchPanel(): JSX.Element {

  const dispatch = useAppDispatch();
  const mod = useAppSelector(state => state.search.mod);
  const tab = useAppSelector(state => state.search.tab);

  const style = { textTransform: "none", fontSize: "1.0rem" } as React.CSSProperties;

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title />
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} variant="fullWidth" onChange={(_, v) => { dispatch(setTab(v)); }}>
            <Tab label="Discover" style={style} />
            <Tab label="Navigate" style={style} />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <DiscoverModeSelector />
          { (mod)
            ? <DiscoverRoutesSection />
            : <DiscoverPlacesSection />
          }
          <DiscoverKeywordsInput />
          <DiscoverButton />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <NavigateSequence />
          <NavigateButton />
        </TabPanel>
      </Offcanvas.Body>
    </>
  );
}
