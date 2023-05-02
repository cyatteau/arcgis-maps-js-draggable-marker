"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draggableMarker = draggableMarker;
var _Graphic = _interopRequireDefault(require("@arcgis/core/Graphic"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function draggableMarker(_long, lat, view) {
  var point = {
    type: "point",
    longitude: _long,
    latitude: lat
  };
  var markerSymbol = {
    type: "simple-marker",
    color: [150, 119, 40]
  };
  var selectSymbol = {
    type: "simple-marker",
    color: [226, 119, 40]
  };
  var pointGraphic = new _Graphic["default"]({
    geometry: point,
    symbol: markerSymbol
  });
  view.graphics.add(pointGraphic);
  var stop = function stop(evt) {
    return evt.stopPropagation();
  };
  var updateGraphic = function updateGraphic(event) {
    var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : selectSymbol;
    pointGraphic.geometry = view.toMap(event);
    pointGraphic.symbol = symbol;
  };
  var cleanUp = function cleanUp(event) {
    updateGraphic(event, markerSymbol);
    handlers.forEach(function (a) {
      return a.remove();
    });
    handlers.length = 0;
    // console.log("Longitude: " + pointGraphic.geometry.longitude);
    // console.log("Latitude: " + pointGraphic.geometry.latitude);
    return pointGraphic.geometry.longitude;
  };
  var handlers = [];
  view.on("hold", function (_ref) {
    var mapPoint = _ref.mapPoint;
    view.hitTest(view.toScreen(mapPoint)).then(function (hitResult) {
      if (!hitResult.results[0].graphic) return;
      pointGraphic.symbol = selectSymbol;
      var pausePan = view.on("drag", stop);
      var move = view.on("pointer-move", updateGraphic);
      var up = view.on("pointer-up", cleanUp);
      handlers.push(pausePan);
      handlers.push(move);
      handlers.push(up);
    });
  });
}