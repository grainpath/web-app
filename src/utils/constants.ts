// user input

export enum TagEnum {
  DEFAULT,
  BOOLEAN,
  COLLECT,
  MEASURE,
  TEXTUAL
};

export enum RelEnum {
  EQ = 0,
  NE,
  LT,
  LE,
  GT,
  GE,
  IN,
  NI,
  SW,
  EW,
  CN
};

export const RelView = new Map<RelEnum, string>([
  [ RelEnum.EQ, "==" ],
  [ RelEnum.NE, "!=" ],
  [ RelEnum.LT, "<"  ],
  [ RelEnum.LE, "<=" ],
  [ RelEnum.GE, ">=" ],
  [ RelEnum.GT, ">"  ],
  [ RelEnum.IN, "+"  ],
  [ RelEnum.NI, "-"  ],
  [ RelEnum.SW, "^"  ],
  [ RelEnum.EW, "$"  ],
  [ RelEnum.CN, "?"  ]
]);

type TagMapping = {
  ty: TagEnum;
  ts: string[];
  rs: RelEnum[];
};

const mapping: TagMapping[] = [
  {
    ts: [ "name" ],
    ty: TagEnum.TEXTUAL,
    rs: [ RelEnum.SW, RelEnum.EW, RelEnum.CN ]
  },
  {
    ty: TagEnum.COLLECT,
    ts: [ "clothes", "cuisine", "rental" ],
    rs: [ RelEnum.IN, RelEnum.NI ]
  },
  {
    ty: TagEnum.MEASURE,
    ts: [ "capacity", "min_age", "rank" ],
    rs: [ RelEnum.EQ, RelEnum.NE, RelEnum.LT, RelEnum.LE, RelEnum.GT, RelEnum.GE ]
  },
  {
    ty: TagEnum.BOOLEAN,
    ts: [ "fee", "delivery", "drinking_water", "internet_access", "shower", "takeaway", "toilets", "wheelchair" ],
    rs: [ RelEnum.EQ, RelEnum.NE ]
  }
];

export const EXISTING_TAGS: string[] = [
  ...mapping.map(({ ts }, _) => ts).flat(),
  "description", "image", "website", "email", "phone", "charge", "opening_hours"
];

function tag2entity<T>(ms: TagMapping[], f: (t: TagMapping) => T): Map<string, T> {
  return ms
    .map((m) => m.ts.map((t) => { return { t: t, es: f(m) }; })).flat()
    .reduce((acc, { t, es }) => { acc.set(t, es); return acc; }, new Map<string, T>());
}

export const TAG_TO_TYPE: Map<string, TagEnum> = tag2entity(mapping, t => t.ty);

export const TAG_TO_RELATION: Map<string, RelEnum[]> = tag2entity(mapping, (t) => t.rs);

// client-side routing

export const SEARCH_ADDR = "/search";
export const LOCKER_ADDR = "/locker";
export const SHAPES_ADDR = "/shapes";
export const POINTS_ADDR = "/points";
export const NOT_FOUND_ADDR = "/404";

// solid pod

export const WELL_KNOWN_SOLID_PROVIDERS: string[] = [
  "https://inrupt.net/",
  "https://solidweb.org/",
  "https://solidweb.me/",
  "https://solidcommunity.net/"
];

export const DATASET_ADDR = "grainpath/dataset";

// grainpath api

const API_BASE_URL: string = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;

export function grainpathFetch(resource: string, body: any): Promise<Response> {
  const content = "application/json";

  return fetch(API_BASE_URL + resource, {
    method: "POST",
    headers: { "Accept": content, "Content-Type": content },
    body: JSON.stringify(body)
  })
}
