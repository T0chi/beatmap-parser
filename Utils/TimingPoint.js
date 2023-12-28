class TimingPoint {
  constructor(time = 0, beatLength = 0, beatsPerMeasure = 0, sampleSet = 0, sampleIdx = 0, sampleVol = 0, uninherited = false, effects = 0) {
    this.time = time;
    this.beatLength = beatLength;
    this.beatsPerMeasure = beatsPerMeasure;

    // this is non-inherited timingPoint
    if (this.beatLength >= 0)
    {
      TimingPoint.parent = this;
    }
    else
    {
      this.parent = TimingPoint.parent;
      var sliderVelocity = -100 / this.beatLength;
      this.beatLength = this.parent.beatLength / sliderVelocity;
      this.beatsPerMeasure = this.parent.beatsPerMeasure;
    }

    this.bpm = 60000 / this.beatLength;
    this.sampleSet = sampleSet;
    this.sampleIdx = sampleIdx;
    this.sampleVol = sampleVol;
    this.uninherited = uninherited;
    this.effects = effects;
  }
}

module.exports = TimingPoint;
