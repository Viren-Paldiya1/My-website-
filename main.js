import { initGalaxy } from "./galaxy.js";
import { createStars } from "./stars.js";
import { createObjects } from "./objects.js";
import { initScroll } from "./scroll.js";
import { initEffects } from "./effects.js";

const engine = initGalaxy();

createStars(engine);

createObjects(engine);

initScroll(engine);

initEffects(engine);