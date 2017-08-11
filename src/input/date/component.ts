import { isFunction } from 'angular';
import { Callback } from '@ledge/types';

import { NgComponentController } from '../../controller';
import { InputComponentOptions } from '../../..';

class DateInputController extends NgComponentController {
	private hasFocus: boolean = false;
	private onChange: Callback;

	constructor() {
		super();

		this.ngModel = new Date();
		this.$timeout();
	}

	public toggleDatepicker() {
		const input = (this.$element.find('input') as any)[0] as HTMLInputElement;
		const method = (this.hasFocus = !this.hasFocus) ? 'focus' : 'blur';

		input[method]();
	}

	public handleDateEvent() {
		if (this.onChange != null && isFunction(this.onChange)) {
			this.onChange(this.ngModel);
		}
	}
}

export const dateInput: InputComponentOptions = {
	type: 'input',
	render(h) {
		const input = h.createInput('text', [
			['uib-datepicker-popup', 'MM/dd/yyyy'],
			['datepicker-append-to-body', 'true'],
			['is-open', '$ctrl.hasFocus'],
			['ng-click', '$ctrl.hasFocus = true'],
			['ng-change', '$ctrl.handleDateEvent()'],
		]);

		return h.createIconInput(input, 'calendar', [
			['ng-click', '$ctrl.toggleDatepicker()'],
			['style', 'cursor:pointer'],
		]);
	},
	ctrl: DateInputController,
};
