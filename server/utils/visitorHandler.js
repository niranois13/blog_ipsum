import adjectives_lists from './adjectives_lists.json';
import animals_lists from './animal_lists.json';

function generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateRandomUsername() {
    const a = generateRandomNumber(1, 100);
    const b = generateRandomNumber(1, 100);
    const c = generateRandomNumber(1, 100);
    const randomizer = generateRandomNumber(0, 1000);

    const firstAdj = adjectives_lists.A[a];
    const secondAdj = adjectives_lists.B[b];
    const animal = animals_lists.Animals[c];

    return (`${firstAdj}${secondAdj}${animal}_${randomizer}`);
}
