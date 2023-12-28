module.exports = class BaseCurve {
    constructor(startPos, points) {
        this.points = points;
        this.startPos = startPos;
        this.endPos = points.length > 0 ? points[points.length - 1] : startPos;
    }

    generateLinear() {
        const data = [];

        data.push({ x: this.startPos.x, y: this.startPos.y });
        this.points.forEach(point => { data.push({ x: point.x, y: point.y })});

        return {
            type: "Linear",
            values: data
        };
    }

    generate() { }
}