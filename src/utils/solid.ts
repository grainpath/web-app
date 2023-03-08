import { fetch } from "@inrupt/solid-client-authn-browser";
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

export type LockerItem = {
  label?: string;
  note?: string;
  updated?: Date;
  grain?: HeavyGrain;
};

export function extractLockerPoint(id: string, thing: Thing | null): LockerItem {

  // all (!)-items certainly exist

  return (!thing) ? {} : {
    label: getStringNoLocale(thing, ns.skos.prefLabel)!,
    note: getStringNoLocale(thing, ns.skos.note)!,
    updated: getDatetime(thing, ns.owl.updated)!,
    grain: {
      id: id,
      location: {
        lon: getDecimal(thing, ns.geo.long)!,
        lat: getDecimal(thing, ns.geo.lat)!
      } as Point,
      keywords: getStringNoLocaleAll(thing, ns.ov.keywords),
      tags: {
        name: getStringNoLocale(thing, ns.skos.altLabel) ?? undefined
      }
    } as HeavyGrain
  };
}

export function composeLockerPoint(label: string, note: string, grain: HeavyGrain): Thing {

  let builder = buildThing(createThing({ name: grain.id }))
    .setUrl(ns.rdf.type, ns.geo.Point)
    .setStringNoLocale(ns.skos.prefLabel, label)
    .setStringNoLocale(ns.skos.note, note)
    .setDecimal(ns.geo.long, grain.location.lon)
    .setDecimal(ns.geo.lat, grain.location.lat)
    .setDatetime(ns.owl.updated, new Date());

  builder = (grain.tags.name)
    ? builder.setStringNoLocale(ns.skos.altLabel, grain.tags.name)
    : builder;

  grain.keywords.forEach((keyword) => {
    builder = builder.addStringNoLocale(ns.ov.keywords, keyword);
  });

  return builder.build();
}
