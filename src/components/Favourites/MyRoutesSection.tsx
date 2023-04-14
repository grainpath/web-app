import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { StoredRoute } from "../../domain/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { ExpandMore, Route } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SEARCH_ROUTES_ADDR } from "../../domain/routing";
import { FavouriteStub } from "./FavouriteStub";

export function MyRoutesSection(): JSX.Element {

  const nav = useNavigate();

  const { storage } = useContext(AppContext);
  const [routes, setRoutes] = useState<StoredRoute[]>([]);

  const [load, setLoad] = useState(true);

  useEffect(() => {


  }, [])

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Routes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {routes.length > 0
          ? <></>
          : <FavouriteStub link={SEARCH_ROUTES_ADDR} text="routes" icon={(sx) => <Route sx={sx} />} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
