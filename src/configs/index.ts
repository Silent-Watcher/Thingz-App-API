import path from 'node:path';

const configs = Object.freeze({
  VIEW_FILES_PATH: path.join(process.cwd(), 'src', 'public', 'views'),
  STATIC_FILES_PATH: path.join(process.cwd(), 'src', 'public'),
});

export default configs;
