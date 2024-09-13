export default function (
	/** @type {import('plop').NodePlopAPI} */
	plop,
) {
	// create your generators here
	plop.setGenerator('basics', {
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Name your resource: ',
			},
		], // array of inquirer prompts
		actions: [
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.model.ts',
				templateFile: 'templates/model.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.messages.ts',
				templateFile: 'templates/messages.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.routes.ts',
				templateFile: 'templates/routes.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.service.ts',
				templateFile: 'templates/service.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.controller.ts',
				templateFile: 'templates/controller.template.hbs',
			},
		], // array of actions
	});
}
