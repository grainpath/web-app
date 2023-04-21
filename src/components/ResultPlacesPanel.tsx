import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../App";
import { SEARCH_PLACES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { clearResultPlaces } from "../features/resultPlacesSlice";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared-menus";
import LoadStub from "./Result/LoadStub";
import ResultPlacesContent from "./Result/ResultPlacesContent";

export default function ResultPlacesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { result } = useAppSelector((state) => state.resultPlaces);
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

  const onBack = () => {
    dispatch(clearResultPlaces());
    navigate(SEARCH_PLACES_ADDR);
  };

  return (
    <Box>
      <BackCloseMenu onBack={onBack} />
      <Box sx={{ mx: 2, my: 4 }}>
        {placesLoaded
          ? <Box>
              {result && result.places.length > 0
                ? <ResultPlacesContent result={result} />
                : <Alert severity="warning">
                    Result appears to be empty! Try different search parameters.
                  </Alert>
              }
            </Box>
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
