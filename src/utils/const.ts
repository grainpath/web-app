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
  [ RelEnum.GT, ">"  ],
  [ RelEnum.GE, ">=" ],
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

export const API_BASE_URL: string = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;

// Client-side routing

export const SEARCH_ADDR = "/search";
export const LOCKER_ADDR = "/locker";
export const RESULT_ADDR = "/result";
export const POINTS_ADDR = "/points/:id";

// Solid Pod

export const DATASET_ADDR = "grainpath/dataset";

export const WELL_KNOWN_SOLID_PROVIDERS: { label: string }[] = [
  {
    label: "https://inrupt.net/"
  },
  {
    label: "https://solidcommunity.net/"
  },
  {
    label: "https://solidweb.org/"
  }
];
