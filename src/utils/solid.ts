import { fetch } from "@inrupt/solid-client-authn-browser";
import { createSolidDataset, getSolidDataset, SolidDataset } from "@inrupt/solid-client";

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
