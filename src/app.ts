import { Indexed } from '@ledge/types';
import { StateService } from '@uirouter/core';
import { StateProvider } from '@uirouter/angularjs';
import { autobind } from 'core-decorators';

import { NgController, makeInjectableCtrl } from './controller';
import { NgHttp, NgHttpInterceptor, NgHttpOptions } from './http';
import { InputService, NgInputOptions } from './inputs';
import { NgLogger } from './logger';
import { NgModal } from './modal';
import { NgInjector, bootstrap, injector, module } from './ng';
import { NgAppConfig, NgComponentOptions } from './options';
import { NgRenderer } from './renderer';
import { NgRouter } from './router';

@autobind
export class NgApp {
	public get module() {
		return this.$module;
	}

	public get router() {
		return this.$router;
	}

	public get config() {
		return this.$config;
	}

	public get components() {
		return new Set(this.$components.keys());
	}

	public get dependencies() {
		return new Set(this.$dependencies);
	}

	public get state() {
		return this.$injector.get<StateService>('$state');
	}

	public get http() {
		if (this._http == null) {
			this._http = this.$http({ timeout: this.$config.IS_PROD ? 10000 : undefined, getConfig: () => this.$config });
		}
		return this._http;
	}

	public get log() {
		if (this._log == null) {
			this._log = this.$logger();
		}
		return this._log;
	}

	public get modal() {
		if (this._modal == null) {
			this._modal = this.$modal();
		}
		return this._modal;
	}

	public get renderer() {
		if (this._renderer == null) {
			this._renderer = this.$renderer();
		}
		return this._renderer;
	}

	public readonly $id = '$core';
	public $injector = injector(['ng']);

	protected $dependencies: string[] = [];

	protected readonly $module = module(this.$id, this.$dependencies);
	protected readonly $bootstrap = bootstrap;
	protected readonly $components = new Map<string, NgComponentOptions>();
	protected readonly $httpInterceptors: NgHttpInterceptor[] = [];

	protected $router: NgRouter;
	protected $config: NgAppConfig;

	private _http: NgHttp;
	private _log: NgLogger;
	private _modal: NgModal;
	private _renderer: NgRenderer;

	constructor() {
		this.configure({ })
			.$module
			.config([
				'$compileProvider',
				'$locationProvider',
				'$qProvider',
				(
					$compileProvider: {
						debugInfoEnabled(active: boolean): any;
						commentDirectivesEnabled(active: boolean): any;
						cssClassDirectivesEnabled(active: boolean): any;
					},
					$locationProvider: {
						html5Mode(active: boolean): any;
					},
					$qProvider: {
						errorOnUnhandledRejections(active: boolean): any,
					},
				) => {
					const { IS_DEV, IS_STAGING } = this.$config;

					$compileProvider.debugInfoEnabled(!!(IS_DEV || IS_STAGING));
					$compileProvider.commentDirectivesEnabled(false);
					$compileProvider.cssClassDirectivesEnabled(false);

					$locationProvider.html5Mode(true);
					$qProvider.errorOnUnhandledRejections(false);
				},
			])
			.config(['$stateProvider', ($stateProvider: StateProvider) => {
				if (this.router == null) {
					return this.log.$warn('No router. Use `app.setRouter(r)` to disable this warning.');
				}

				for (const definition of this.router.getRoutes()) {
					$stateProvider.state(definition);
				}
			}])
			.run([
				'$injector',
				'$animate',
				(
					$injector: NgInjector,
					$animate: {
						enabled(active: boolean): any,
					},
				) => {
					this.$injector = $injector;
					$animate.enabled(true);
				},
			]);
	}

	/**
	 * Force the application to run an update cycle
	 */
	public async forceUpdate() {
		this.$injector.get('$rootScope').$applyAsync();
	}

	public async bootstrap({ strictDi }: { strictDi?: boolean; } = { strictDi: true }) {
		for (const [name, definition] of this.$components) {
			this.$module.component(name, definition);
		}
		if (this.$router == null) {
			this.$router = new (class extends NgRouter { })();
		}

		setTimeout(() => document.body.classList.add('bootstrapped'));
		return this.$bootstrap(document.body, [this.$id], { strictDi });
	}

	public configure(config: Partial<NgAppConfig>) {
		this.$config = new NgAppConfig(config);
		return this;
	}

	public setRouter(router: NgRouter) {
		this.$router = router;
		return this;
	}

	public addComponents(components: Map<string, NgComponentOptions> | Indexed<NgComponentOptions>) {
		const entries =
			components instanceof Map
				? components.entries()
				: Object.entries(components);

		for (let [name, component] of entries) {
			if (this.isInputComponent(component)) {
				component = InputService.defineInputComponent(component);
			}

			if (typeof component.controller === 'function') {
				component.controller = this.makeComponentController(component.controller);
			}

			this.$components.set(name, component);
		}

		return this;
	}

	public isInputComponent(
		component: NgComponentOptions & { type?: 'input' },
	): component is NgInputOptions {
		return component.type === 'input';
	}

	public addDependencies(...moduleNames: string[]) {
		this.$dependencies.push(...moduleNames);
		return this;
	}

	public addHttpInterceptor(interceptor: NgHttpInterceptor) {
		this.$httpInterceptors.push(interceptor);
		return this;
	}

	public makeComponentController<T extends NgController>(ctrl: new () => T) {
		const componentCtrl = makeInjectableCtrl<T>(ctrl, {
			log: this.log,
			http: this.http,
			renderer: this.renderer,
			config: () => this.config,
		});

		return [
			'$element',
			'$scope',
			'$injector',
			componentCtrl,
		] as [
				'$element',
				'$scope',
				'$injector',
				typeof componentCtrl
			];
	}

	protected $modal() {
		return new NgModal(
			this.renderer,
			this.log,
			this.http,
			this.config,
			this.$injector,
		);
	}

	protected $http(options: NgHttpOptions) {
		if ((typeof options.onFinally === 'function') === false) {
			options.onFinally = this.forceUpdate;
		}
		if (Array.isArray(options.interceptors)) {
			for (const interceptor of options.interceptors) {
				this.addHttpInterceptor(interceptor);
			}
		}
		// allow all dataservice instances to share the same interceptor queue
		options.interceptors = this.$httpInterceptors;

		return new NgHttp(options);
	}

	protected $logger() {
		return new NgLogger(this.renderer, this.$config.IS_PROD);
	}
	protected $renderer() {
		return new NgRenderer();
	}
}
