const mapping = [
  {
    os: [ "^", "$", "?" ],
    ts: [ "name" ],
    ty: "textual"
  },
  {
    os: [ "+", "-" ],
    ts: [ "clothes", "cuisine", "rental" ],
    ty: "collect"
  },
  {
    os: [ "==", "!=", ">", ">=", "<", "<=" ],
    ts: [ "capacity", "min_age", "rank" ],
    ty: "measure"
  },
  {
    os: [ "==", "!=" ],
    ts: [ "fee", "delivery", "drinking_water", "internet_access", "shower", "takeaway", "toilets", "wheelchair" ],
    ty: "boolean"
  }
];

export const EXISTING_TAGS: string[] = [
  ...mapping.map(({ ts }, _) => ts).flat(),
  "description", "image", "website", "email", "phone", "charge", "opening_hours"
];

export const TAG_TO_OPERATOR: Map<string, string[]> = mapping
  .map(({ os, ts }) => ts.map((t) => { return { t: t, os: os }; })).flat()
  .reduce((acc, { t, os }) => { acc.set(t, os); return acc; }, new Map<string, string[]>());

export const TAG_TO_TYPE: Map<string, string> = mapping
  .map(({ ts, ty }) => ts.map((t) => { return { t: t, ty: ty }; })).flat()
  .reduce((acc, { t, ty }) => { acc.set(t, ty); return acc; }, new Map<string, string>());

export const API_BASE_URL: string = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;

export const WELL_KNOWN_SOLID_PROVIDERS: { label: string }[] = [
  {
    label: "https://inrupt.net/",
  },
  {
    label: "https://solidcommunity.net/",
  },
  {
    label: "https://solidweb.org/",
  },
];
