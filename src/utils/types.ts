export enum PanelView {
  Search,
  Result,
  Remote,
};

export interface Point {
  lon: number;
  lat: number;
};

export interface UidPoint extends Point {
  uid: number;
}

export interface Boundary {
  source?: UidPoint;
  target?: UidPoint;
};
