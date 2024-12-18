/** Please use these types and modify them as needed. */

export async function GET() {
  const road: Road = {
    vehicles: [
      { position: {x: 13, y: 2}, width: 10, length: 4 },
      { position: {x: 200, y: 22}, width: 10, length: 4 },
      { position: {x: 405, y: 50}, width: 10, length: 4 },
      { position: {x: 600, y: 66}, width: 10, length: 4 },
      { position: {x: 800, y: 75}, width: 10, length: 4 },
    ],
    observer: {
      width: 4,
      length: 10,
      position: {
        x: 400, //10
        y: 40,
      },
      direction: 1,
      fov: 178,
    },
    width: 80,
    length: 880,
  };

  return Response.json(road);
}
