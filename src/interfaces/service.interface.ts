import autoBind from 'auto-bind';

class Service {
  constructor() {
    autoBind(this);
  }
}

export default Service;
