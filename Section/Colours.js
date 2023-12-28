module.exports = (line, beatmapInstance) => {
    line = line.replaceAll(" ", "");
    var colors = line.split(':')[1].split(',');
    beatmapInstance.comboColors.push([parseFloat(colors[0]), parseFloat(colors[1]), parseFloat(colors[2])]);
};
