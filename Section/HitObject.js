const Constants = require("../Utils/Constants");
const HitObjects = require("../Utils/HitObjects");

module.exports = (line, beatmapInstance) => {
  try {
    let splitted = line.split(',');
    var x = parseInt(splitted[0]);
    var y = parseInt(splitted[1]);
    var time = parseInt(splitted[2]);
    var flags = parseInt(splitted[3]);
    var params = [];
    splitted.forEach((p, i) => {
      if (i >= 5) {
        params.push(p);
      }
    });

    var objectType = Constants.OBJECT_FLAGS.HIT_CIRCLE;
    var targetObject = HitObjects.HitObject;
    if (Constants.HAS_FLAG(flags, Constants.OBJECT_FLAGS.HIT_CIRCLE)) {
      objectType = Constants.OBJECT_FLAGS.HIT_CIRCLE;
      targetObject = HitObjects.HitCircle;
    }
    else if (Constants.HAS_FLAG(flags, Constants.OBJECT_FLAGS.SLIDER)) {
      objectType = Constants.OBJECT_FLAGS.SLIDER;
      targetObject = HitObjects.Slider;
    }
    else if (Constants.HAS_FLAG(flags, Constants.OBJECT_FLAGS.SPINNER)) {
      objectType = Constants.OBJECT_FLAGS.SPINNER;
      targetObject = HitObjects.Spinner;
    }

    var combo = {};
    combo.new = flags & Constants.OBJECT_FLAGS.NEW_COMBO;
    combo.skip = flags >> Constants.OBJECT_FLAGS.NEW_COMBO;
    combo.index = 1;
    combo.colorIndex = 0;
    combo.color = [255, 255, 255];
    beatmapInstance.hitEvents.push(new targetObject(x, y, time, params, flags, combo, beatmapInstance));
  }
  catch (e) {
    alert("HitObject.js error: " + e);
    console.log("HitObject.js error: " + e);
  }
};
