const Constants = require("../Utils/Constants");
const SliderUtils = require("./SliderUtils");

class HitObject {
  constructor(x, y, time, params, flags, combo, beatmap) {
    this.x = x + beatmap.playfieldToStoryboardOffset.x;
    this.y = y + beatmap.playfieldToStoryboardOffset.y;
    this.time = time;
    this.params = params;
    this.flags = flags;
    this.combo = combo;
    this.beatmap = beatmap;
    this.preprocessed = false;
    this.preprocessedStacking = false;
  }
}

class HitCircle extends HitObject {
  constructor(x, y, time, params, flags, combo, beatmap) {
    super(x, y, time, params, flags, combo, beatmap);
  }
}

class Slider extends HitObject {
  constructor(x, y, time, params, flags, combo, beatmap) {
    super(x, y, time, params, flags, combo, beatmap);
    this.curveType = SliderUtils.getCurveType(params);
    this.nodeCount = params[1] | 0;
    this.pixelLength = parseFloat(params[2]);
    this.sliderTime = beatmap.timingPointAt(time).beatLength *
      (this.pixelLength / beatmap.sliderMultiplier) / 100;
    this.nodes = SliderUtils.getSliderNodes(params, beatmap);
    this.path = [];
    this.endTime = time + this.sliderTime * this.nodeCount;
    this.duration = this.endTime - time;
    this.endPosition = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : { x: x, y: y };
  }
}

class Spinner extends HitObject {
  constructor(x, y, time, params, flags, combo, beatmap) {
    super(x, y, time, params, flags, combo, beatmap);
    this.endTime = params[0];
  }
}

module.exports = {
  HitObject,
  HitCircle,
  Slider,
  Spinner
};
