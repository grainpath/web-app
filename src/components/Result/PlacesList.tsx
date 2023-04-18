import { useContext } from "react";
import { Stack } from "@mui/material";
import { Favorite, Link } from "@mui/icons-material";
import { AppContext } from "../../App";
import { Place, StoredPlace } from "../../domain/types";
import { MenuPinListItem } from "../shared-list-items";
import ListItemLink from "./ListItemLink";

type PlacesListProps = {
  back: string;
  places: Place[];
  grains: Map<string, StoredPlace>;
};

export default function PlacesList({ back, places, grains }: PlacesListProps): JSX.Element {

  const { map } = useContext(AppContext);

  return (
    <Stack direction="column" gap={2}>
      {places
        .map((place, i) => {
          const grain = grains.get(place.grainId);
          return (grain)
            ? (<MenuPinListItem
                key={i}
                kind="stored"
                label={grain.name}
                onMarker={() => { map?.flyTo(grain); }}
                menu={<ListItemLink icon={<Favorite />} back={back} grainId={place.grainId} />}
              />)
            : (<MenuPinListItem
                key={i}
                kind="tagged"
                label={place.name}
                onMarker={() => { map?.flyTo(place); }}
                menu={<ListItemLink icon={<Link />} back={back} grainId={place.grainId} />}
              />)
        })
      }
    </Stack>
  );
}
