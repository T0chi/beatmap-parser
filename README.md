# beatmap-parser
[Syncronous osu! beatmap file parser written in JavaScript by r0neko](https://github.com/r0neko/osuParser) and upgraded by -Tochi.

### Upgrades
- Added bookmarks
- Added sliders + respective calculations
- Added JSON Object with beatmap data including hitobjects (check `preprocessHitObjects()` in `../Utils/Beatmap.js#L95-L234`)

### Installation

osuParser requires [node.js](https://nodejs.org/) v4+ to run.

Install this package through npm(NodeJS Package Manager).

```sh
$ npm install @r0neko/osuparser
```
### Usage

Example code:

```js
const osuParser = require("@r0neko/osuparser");

console.log("Opening the beatmap!");
let map = osuParser.ParseFile("./TestMap.osu");
// or osuParser.Parse(string) if you want to parse the map from raw string

console.log(`Map opened; ${map.title} - ${map.artist}(${map.creator}) [${map.version}] - Designed for GameMode ${map.mode}`);
console.log(`Audio file: ${map.audio}`);
console.log(`HP: ${map.hp}; CS: ${map.cs}; OD: ${map.od}; CS: ${map.cs}`);
```
