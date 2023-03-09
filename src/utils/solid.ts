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
  SolidDataset,
  Thing
} from "@inrupt/solid-client";

import { ns } from "./general";
import { HeavyGrain, Point } from "./grainpath";

export const SOLID_WELL_KNOWN_PROVIDERS: string[] = [
  "https://inrupt.net/",
  "https://solidweb.org/",
  "https://solidweb.me/",
  "https://solidcommunity.net/"
];

const SOLID_BASE_DIR = "grainpath";
export const SOLID_POINTS_DATASET = SOLID_BASE_DIR + "/points";
export const SOLID_SHAPES_DATASET = SOLID_BASE_DIR + "/shapes";

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
export const fetchSolidDataset = async (url: string): Promise<SolidDataset | undefined> => {

  try {
    return await getSolidDataset(url, { fetch: fetch });
  }
  catch (ex: any) {
    if (ex.statusCode === 404) { return createSolidDataset(); }
  }

  return undefined;
};

export type LockerPoint = {
  note?: string;
  modified?: Date;
  grain?: HeavyGrain;
};

export function extractLockerPoint(thing: Thing | null): LockerPoint {

  // all (!)-items certainly exist

  return (!thing) ? {} : {
    note: getStringNoLocale(thing, ns.skos.note)!,
    modified: getDatetime(thing, ns.dct.modified)!,
    grain: {
      id: new URL(thing.url).hash.slice(1),
      name: getStringNoLocale(thing, ns.rdfs.label)!,
      location: {
        lon: getDecimal(thing, ns.geo.long)!,
        lat: getDecimal(thing, ns.geo.lat)!
      } as Point,
      keywords: getStringNoLocaleAll(thing, ns.ov.keywords),
      tags: { }
    } as HeavyGrain
  };
}

export function extractLockerPointName(thing: Thing): string | null {
  return getStringNoLocale(thing, ns.rdfs.label);
}

export function composeLockerPoint(note: string, grain: HeavyGrain): Thing {

  let builder = buildThing(createThing({ name: grain.id }))
    .setUrl(ns.rdf.type, ns.geo.Point)
    .setStringNoLocale(ns.rdfs.label, grain.name)
    .setStringNoLocale(ns.skos.note, note)
    .setDecimal(ns.geo.long, grain.location.lon)
    .setDecimal(ns.geo.lat, grain.location.lat)
    .setDatetime(ns.dct.modified, new Date());

  grain.keywords.forEach((keyword) => {
    builder = builder.addStringNoLocale(ns.ov.keywords, keyword);
  });

  return builder.build();
}
