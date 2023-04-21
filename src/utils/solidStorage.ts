import { IStorage } from "../domain/interfaces";
import {
  StoredPlace,
  StoredRoute,
  StoredDirec
} from "../domain/types";

/**
 * Wrapper over decentralized Solid Pod.
 */
export class SolidStorage implements IStorage {

  // [C]reate

  createPlace(place: StoredPlace): Promise<void> {
    throw new Error("Method not implemented.");
  }

  createRoute(route: StoredRoute): Promise<void> {
    throw new Error("Method not implemented.");
  }

  createDirec(direc: StoredDirec): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // [R]ead

  getAllPlaces(): Promise<StoredPlace[]> {
    throw new Error("Method not implemented.");
  }

  getAllRoutes(): Promise<StoredRoute[]> {
    throw new Error("Method not implemented.");
  }

  getAllDirecs(): Promise<StoredDirec[]> {
    throw new Error("Method not implemented.");
  }

  // [U]pdate

  updatePlace(place: StoredPlace): Promise<void> {
    throw new Error("Method not implemented.");
  }

  updateRoute(route: StoredRoute): Promise<void> {
    throw new Error("Method not implemented.");
  }

  updateDirec(direc: StoredDirec): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // [D]elete

  deletePlace(placeId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteRoute(routeId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteDirec(direcId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
