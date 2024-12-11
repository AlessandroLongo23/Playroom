function preload() {
    data = loadJSON("clues.json");

    absoluteFrequencies = [];
    for (let i = 0; i < 26; i++)
        absoluteFrequencies.push(0);

    relativeFrequencies = [];
    total = 0;
}

function setup() {
    for (let l = 0; l < Object.keys(data).length; l++) {
        for (let w = 0; w < data[Object.keys(data)[l]].length; w++) {
            for (let c = 0; c < data[Object.keys(data)[l]][w].solution.length; c++) {
                absoluteFrequencies[unchar(data[Object.keys(data)[l]][w].solution.charAt(c)) - 65]++;
                total++;
            }
        }
    }

    for (let i = 0; i < 26; i++)
        relativeFrequencies[i] = absoluteFrequencies[i] / total;

    saveJSON(relativeFrequencies, 'frequencies.json');
}