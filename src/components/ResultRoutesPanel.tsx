import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared-menus";
import LoadStub from "./Result/LoadStub";
import ResultRoutesContent from "./Result/ResultRoutesContent";


export default function ResultRoutesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { back, result } = useAppSelector((state) => state.resultRoutes);
  const { placesLoaded } = useAppSelector((state) => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        dispatch(setFavouritePlaces(await storage.getAllPlaces()));
        dispatch(setFavouritePlacesLoaded());
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  return (
    <Box>
      <BackCloseMenu onBack={back ? () => { navigate(back); } : undefined} />
      <Box sx={{ mx: 2, my: 4 }}>
        {(placesLoaded)
          ? <Box>
              {result.length > 0
                ? <ResultRoutesContent result={result} />
                : <Alert severity="warning">
                    List of routes appears to be empty. Try different search parameters.
                  </Alert>
              }
            </Box>
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
