const BaseCurve = require("./BaseCurve");

module.exports = class CatmullCurve extends BaseCurve {
    constructor(startPos, points) {
        super(startPos, [startPos, ...points]);
    }

    generate() {
        if (this.points.length == 0) {
            return this.generateLinear();
        }
        
        const data = [];

        for (let i = 0; i < this.points.length - 1; i++) {
            const p0 = i === 0 ? this.startPos : this.points[i - 1];
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            const p3 = i === this.points.length - 2 ? this.endPos : this.points[i + 2];

            for (let t = 0; t <= 1; t += 0.01) {
                const x = 0.5 * (
                    (2 * p1.x) +
                    (-p0.x + p2.x) * t +
                    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t +
                    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t
                );

                const y = 0.5 * (
                    (2 * p1.y) +
                    (-p0.y + p2.y) * t +
                    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t +
                    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t
                );

                data.push({ x, y });
            }
        }

        return {
            type: "Catmull",
            values: data
        };
    }
}