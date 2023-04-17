import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import {
  AccessTime,
  Home,
  LocationOn,
  Mail,
  OpenInNew,
  Payment,
  Phone,
  Toll
} from "@mui/icons-material";
import Image from "mui-image";
import { AppContext } from "../../App";
import {
  Entity,
  EntityAddress,
  EntityPayment,
  StoredPlace
} from "../../domain/types";
import { point2text } from "../../utils/helpers";
import { useAppSelector } from "../../features/hooks";

type EntityViewProps = {
  entity: Entity;
};

export default function EntityView({ entity }: EntityViewProps): JSX.Element {

  const { map, storage } = useContext(AppContext);
  const { places } = useAppSelector((state) => state.favourites);
  const [found, setFound] = useState<StoredPlace | undefined>(undefined);

  const {
    polygon,
    image,
    description,
    address,
    payment,
    email,
    phone,
    website,
    charge,
    openingHours,
    fee,
    delivery,
    drinkingWater,
    internetAccess,
    shower,
    smoking,
    takeaway,
    toilets,
    wheelchair,
    rank,
    capacity,
    minimumAge,
    clothes,
    cuisine,
    rental
  } = entity.attributes;

  const composeAddress = ({ country, settlement, district, place, house, postalCode }: EntityAddress) => {
    return [place, house, postalCode, district, settlement, country].filter((str) => !!str).join(", ");
  };

  const composePayment = ({ cash, card, amex, jcb, mastercard, visa, crypto }: EntityPayment) => {
    return [
      ["Cash", cash], ["Credit Card", card], ["Amex", amex], ["JCB", jcb],
      ["MasterCard", mastercard], ["Visa", visa], ["Crypto", crypto]
    ].filter(([_, value]) => value === true).map(([label, _]) => label);
  }

  useEffect(() => {
    setFound(places.find((p) => p.grainId === entity.grainId));
  }, [places, entity]);

  useEffect(() => {
    map?.clear();
    (found) ? map?.addStored(entity) : map?.addTagged(entity)
    if (polygon) { map?.drawPolygon(polygon); }
  }, [map, found, entity, polygon])

  const extra = [
    ["fee", fee], ["delivery", delivery], ["drinking water", drinkingWater], ["internet access", internetAccess],
    ["shower", shower], ["smoking", smoking], ["takeaway", takeaway], ["toilets", toilets], ["wheelchair", wheelchair]
  ].filter(([_, value]) => value !== undefined);

  const arr = (arr: any): boolean => arr && arr.length > 0;

  const pay = payment ? composePayment(payment) : [];

  const ico = address || website || phone || email || pay.length > 0 || arr(openingHours) || arr(charge);

  const add = rank || capacity || minimumAge || arr(cuisine) || arr(clothes) || arr(rental) || arr(extra);

  return (
    <Stack direction="column" gap={2.7}>
      {(found)
        ? (<Alert severity="success">
            This place appears in the storage under name <strong>{found.name}</strong>.
          </Alert>)
        : (<Box>
            <Alert severity="info">
              This place does not appear in the storage.
            </Alert>
            <Button color="info" variant="outlined" size="small" sx={{ width: "100%" }}>Save</Button>
          </Box>)
      }
      <Stack direction="column" gap={1}>
        <Typography fontSize="large">{entity.name}</Typography>
        <Divider sx={{ background: "lightgrey" }} />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="right"
          sx={{ cursor: "pointer" }}
          onClick={() => { map?.flyTo(entity); }}
        >
          <IconButton size="small"><LocationOn /></IconButton>
          <Typography fontSize="small">{point2text(entity.location)}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={1}>
        {entity.keywords.map((k, i) => (
          <Chip key={i} label={k} color="primary" variant="outlined" sx={{ color: "black" }} />
        ))}
      </Stack>
      {(ico) &&
        <Stack direction="column" gap={1.5}>
          {address &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <Home sx={{ color: "grey" }} />
              <Typography noWrap>{composeAddress(address)}</Typography>
            </Stack>
          }
          {website &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <OpenInNew sx={{ color: "grey" }} />
              <Link href={website} rel="noopener noreferrer" target="_blank" underline="none">
                <Typography>{website}</Typography>
              </Link>
            </Stack>
          }
          {phone &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <Phone sx={{ color: "grey" }} />
              <Typography>{phone}</Typography>
            </Stack>
          }
          {email &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <Mail sx={{ color: "grey" }} />
              <Link href={`mailto:${email}`} rel="noopener noreferrer" target="_top" underline="none">
                <Typography>{email}</Typography>
              </Link>
            </Stack>
          }
          {openingHours && openingHours.length > 0 &&
            <Stack direction="row" columnGap={2}>
              <AccessTime sx={{ color: "grey" }} />
              <Stack direction="column" rowGap={1}>
                {openingHours.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
          {pay.length > 0 &&
            <Stack direction="row" columnGap={2}>
              <Payment sx={{ color: "grey" }} />
              <Typography>{pay.join(", ")}</Typography>
            </Stack>
          }
          {charge && charge.length > 0 &&
            <Stack direction="row" columnGap={2}>
              <Toll sx={{ color: "grey" }} />
              <Stack direction="column" rowGap={1}>
                {charge.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
        </Stack>
      }
      {image &&
        (<Link href={image} rel="noopener noreferrer" target="_blank">
          <Image showLoading src={image} fit="contain" style={{ maxHeight: "300px" }}/>
        </Link>)
      }
      {description && (<Typography>{description}</Typography>)}
      {rank &&
        <Stack direction="row" columnGap={2}>
          <Typography>Rating</Typography>
          <Rating value={rank} readOnly />
        </Stack>
      }
      {cuisine && cuisine.length > 0 &&
        <Stack direction="row" columnGap={2}>
          <Typography>Cuisine</Typography>
          <Typography>{cuisine.join(", ")}</Typography>
        </Stack>
      }
      {clothes && clothes.length > 0 &&
        <Stack direction="row" columnGap={2}>
          <Typography>Clothes</Typography>
          <Typography>{clothes.join(", ")}</Typography>
        </Stack>
      }
      {rental && rental.length > 0 &&
        <Stack direction="row" columnGap={2}>
          <Typography>Rental</Typography>
          <Typography>{rental.join(", ")}</Typography>
        </Stack>
      }
      {extra.length > 0 &&
        <Stack direction="column" gap={1} sx={{ border: "1px solid lightgrey", p: 1, borderRadius: "10px", boxSizing: "border-box" }}>
          <Typography fontSize="1.2rem">Additional information</Typography>
          <Typography>
            {extra.map(([label, value]) => `${value ? "" : ("no" + String.fromCharCode(160))}${label}`).join(", ")}
          </Typography>
        </Stack>
      }
    </Stack>
  );
}
