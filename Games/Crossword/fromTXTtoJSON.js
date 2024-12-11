let clues = [];

function preload() {
    let filePath = 'clues.txt';
    fetch(filePath)
        .then(response => response.text())
        .then(data => processFile(data))
        .catch(error => console.error('Error loading file:', error));
}

function processFile(data) {
    let lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const [solution, clue] = lines[i].split('\t').slice(-2);
        clues.push({ solution, clue });
    }

    // Filter out objects where the "solution" contains a non-uppercase letter
    clues = clues.filter(clueObj => /^[A-Z]+$/.test(clueObj.solution));

    // Sort the array based on the "solution" attribute (if it's not already sorted)
    clues.sort((a, b) => {
        if (a.solution < b.solution) {
            return -1;
        } else if (a.solution > b.solution) {
            return 1;
        } else {
            return 0;
        }
    });

    const groupedClues = groupWordsBySolution(clues);

    saveJSON(groupedClues, 'clues.json');
}

function groupWordsBySolution(clues) {
    const groupedClues = groupWordsBySolutionInternal(clues);

    const groupedByLength = {};

    for (const clueObj of groupedClues) {
        const len = clueObj.solution.length;
        if (!groupedByLength[len])
            groupedByLength[len] = [];

        groupedByLength[len].push(clueObj);
    }

    return groupedByLength;
}

function groupWordsBySolutionInternal(clues) {
    const groupedClues = [];
    let currentGroup = { solution: '', clues: [] };

    for (const clueObj of clues) {
        if (currentGroup.solution !== clueObj.solution) {
            if (currentGroup.solution)
                groupedClues.push(currentGroup);

            currentGroup = { solution: clueObj.solution, clues: [clueObj.clue] };
        } else {
            currentGroup.clues.push(clueObj.clue);
        }
    }

    if (currentGroup.solution)
        groupedClues.push(currentGroup);

    return groupedClues;
}

function setup() {}