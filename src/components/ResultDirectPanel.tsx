import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { BackCloseMenu } from "./shared-menus";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";
import LoadStub from "./Result/LoadStub";
import { clearResultDirect } from "../features/resultDirectSlice";
import { StoredPlace, UiDirection } from "../domain/types";

type ResultDirectSectionProps = {
  result: UiDirection;
};

function ResultDirectSection({ result }: ResultDirectSectionProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { places } = useAppSelector(state => state.favourites);

  const [modal, setModal] = useState(false);

  const {
    directionId,
    name,
    path,
    sequence
  } = result;

  const knownPlaces = useMemo(() => {
    return places.reduce((str, place) => { return str.set(place.placeId, place) }, new Map<string, StoredPlace>());
  }, [places]);

  useEffect(() => {
    map?.clear();
    sequence.forEach((place) => {
      place.placeId && knownPlaces.has(place.placeId)
        ? map?.addStored(knownPlaces.get(place.placeId)!)
        : map?.addCustom(place, false);
    });
    map?.drawPolyline(path.polyline);
  }, [map, path, sequence, knownPlaces])

  return (
    <Stack direction="column" gap={2.7}>
      {(directionId)
        ? <Alert severity="success">
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Box>
            <Alert icon={false} severity="info" action={<Button color="inherit" size="small" onClick={() => { setModal(true); }}>Save</Button>}>
              Would you like to save this direction?
            </Alert>
            {modal && <SaveRouteModal route={route} onHide={() => { setModal(false); }} />}
          </Box>
      }
      <Box display="flex" alignItems="center">
        <Typography fontSize="1.2rem">
          Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(path.distance.toFixed(2))}</strong> km
        </Typography>
      </Box>
      <Stack direction="column" gap={2}>
        {sequence
          .map((place, i) => {
            const pt = place.placeId ? knownPlaces.get(place.placeId) : undefined;
            return (pt)
              ? <></>
              : <></>
          })
        }
      </Stack>
    </Stack>
  );
}

export default function ResultDirectPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { storage } = useContext(AppContext);
  const { back, result } = useAppSelector((state) => state.resultDirect);
  const { placesLoaded } = useAppSelector((state) => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        dispatch(setPlaces(await storage.getAllPlaces()));
        dispatch(setPlacesLoaded());
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  const onBack = () => {
    dispatch(clearResultDirect());
    navigate(back!);
  };

  return (
    <Box>
      <BackCloseMenu onBack={back ? onBack : undefined} />
      <Box sx={{ mx: 2, my: 4 }}>
        {placesLoaded
          ? <Box>
              {result
                ? <ResultDirectSection result={result} />
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
