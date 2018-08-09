import AudioBoard from '../AudioBoard.js';
import {loadJSON} from '../loaders.js';

export function loadSounds(name, audioContext) {
    const loadAudio = createAudioLoader(audioContext);
    const sounds = {};
    return loadJSON(`/audio/${name}.json`)
        .then(audioSheet => {
            const fx = audioSheet.fx;
            return Promise.all(Object.keys(fx).map(name => {
                return loadAudio(fx[name].url)
                    .then(buffer => {
                        sounds[name] = buffer;
                    });
            }));
        })
        .then(() => {
            return sounds;
        });
}

export function createAudioLoader(context) {
    return function loadAudio(url) {
        return fetch(url)
           .then(response => {
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                return context.decodeAudioData(arrayBuffer);
            });
    }
}
