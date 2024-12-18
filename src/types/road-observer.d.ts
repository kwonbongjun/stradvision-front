/**
 * Road Observer types
 *
 * Please use these types and extend them as needed.
 */

/**
 * Vehicle type
 *
 * position: Image coordinates (x, y) for the vehicle
 * width: Vehicle width in pixels
 * length: Vehicle length in pixels
 */
type Vehicle = {
  width: number;
  length: number;
  position: {
    x: number;
    y: number;
  };
};

/**
 * Observer type
 *
 * fov: field of view in degrees
 * direction: 1 for going down, -1 for going up the road (y-axis)
 */
type Observer = Vehicle & {
  fov: 178;
  direction: 1 | -1;
};

/**
 * Road type
 *
 * vehicles: List of vehicles on the road
 * observer: Observer object
 * width: Road width in pixels
 * length: Road length in pixels
 */
type Road = {
  vehicles: Vehicle[];
  observer: Observer;
  width: 80;
  length: 880;
};
