import adjectives_lists from "./adjectives_lists.json" with { type: "json" };
import animals_lists from "./animal_lists.json" with { type: "json" };

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

    const firstAdj = adjectives_lists.AdjectivLists.A[String(a)];
    const secondAdj = adjectives_lists.AdjectivLists.B[String(b)];
    const animal = animals_lists.Animals[String(c)];

    return `${firstAdj}${secondAdj}${animal}_${randomizer}`;
}
