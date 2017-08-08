import { IAttributes, IComponentOptions } from 'angular';
import { Indexed } from '@ledge/types';

import * as inputs from './src/input';
import { NgApp } from './src/app';
import { NgController } from './src/controller';
import { NgRenderer } from './src/renderer';

const $inputs = new Map(Object.entries(inputs));
export const app = new NgApp()
	.registerComponents($inputs);

export { NgDataService } from './src/http';
export { NgLogger } from './src/logger';
export { NgModalService } from './src/modal';
export { NgController, NgRenderer };

export interface NgModalOptions {
	template?: string;
	appendTo?: Element;
	size?: 'sm' | 'md' | 'lg';
	controller?: new() => any;
	controllerAs?: string;
}

export interface InputComponentOptions extends IComponentOptions {
	/**
	 * Set this so the app knows how to register your definition
	 */
	type: 'input';

	/**
	 * Use this instead of controller (the app will disregard the controller prop for type safety reasons)
	 */
	ctrl?: new(...args: any[]) => NgController;

	/**
	 * Allow input group icons to be defined by users on the input
	 */
	canHaveIcon?: true;

	/**
	 * Special attributes to set on the input
	 */
	attrs?: Indexed;

	/**
	 * CSS class to apply to the input container. Defaults to 'form-group'.
	 */
	templateClass?: string;

	/**
	 * CSS class to apply to the input label. Defaults to 'form-control-label'.
	 */
	labelClass?: string;

	/**
	 * Whether the rendered input should be nested inside the label
	 */
	nestInputInLabel?: boolean;

	/**
	 * Run after container & label creation, before label manipulation
	 */
	render(this: {
		/**
		 * Input container
		 */
		$template: HTMLDivElement;
		/**
		 * Angular.js $attrs object
		 */
		$attrs: IAttributes;
	},     h: NgRenderer): Element;

	/**
	 * Special hook to override how label text is generated
	 */
	renderLabel?(this: {
		/**
		 * Input label
		 */
		$label: HTMLLabelElement;
		/**
		 * Angular.js $attrs object
		 */
		$attrs: IAttributes;
	},           h: NgRenderer): void;
}
