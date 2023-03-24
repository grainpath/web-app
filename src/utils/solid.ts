import {
  fetch,
  getDefaultSession
} from "@inrupt/solid-client-authn-browser";
import {
  buildThing,
  createSolidDataset,
  createThing,
  getDatetime,
  getDecimal,
  getSolidDataset,
  getStringNoLocale,
  getStringNoLocaleAll,
  saveSolidDatasetAt,
  SolidDataset,
  Thing
} from "@inrupt/solid-client";
import { ns } from "./general";
import { HeavyPlace, Point } from "./grainpath";

export const SOLID_WELL_KNOWN_PROVIDERS: string[] = [
  "https://inrupt.net/",
  "https://solidweb.org/",
  "https://solidweb.me/",
  "https://solidcommunity.net/"
];

const SOLID_BASE_DIR = "grainpath";
export const SOLID_PLACES_DATASET = SOLID_BASE_DIR + "/places";
export const SOLID_ROUTES_DATASET = SOLID_BASE_DIR + "/routes";

export function place2url(grain: HeavyPlace, pod: string) {
  return pod + SOLID_PLACES_DATASET + '#' + grain.id;
}

export function initSolidSession(fi: () => void, fo: () => void): void {
  const session = getDefaultSession().removeAllListeners();

  session.onLogin(() => {
    fi();
    console.log("Session " + session.info.sessionId + " logged in.");
  });
  session.onLogout(() => {
    fo();
    console.log("Session " + session.info.sessionId + " logged out.");
  });
  session.onError(() => {
    alert("Interaction with Solid ended up with an error.");
  });
  session.onSessionRestore(() => { alert("Solid session has been restored."); });
  session.onSessionExpiration(() => { alert("Solid session has expired."); });

  session.handleIncomingRedirect(window.location.href);
}

/**
 * Standard Solid fetch with fail upon non-existing dataset.
 */
export async function fetchSolidDataset(url: string): Promise<SolidDataset | undefined> {

  try {
    return await getSolidDataset(url, { fetch: fetch });
  }
  catch (ex: any) {
    if (ex.statusCode === 404) { return createSolidDataset(); }
  }

  return undefined;
};

type StoreSolidDatasetProps = {
  targ: string;
  data: SolidDataset;
  hide: () => void;
  acti: (b: boolean) => void;
  save: (d: SolidDataset) => void;
};

export async function storeSolidDataset({ targ, data, hide, acti, save }: StoreSolidDatasetProps): Promise<void> {

  try {
    acti(true);
    save(await saveSolidDatasetAt(targ, data, { fetch: fetch }));
    hide();
  }
  catch (ex) { alert(ex); }
  finally { acti(false); }
}

export type LockerPlaceItem = {
  note?: string;
  modified?: Date;
  place?: HeavyPlace;
};

/**
 * Extracts name for both places, and routes.
 */
export function extractLockerItemName(thing: Thing): string | null {
  return getStringNoLocale(thing, ns.rdfs.label);
}

/**
 * Extracts @b place, note and date of the latest modification from a Thing.
 */
export function extractLockerPlaceItem(thing: Thing | null): LockerPlaceItem {

  // all (!)-items certainly exist

  return (!thing) ? {} : {
    note: getStringNoLocale(thing, ns.skos.note)!,
    modified: getDatetime(thing, ns.dct.modified)!,
    place: {
      id: new URL(thing.url).hash.slice(1),
      name: getStringNoLocale(thing, ns.rdfs.label)!,
      location: {
        lon: getDecimal(thing, ns.geo.long)!,
        lat: getDecimal(thing, ns.geo.lat)!
      } as Point,
      keywords: getStringNoLocaleAll(thing, ns.ov.keywords),
      features: { }
    } as HeavyPlace
  };
}

/**
 * Produces an instance of a Thing from a place.
 */
export function composeLockerPlaceItem(note: string, place: HeavyPlace): Thing {

  let builder = buildThing(createThing({ name: place.id }))
    .setUrl(ns.rdf.type, ns.sbeo.PointOfInterest)
    .setStringNoLocale(ns.rdfs.label, place.name)
    .setStringNoLocale(ns.skos.note, note)
    .setDecimal(ns.geo.long, place.location.lon)
    .setDecimal(ns.geo.lat, place.location.lat)
    .setDatetime(ns.dct.modified, new Date());

  place.keywords.forEach((keyword) => {
    builder = builder.addStringNoLocale(ns.ov.keywords, keyword);
  });

  return builder.build();
}
