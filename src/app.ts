// tslint:disable-next-line:max-line-length
import { IAttributes, ICompileProvider, IComponentOptions, IController, ILocationProvider, IRootElementService, IScope, ITimeoutService, animate, auto, bootstrap, injector, module } from 'angular';
import { IState, IStateProvider } from 'angular-ui-router';
import { IConfig } from '@ledge/types';

import { NgDataService } from './http';
import { NgLogger } from './logger';
import { NgModalService } from './modal';
import { NgRenderer } from './renderer';

import { InputComponentOptions } from '..';
import { InputService } from './input/service';

import 'angular-animate';
import 'angular-elastic';
import 'angular-ui-bootstrap';

import '@uirouter/angularjs';

export class NgApp {
	public $injector = injector(['ng']);

	private readonly $id: string = '$core';
	private readonly $dependencies = [
		'ngAnimate',
		'ui.bootstrap',
		'ui.router',
		'monospaced.elastic',
	];

	private $config: IConfig = { ENV: process.env.NODE_ENV };

	private $module = module(this.$id, this.$dependencies);
	private $bootstrap = bootstrap;

	private $components: Map<string, IComponentOptions> = new Map();
	private $routes: IState[] = [];

	constructor() {
		this.$module
			.config([
				'$compileProvider', '$locationProvider',
				($compileProvider: ICompileProvider, $locationProvider: ILocationProvider) => {
					$compileProvider
						.commentDirectivesEnabled(false)
						.cssClassDirectivesEnabled(false);

					$locationProvider.html5Mode(true);
			}])
			.run(['$injector', '$animate', ($injector: auto.IInjectorService, $animate: animate.IAnimateService) => {
				this.$injector = $injector;
				$animate.enabled(true);
			}]);
	}

	public get name() {
		return this.$module.name;
	}

	public get config() {
		return this.$config;
	}

	public set config(cfg: IConfig) {
		this.$config = cfg;
		this.$config.ENV = process.env.NODE_ENV;

		if (this.$config.PREFIX == null) {
			this.$config.PREFIX = { API: '' };
		} else if (!this.$config.PREFIX.API) {
			this.$config.PREFIX.API = '';
		}
	}

	public bootstrap() {
		for (const [name, definition] of this.$components) {
			this.$module.component(name, definition);
		}

		this.$module.config(['$stateProvider', ($stateProvider: IStateProvider) => {
			for (const definition of this.$routes) {
				$stateProvider.state(definition);
			}
		}]);

		this.$bootstrap(document.body, [this.$id]);
	}

	public registerRoutes(routes: IState[]) {
		this.$routes = [
			...(this.$routes), /*parens for syntax highlighting*/
			...routes,
		];
		return this;
	}

	public registerComponents(components: Map<string, IComponentOptions>) {
		const logger = this.logger();

		// tslint:disable-next-line:prefer-const
		for (let [name, component] of components) {
			if ((component as InputComponentOptions).type === 'input') {
				component = InputService.defineInputComponent(component as InputComponentOptions);
			}

			if (component.controller != null) {
				const $controller = component.controller as new(...args: any[]) => IController;

				// tslint:disable-next-line:max-classes-per-file
				class InternalController extends $controller {
					public $log = logger;
					public $http: NgDataService;

					constructor(
						public $scope: IScope,
						public $element: IRootElementService,
						public $attrs: IAttributes,
						public $timeout: ITimeoutService,
						public $injector: auto.IInjectorService,
					) {
						super();

						this.$http = new NgDataService(
							this.$injector.get('$http'),
							this.$log,
						);
					}
				}

				// tslint:disable-next-line:only-arrow-functions
				component.controller = ['$scope', '$element', '$attrs', '$timeout', '$injector', InternalController];
			}

			this.$components.set(name, component);
		}

		return this;
	}

	public compiler() {
		return this.$injector.get('$compile');
	}

	public http() {
		const $http = this.$injector.get('$http');
		return new NgDataService($http, this.logger());
	}

	public logger() {
		const $log = this.$injector.get('$log');
		return new NgLogger($log);
	}

	public modal() {
		return new NgModalService(this.$injector.get('$uibModal'));
	}

	public renderer() {
		return new NgRenderer();
	}

	public root() {
		return this.$injector.get('$rootElement');
	}

	public scope() {
		const $rootScope = this.$injector.get('$rootScope');
		return $rootScope.$new();
	}

	public timeout() {
		return this.$injector.get('$timeout');
	}
}
