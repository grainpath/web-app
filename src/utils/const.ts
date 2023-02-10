export const WELL_KNOWN_SOLID_PROVIDERS: { label: string }[] = [
  {
    label: 'https://inrupt.net/',
  },
  {
    label: 'https://solidcommunity.net/',
  },
  {
    label: 'https://solidweb.org/',
  },
];

const b = [ 'fee', 'delivery', 'drinking_water', 'internet_access', 'shower', 'takeaway', 'toilets', 'wheelchair', ]
const c = [ 'clothes', 'cuisine', 'rental', ];
const m = [ 'capacity', 'min_age', 'rank', ];
const t = [ 'name', ];

export const TAGS_TO_TYPE_MAPPING: { tags: Set<string>, type: string }[] = [
  {
    tags: new Set(b),
    type: 'boolean',
  },
  {
    tags: new Set(c),
    type: 'collect',
  },
  {
    tags: new Set(m),
    type: 'measure',
  },
  {
    tags: new Set(t),
    type: 'textual',
  },
];

export const TYPE_TO_OPERATOR_MAPPING = new Map<string, Set<string>>([
  [ 'collect', new Set([ '+', '-', ]) ],
  [ 'measure', new Set([ '==', '!=', '>', '>=', '<', '<=', ]) ],
  [ 'textual', new Set([ '^', '^', '?' ]) ],
]);

export const EXISTING_TAGS: Set<string> = new Set([
  'image', 'website', 'email', 'phone', 'opening_hours', 'charge',
  ...b,
  ...c,
  ...m,
  ...t,
]);
