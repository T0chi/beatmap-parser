const Constants = require("./Constants");
const BaseCurve = require("./Curves/BaseCurve");
const BezierCurve = require("./Curves/BezierCurve");
const CatmullCurve = require("./Curves/CatmullCurve");
const CircleCurve = require("./Curves/CircleCurve");

function getCurveType(_params) {
    var param = _params[0].split('|');
    if (param.length < 2) return Constants.SLIDER_CURVE_TYPE.UNKNOWN;
    switch (param[0].toString())
    {
        case "L": return Constants.SLIDER_CURVE_TYPE.LINEAR;
        case "C": return Constants.SLIDER_CURVE_TYPE.CATMULL;
        case "B": return Constants.SLIDER_CURVE_TYPE.BEZIER;
        case "P": return Constants.SLIDER_CURVE_TYPE.PERFECT;
        default: return Constants.SLIDER_CURVE_TYPE.UNKNOWN;
    }
}

function getSliderNodes(_params, _beatmap) {
    var sliderNodes = [];
    var param = _params[0].split('|');
    if (param.length < 2) return sliderNodes;
    param.forEach((p, i) => {
        if (i > 0) {
            var values = p.split(':');
            sliderNodes.push({
                x: parseFloat(values[0]) + _beatmap.playfieldToStoryboardOffset.x,
                y: parseFloat(values[1]) + _beatmap.playfieldToStoryboardOffset.y
            });
        }
    });
    return sliderNodes;
}

function createPath(slider) {
    var points = slider.nodes;
    var startPos = { x: slider.x, y: slider.y };
    switch (slider.curveType) {
        case Constants.SLIDER_CURVE_TYPE.UNKNOWN:
        case Constants.SLIDER_CURVE_TYPE.LINEAR:
            return new BaseCurve(startPos, points).generateLinear();
        case Constants.SLIDER_CURVE_TYPE.CATMULL:
            return new CatmullCurve(startPos, points, slider.pixelLength).generate();
        case Constants.SLIDER_CURVE_TYPE.BEZIER:
            return new BezierCurve(startPos, points).generate();
        case Constants.SLIDER_CURVE_TYPE.PERFECT:
            if (points.length > 2) {
                return new BezierCurve(startPos, points).generate();
            } else if (points.length < 2 || !CircleCurve.isValid(startPos, points[0], points[points.length - 1])) {
                return new BaseCurve(startPos, points).generateLinear();
            } else {
                return new CircleCurve(startPos, points).generate();
            }
        default: throw new Error(`The curve type '${slider.curveType}' is unsupported.`);
    }
}

module.exports = {
    getCurveType: getCurveType,
    getSliderNodes: getSliderNodes,
    createPath: createPath
}