const HitObject = require("./HitObjects").HitObject;
const HitCircle = require("./HitObjects").HitCircle;
const Slider = require("./HitObjects").Slider;
const Spinner = require("./HitObjects").Spinner;
const SliderUtils = require("../Utils/SliderUtils");

class Beatmap {
    constructor() {
        this.mode = 0;
        this.formatVersion = 0;
        this.audio = "";
        this.leadIn = 0;
        this.previewTime = 0;
        this.stackLeniency = 0.7;

        this.bookmarks = [];
        this.distanceSpacing = 0;
        this.beatDivisor = 0;

        this.hp = 0;
        this.cs = 0;
        this.ar = 0;
        this.sliderMultiplier = 0;
        this.sliderTickRate = 0

        this.circleRadius = this.circleDiameter / 2;
        this.circleBorder = this.circleRadius / 8;
        this.shadowBlur = this.circleRadius / 15;

        this.title = "";
        this.titleUnicode = "";
        this.artist = "";
        this.artistUnicode = "";
        this.creator = "";
        this.version = "";
        this.tags = "";
        this.source = "";
        this.mapID = 0;
        this.setID = 0;

        this.timingPoints = [];
        this.comboColors = [];
        this.hitEvents = [];
        this.hitobjects = {};

        this.playfieldSize = { x: 512.0, y: 384.0 };
        this.storyboardSize = { x: 640.0, y: 480.0 };
    }

    get playfieldToStoryboardOffset() {
        return { x: (this.storyboardSize.x - this.playfieldSize.x) * 0.5, y: (this.storyboardSize.y - this.playfieldSize.y) * 0.75 - 16 };
    }

    get countHitCircles() {
        return this.hitEvents.length > 0 ? this.hitEvents.map(e => e instanceof HitCircle).length : 0;
    }

    get approachTime() {
        return this.ar < 5
            ? 1800 - this.ar * 120
            : 1200 - (this.ar - 5) * 150;
    }

    get circleDiameter() {
        return 108.848 - this.cs * 8.9646;
    }

    get stackOffset() {
        return this.circleDiameter / 20;
    }

    timingPointIndexAt(time) {
        var begin = 0,
            end = this.timingPoints.length - 1;
        while (begin <= end) {
            var mid = (begin + end) / 2 | 0;
            if (time >= this.timingPoints[mid].time) {
                if (mid + 1 == this.timingPoints.length ||
                    time < this.timingPoints[mid + 1].time) {
                    return mid;
                }
                begin = mid + 1;
            }
            else {
                end = mid - 1;
            }
        }
        return 0;
    }

    timingPointAt(time) {
        return this.timingPoints[this.timingPointIndexAt(time)];
    }

    preprocessHitObjects() {
        var ratioScaling = 1080.0 / this.storyboardSize.y;
        var offsetToCenterX = (1922.0 - (this.storyboardSize.x * ratioScaling)) / 2.0;

        // combo colors
        var combo = 1, comboIndex = -1, setComboIndex = 1;
        if (this.comboColors.length == 0) {
            this.comboColors = Constants.DEFAULT_COMBO.COLORS;
        }

        // hitobjects
        this.hitobjects.failedHitObjects = {};
        this.hitobjects.failedHitObjects.circles = 0;
        this.hitobjects.failedHitObjects.sliders = 0;

        this.hitobjects.ar = this.ar;
        this.hitobjects.cs = this.cs;
        this.hitobjects.bookmarks = this.bookmarks.join(',');

        this.hitobjects.approachTime = this.approachTime;
        this.hitobjects.stackLeniency = this.stackLeniency;
        this.hitobjects.stackOffset = this.stackOffset;

        this.hitobjects.circleRadius = this.circleRadius;
        this.hitobjects.circleDiameter = this.circleDiameter;
        this.hitobjects.circleBorder = this.circleBorder;

        this.hitobjects.sliderMultiplier = this.sliderMultiplier;
        this.hitobjects.sliderTickRate = this.sliderTickRate;
        this.hitobjects.shadowBlur = this.shadowBlur;

        this.hitobjects.circles = [];
        this.hitobjects.sliders = [];

        for (var i = 0; i < this.hitEvents.length; i++) {
            if (this.hitEvents[i] instanceof HitObject) {
                if ((!(this.hitEvents[i] instanceof HitCircle) &&
                    !(this.hitEvents[i] instanceof Slider)) ||
                    this.hitEvents[i].preprocessed) {
                    continue;
                }

                // apply combo color
                if (this.hitEvents[i] instanceof Spinner) {
                    setComboIndex = 1;
                }
                else if (this.hitEvents[i].combo.new || setComboIndex) {
                    combo = 1;
                    comboIndex = ((comboIndex + 1) + this.hitEvents[i].combo.skip) % this.comboColors.length;
                    setComboIndex = 0;
                }
                this.hitEvents[i].combo.index = combo++;
                this.hitEvents[i].combo.colorIndex = comboIndex;
                this.hitEvents[i].combo.color = this.comboColors[comboIndex];

                // stacking
                if (this.stackLeniency > 0) {
                    var stackCount = -1;
                    while (i + stackCount < this.hitEvents.length) {
                        var nextHitObject = this.hitEvents[i + stackCount];
                        if (nextHitObject instanceof HitObject) {
                            var nextPosition = { x: nextHitObject.x, y: nextHitObject.y };
                            if (nextPosition.x == this.hitEvents[i].x && nextPosition.y == this.hitEvents[i].y) {
                                stackCount++;
                            }
                            else break;
                        }
                        else break;
                    }

                    if (stackCount > 0) {
                        for (var s = 0; s < stackCount; s++) {
                            if (this.hitEvents[i + s].preprocessedStacking) {
                                continue;
                            }

                            var newStackCount = (stackCount / (s + 1)) - 1;
                            this.hitEvents[i + s].x -= this.stackOffset * this.stackLeniency * newStackCount;
                            this.hitEvents[i + s].y -= this.stackOffset * this.stackLeniency * newStackCount;
                            if (this.hitEvents[i + s] instanceof Slider) {
                                for (var n = 0; n < this.hitEvents[i + s].nodes.length; n++) {
                                    this.hitEvents[i + s].nodes[n].x -= this.stackOffset * this.stackLeniency * newStackCount;
                                    this.hitEvents[i + s].nodes[n].y -= this.stackOffset * this.stackLeniency * newStackCount;
                                }
                            }
                            this.hitEvents[i + s].preprocessedStacking = true;
                        }
                    }
                }

                // scale to after effects comp size
                this.hitEvents[i].x *= ratioScaling;
                this.hitEvents[i].y *= ratioScaling;
                this.hitEvents[i].x += offsetToCenterX;
                if (this.hitEvents[i] instanceof Slider) {
                    for (var n = 0; n < this.hitEvents[i].nodes.length; n++) {
                        this.hitEvents[i].nodes[n].x *= ratioScaling;
                        this.hitEvents[i].nodes[n].y *= ratioScaling;
                        this.hitEvents[i].nodes[n].x += offsetToCenterX;
                    }
                    this.hitEvents[i].path = SliderUtils.createPath(this.hitEvents[i]);
                }

                // prepare hitobjects.json hitobject data
                var startPosition = { x: this.hitEvents[i].x, y: this.hitEvents[i].y };
                if (this.hitEvents[i] instanceof HitCircle) {
                    try {
                        this.hitobjects.circles.push({
                            startTime: this.hitEvents[i].time,
                            startPosition: startPosition,
                            combo: this.hitEvents[i].combo
                        });
                    }
                    catch (hitobj_err) { this.hitobjects.failedHitObjects.circles++; console.log("Failed Circle HitObjects error: " + hitobj_err); }
                }
                else if (this.hitEvents[i] instanceof Slider) {
                    try {
                        this.hitobjects.sliders.push({
                            startTime: this.hitEvents[i].time,
                            endTime: this.hitEvents[i].endTime,
                            duration: this.hitEvents[i].duration,
                            startPosition: startPosition,
                            endPosition: this.hitEvents[i].endPosition,
                            combo: this.hitEvents[i].combo,
                            curveType: this.hitEvents[i].curveType,
                            nodeCount: this.hitEvents[i].nodeCount,
                            pixelLength: this.hitEvents[i].pixelLength,
                            sliderTime: this.hitEvents[i].sliderTime,
                            path: this.hitEvents[i].path
                        });
                    }
                    catch (hitobj_err) { this.hitobjects.failedHitObjects.sliders++; console.log("Failed Slider HitObjects error: " + hitobj_err); }
                }
            }

            this.hitEvents[i].preprocessed = true;
        }

        return this.hitobjects;
    }
}

module.exports = Beatmap;
