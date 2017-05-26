import 'bootstrap-datepicker';

import { IAttributes, IScope, isFunction } from 'angular';
import { Callback } from '@ledge/types';

import { applyCoreDefinition } from 'core/input/definition';
import { CoreInputController } from 'core/input/controller';

class DateInputController extends CoreInputController {
	private hasFocus: boolean = false;
	private onChange: Callback;

	/* @ngInject */
	constructor($scope: IScope, $element: JQuery, $attrs: IAttributes) {
		super($scope, $element, $attrs, { maxlength: 3000, placeholder: '' });
	}

	public $postLink() {
		const $input = this.makeInput('text', new Map([['ng-click', '$ctrl.hasFocus = true']]));

		$input
			.datepicker({
				clearBtn: true,
				autoclose: true,
				keyboardNavigation: false,
				todayBtn: true,
				todayHighlight: true,
			})
			.on('changeDate', e => this.handleDateEvent(e))
			.on('clearDate', e => this.handleDateEvent(e))
			.on('blur', () => this.scheduleForLater(() => this.onblur(), 200));

		this
			.wireToContainer('.input-group', $input)
			.ngModel = this.formatDate();
	}

	public toggleDatepicker() {
		const el = this.$element.find('input');
		const method = (this.hasFocus = !this.hasFocus) ? 'focus' : 'blur';

		el[method]();
	}

	private onblur() {
		this.hasFocus = false;
	}

	private formatDate(date: Date = new Date()) {
		return date.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	private handleDateEvent(e: DatepickerEventObject | JQueryEventObject) {
		this.scheduleForLater(() => {
			const { date } = e as DatepickerEventObject;
			this.ngModel = date != null ? this.formatDate(date) : null;

			if (this.onChange != null && isFunction(this.onChange)) {
				this.onChange(this.ngModel);
			}
		});
	}
}

export const dateInput = applyCoreDefinition({
	template: require('./template.pug'),
	controller: DateInputController,
});
