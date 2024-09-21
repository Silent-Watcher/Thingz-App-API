import { Eta } from 'eta';
import configs from '.';

const eta = new Eta({ views: configs.VIEW_FILES_PATH });

export { eta };
