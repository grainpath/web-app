import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setFavouritePlaces,
  setFavouritePlacesLoaded
} from "../features/favouritesSlice";
import { clearResultDirecs } from "../features/resultDirecsSlice";
import { BackCloseMenu } from "./shared-menus";
import LoadStub from "./Result/LoadStub";
import ResultDirecsContent from "./Result/ResultDirecsContent";

export default function ResultDirecsPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { storage } = useContext(AppContext);
  const { back, result } = useAppSelector((state) => state.resultDirect);
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
    dispatch(clearResultDirecs());
    navigate(back!);
  };

  return (
    <Box>
      <BackCloseMenu onBack={back ? onBack : undefined} />
      <Box sx={{ mx: 2, my: 4 }}>
        {placesLoaded
          ? <Box>
              {result
                ? <ResultDirecsContent result={result} />
                : <Alert>
                    Result appears to be empty. Try different search parameters.
                  </Alert>
              }
            </Box>
          : <LoadStub />
        }
      </Box>
    </Box>
  );
}
