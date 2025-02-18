const BEATMAP_FILE_SECTIONS = {
  SECTION_HEADER: 0,
  SECTION_GENERAL: 1,
  SECTION_EDITOR: 2,
  SECTION_METADATA: 3,
  SECTION_DIFFICULTY: 4,
  SECTION_EVENTS: 5,
  SECTION_TIMING: 6,
  SECTION_COLOURS: 7,
  SECTION_HITOBJECTS: 8
};

const OBJECT_FLAGS = {
  HIT_CIRCLE: 1,
  SLIDER: 2,
  NEW_COMBO: 4,
  SPINNER: 8,
  SKIP_COLOR_1: 16,
  SKIP_COLOR_2: 32,
  SKIP_COLOR_3: 64,
  HOLD: 128,
};

const SLIDER_CURVE_TYPE = {
  UNKNOWN: 0,
  LINEAR: 1,
  CATMULL: 2,
  BEZIER: 3,
  PERFECT: 4
};

const DEFAULT_COMBO = {
  COLOR_1: [0, 202, 0],
  COLOR_2: [18,124,255],
  COLOR_3: [242,24,57],
  COLOR_4: [255,292,0],
  COLORS: [
    [0, 202, 0],
    [18,124,255],
    [242,24,57],
    [255,292,0]
  ]
}

function HAS_FLAG(flags, flag) {
  if (flag === 0) {
    return flags === 0;
  }
  return (flags & flag) === flag;
}

module.exports = {
  BEATMAP_FILE_SECTIONS,
  OBJECT_FLAGS,
  SLIDER_CURVE_TYPE,
  DEFAULT_COMBO,
  HAS_FLAG
};
