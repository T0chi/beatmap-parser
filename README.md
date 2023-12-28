# beatmap-parser
[Syncronous osu! beatmap file parser written in JavaScript by r0neko](https://github.com/r0neko/osuParser) and upgraded by -Tochi.

### Upgrades
- Added bookmarks
- Added sliders + respective calculations
- Added JSON Object with beatmap data including hitobjects (check `preprocessHitObjects()` in `../Utils/Beatmap.js#L95-L234`)

### Installation

osuParser requires [node.js](https://nodejs.org/) v4+ to run.

### Usage

Example code:

```js
const ParseFile = require("./beatmap-parser/parser").ParseFile;
const Parse = require("./beatmap-parser/parser").Parse;

console.log("Opening the beatmap!");
let map = ParseFile(beatmapPath);
// or Parse(string) if you want to parse the map from raw string

console.log(`Map opened; ${map.title} - ${map.artist}(${map.creator}) [${map.version}] - Designed for GameMode ${map.mode}`);
console.log(`Audio file: ${map.audio}`);
console.log(`HP: ${map.hp}; CS: ${map.cs}; OD: ${map.od}; CS: ${map.cs}`);
```
