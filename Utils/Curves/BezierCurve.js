const BaseCurve = require("./BaseCurve");

module.exports = class BezierCurve extends BaseCurve {
    constructor(startPos, points) {
        super(startPos, [startPos, ...points]);
    }

    generate() {
        if (this.points.length == 0) {
            return this.generateLinear();
        }
        
        const data = [];

        const n = this.points.length - 1;
        const binom = (i) => {
          const factorial = (num) => num <= 1 ? 1 : num * factorial(num - 1);
          return factorial(n) / (factorial(i) * factorial(n - i));
        };
    
        for (let t = 0; t <= 1; t += 0.01) {
          let x = 0;
          let y = 0;
    
          for (let i = 0; i <= n; i++) {
            const coefficient = binom(i) * Math.pow((1 - t), (n - i)) * Math.pow(t, i);
            x += coefficient * this.points[i].x;
            y += coefficient * this.points[i].y;
          }
    
          data.push({ x: x, y: y });
        }

        return {
            type: "Bezier",
            values: data
        };
    }
}