export type Point = {
  lon: number;
  lat: number;
};

export type UidPoint = Point & {
  uid: number;
}

export type Boundary = {
  source?: UidPoint;
  target?: UidPoint;
};
