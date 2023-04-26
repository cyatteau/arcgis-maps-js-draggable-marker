import Graphic from "@arcgis/core/Graphic";

export function draggableMarker(long, lat, view) {
  const point = {
    type: "point",
    longitude: long,
    latitude: lat,
  };

  const markerSymbol = {
    type: "simple-marker",
    color: [150, 119, 40],
  };

  const selectSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol,
  });

  view.graphics.add(pointGraphic);

  const stop = (evt) => evt.stopPropagation();

  const updateGraphic = (event, symbol = selectSymbol) => {
    pointGraphic.geometry = view.toMap(event);
    pointGraphic.symbol = symbol;
  };

  const cleanUp = (event) => {
    updateGraphic(event, markerSymbol);
    handlers.forEach((a) => a.remove());
    handlers.length = 0;
    console.log("Longitude: " + pointGraphic.geometry.longitude);
    console.log("Latitude: " + pointGraphic.geometry.latitude);
  };

  const handlers = [];

  view.on("hold", ({ mapPoint }) => {
    view.hitTest(view.toScreen(mapPoint)).then((hitResult) => {
      if (!hitResult.results[0].graphic) return;
      pointGraphic.symbol = selectSymbol;
      const pausePan = view.on("drag", stop);
      const move = view.on("pointer-move", updateGraphic);
      const up = view.on("pointer-up", cleanUp);
      handlers.push(pausePan);
      handlers.push(move);
      handlers.push(up);
    });
  });
  let longitude = pointGraphic.geometry.longitude;
  let latitude = pointGraphic.geometry.latitude;
  let coordinates = { longitude: longitude, latitude: latitude };
  return coordinates;
}
