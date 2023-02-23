const mapping = [
  {
    os: [ "==", "!=" ],
    ts: [ "fee", "delivery", "drinking_water", "internet_access", "shower", "takeaway", "toilets", "wheelchair" ],
    ty: "boolean"
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
    os: [ "^", "$", "?" ],
    ts: [ "charge", "name", "opening_hours" ],
    ty: "textual"
  }
]

export const EXISTING_TAGS: Set<string> = new Set([
  "description", "image", "website", "email", "phone",
  ...mapping.map(({ ts }, _) => ts).flat()
]);

export const TAG_TO_OPERATOR: Map<string, string[]> = mapping
  .map(({ os, ts }) => ts.map((t) => { return { t: t, os: os }; })).flat()
  .reduce((acc, { t, os }) => { acc.set(t, os); return acc; }, new Map<string, string[]>());

export const TAG_TO_TYPE: Map<string, string> = mapping
  .map(({ ts, ty }) => ts.map((t) => { return { t: t, ty: ty }; })).flat()
  .reduce((acc, { t, ty }) => { acc.set(t, ty); return acc; }, new Map<string, string>());

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
