/**
 * Point in WSG84 CRS.
 */
export type Point = {
  lon: number;
  lat: number;
};

export type Boundary = {
  source?: Point;
  target?: Point;
};

export type LightGrain = {
  id?: string;
  location: Point;
  keywords: string[];
  tags: { name?: string; };
}

export type HeavyGrain = {
  id: string;
  location: Point;
  keywords: string[],
  polygon?: { lon: number, lat: number }[];
  tags: {
    name?: string;
    image?: string;
    description?: string;
  }
}
