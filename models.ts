// tslint:disable:no-empty-interface max-line-length

import { IAttributes, ICompileService, IComponentOptions, IRootElementService, IScope, ITimeoutService } from 'angular';
import { Callback, IConfig, Indexed } from '@ledge/types';
import { Cache, CacheOptions } from 'cachefactory';

export interface IApp {
	name: string;
	config: IConfig;
	bootstrap(): void;
	cache(options?: CacheOptions): Cache;
	http(): DataService;
	logger(): Logger;
	registerComponents(components: { [name: string]: IComponentOptions }): this;
	compiler(): Compiler;
	root(): RootElement;
	renderer(): Renderer;
	scope(): Scope;
	timeout(): Timeout;
}

export interface CoreModel extends Indexed {
	Id?: number;
	Description: string;
}

export interface Compiler extends ICompileService {}
export interface RootElement extends IRootElementService {}
export interface Scope extends IScope {}
export interface Timeout extends ITimeoutService {}

export interface DataService {
	Get<T = any>(url: string, defaultReturn?: T): PromiseLike<T>;
	Post<T = any>(url: string, data?: T): PromiseLike<T>;
}

export interface Logger {
	confirm(action: Callback): void;
	error(msg: string): void;
	info(msg: string): void;
	success(msg: string): void;
	warning(msg: string): void;
	devWarning(msg: string): void;
}

export interface Renderer {
	baseInputAttrs: [string, string][];
	registerElement($element: JQuery): this;
	createElement<T extends keyof HTMLElementTagNameMap>(tagName: T, classes?: string[], attrs?: [string, string][]): Element;
	createInput(type?: string, attrs?: [string, string][]): HTMLInputElement;
	createTextArea(): HTMLTextAreaElement;
	createIcon(icon: string): HTMLSpanElement;
	createLabel(classList: string[]): HTMLLabelElement;
	isSrOnly($attrs: IAttributes): boolean;
	modelIdentifier($attrs: IAttributes, opts?: { unique: true }): string;
	getId($attrs: IAttributes): string;
	getIdForLabel($attrs: IAttributes): string;
}
