'use strict';

const teoria = require('teoria');
const chordUtil = require('./chords');
const helper = require('./helpers');

function createVerse(chords) {
    let possibleSteps = [0, 2, 3, 5, 6];
    let progression = chordUtil.createProgression(chords, possibleSteps, {
        startChord: 0
    });

    return progression;
}

function createChorus(chords) {
    let possibleSteps = [0, 2, 3, 4, 5, 6];

    let progressionA = chordUtil.createProgression(chords, possibleSteps, {
        notFirst: [0],
        notLast: [0]
    });

    let progressionBstart = progressionA.slice(0, 2);

    let progressionBend = chordUtil.createProgression(chords, possibleSteps, {
        notLast: [progressionA[progressionA.length - 1].step],
        bars: 2
    });

    return progressionA.concat(progressionBstart).concat(progressionBend);
}

function createPreChorus(chords, verse, chorus) {
    let possibleSteps = [0, 1, 2, 3, 4, 5, 6];

    let progressionA = chordUtil.createProgression(chords, possibleSteps, {
        notFirst: [verse[0].step, 1],
        notLast: [chorus[chorus.length - 1].step, 1],
        stepOccurance: {
            1: 1
        }
    });

    let chorusFirstQuality = chorus[0].quality();
    let lastQuality = null;

    if (chorusFirstQuality === 'minor') {
        lastQuality = 'major'
    } else if (chorusFirstQuality === 'major') {
        lastQuality = 'minor'
    }

    let progressionBstart = progressionA.slice(0, 2);

    let progressionBend = chordUtil.createProgression(chords, possibleSteps, {
        notLast: [chorus[chorus.length - 1].step, progressionA[progressionA.length - 1].step],
        stepOccurance: {
            1: 1
        },
        bars: 2,
        lastQuality: lastQuality
    });

    return progressionA.concat(progressionBstart).concat(progressionBend);
}

function printSong(parts) {
    let lines = [];

    Object.keys(parts).forEach((partName, index) => {
        let part = parts[partName];

        lines.push((index === 0 ? '' : '\n') + partName);

        lines = lines.concat(part.map(partLine => {
            return partLine.map(chord => chord.name).join(' ');
        }));
    });

    let output = lines.join('\n');

    console.log(output)
}

module.exports = {
    createSong: function (root, quality) {
        let chords = chordUtil.scaleChords(root, quality);

        let verse = createVerse(chords).map(chord => chord.chord);
        let chorus = createChorus(chords).map(chord => chord.chord);
        let preChorus = createPreChorus(chords, verse, chorus).map(chord => chord.chord);

        let parts = {
            verse: [
                verse,
                verse
            ],
            preChorus: [
                preChorus.slice(0, 4),
                preChorus.slice(4, 8),
            ],
            chorus: [
                chorus.slice(0, 4),
                chorus.slice(4, 8),
            ]
        }

        printSong(parts)
    }
};
