import 'element-closest';
import * as Choices from 'choices.js';
import { IAttributes } from 'angular';
import { NgController } from '../../controller';
import { InputComponentOptions } from '../../..';

class SelectController extends NgController {
	public static Placeholder = '----Select One----';
	public static IsMultiple($attrs: IAttributes) {
		return $attrs.hasOwnProperty('multiple') || $attrs.type === 'multiple';
	}

	public list: any[];
	public choices: Choices;
	private isMultiple: boolean;

	public $postLink() {
		const $el = (this.$element as any)[0] as HTMLElement;
		const $select = $el.querySelector('select');

		this.makeSelectList($select, this.list);

		this.$scope.$watch(
			_ => this.list,
			_ => this.makeSelectList($select, this.list),
			true,
		);
	}

	public makeSelectList(el: HTMLElement, list: any[]) {
		if (this.choices != null) {
			this.choices.destroy();
		}

		this.choices = new Choices(el, {
			removeItemButton: true,
			itemSelectText: '',
			placeholderValue: SelectController.IsMultiple(this.$attrs)
				? this.$attrs.placeholder || SelectController.Placeholder
				: '',
		});

		this.choices.passedElement.addEventListener('change', this.changeEvent.bind(this));

		if (Array.isArray(list)) {
			const value = this.$attrs.value || 'Value';
			const text = this.$attrs.text || 'Text';

			this.choices.setChoices(list, value, text);

			if (list.includes(this.ngModel) || list.find(x => x[value] === this.ngModel) != null) {
				this.choices.setValueByChoice(this.ngModel);
			}
		}
	}

	public changeEvent(event: any) {
		const { value } = event.detail;
		if (this.ngModel != null && this.isMultiple ? this.ngModel.includes(value) : this.ngModel === value) {
			return;
		}
		this.ngModel = this.isMultiple ? [value].concat(this.ngModel || []) : value;
		this.$timeout();
	}
}

export const selectList: InputComponentOptions = {
	type: 'input',
	render(h) {
		const input = h.createElement('select');

		// tslint:disable-next-line:no-invalid-this
		if (SelectController.IsMultiple(this.$attrs)) {
			input.setAttribute('multiple', 'true');
		} else {
			const placeholder = h.createElement('option', [], [['placeholder', 'true']]);
			placeholder.innerText = SelectController.Placeholder;
			input.appendChild(placeholder);
		}

		return input;
	},
	ctrl: SelectController,
	bindings: {
		list: '<',
	},
};
