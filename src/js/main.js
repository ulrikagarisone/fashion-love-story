import '../styles/style.css';
import '../styles/reset.css';

import { initHero } from './hero.js';
import { initInteraction1 } from './interaction1.js';
import { initInteraction2 } from './interaction2.js';
import { initInteraction3 } from './interaction3.js';
import { initDirk } from './dirk.js';
import { initGeneralInteractions } from './general.js';
import { initCaptainAnimation } from './captain.js';

// Start everything
const init = () => {
  initHero();
  initInteraction1();        
  initInteraction2(); 
  initInteraction3();   
  initDirk();
  initGeneralInteractions();
  initCaptainAnimation();
};

init();