import autoBind from 'auto-bind';

class Controller {
	constructor() {
		autoBind(this);
	}
}

export default Controller;
