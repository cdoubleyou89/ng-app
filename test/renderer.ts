import test from 'ava';
import { NgRenderer } from '../src/renderer';

const h = new NgRenderer(new (require('window'))().document);

test('renderer creates bare element', t => {
	const div = h.createElement('div');
	t.is(div.classList.length, 0);
	t.is(div.attributes.length, 0);
});

test('renderer creates element with classes', t => {
	const div = h.createElement('div', ['test1', 'test2']);
	t.is(div.classList.length, 2);
	t.true(div.classList.contains('test1'));
	t.true(div.classList.contains('test2'));

	t.is(div.attributes.length, 1); // includes "class" attribute
});

test('renderer creates element with attributes', t => {
	const div = h.createElement('div', [], [['test1', 'test1'], ['test2', 'test2']]);
	t.is(div.classList.length, 0);

	t.is(div.attributes.length, 2);
	t.is(div.getAttribute('test1'), 'test1');
	t.is(div.getAttribute('test2'), 'test2');
});

test('renderer creates element with classes and attributes', t => {
	const div = h.createElement('div', ['test1', 'test2'], [['test1', 'test1'], ['test2', 'test2']]);
	t.is(div.classList.length, 2);
	t.true(div.classList.contains('test1'));
	t.true(div.classList.contains('test2'));

	t.is(div.attributes.length, 3); // includes "class" attribute
	t.is(div.getAttribute('test1'), 'test1');
	t.is(div.getAttribute('test2'), 'test2');
});

test('renderer creates text input by default', t => {
	const input = h.createInput();
	t.is(input.classList.length, 1);
	t.true(input.classList.contains('form-control'));

	t.is(input.attributes.length, 8); // includes "class" attribute
	t.is(input.type, 'text');
	t.is(input.getAttribute('ng-attr-id'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(input.getAttribute('ng-attr-name'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(input.getAttribute('ng-model'), '$ctrl.ngModel');
	t.is(input.getAttribute('ng-model-options'), '$ctrl.ngModelOptions');
	t.is(input.getAttribute('maxlength'), '{{maxlength}}');
	t.is(input.getAttribute('placeholder'), '{{placeholder}}');
});

test('renderer creates radio and checkbox inputs', t => {
	const radio = h.createInput('radio');
	t.is(radio.classList.length, 1);
	t.true(radio.classList.contains('form-check-input'));

	t.is(radio.attributes.length, 5); // includes "class" attribute
	t.is(radio.type, 'radio');
	t.is(radio.getAttribute('ng-attr-name'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(radio.getAttribute('ng-model'), '$ctrl.ngModel');
	t.is(radio.getAttribute('ng-model-options'), '$ctrl.ngModelOptions');

	const checkbox = h.createInput('checkbox');
	t.is(checkbox.classList.length, 1);
	t.true(checkbox.classList.contains('form-check-input'));

	t.is(checkbox.attributes.length, 6); // includes "class" attribute
	t.is(checkbox.type, 'checkbox');
	t.is(checkbox.getAttribute('ng-attr-id'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(checkbox.getAttribute('ng-attr-name'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(checkbox.getAttribute('ng-model'), '$ctrl.ngModel');
	t.is(checkbox.getAttribute('ng-model-options'), '$ctrl.ngModelOptions');
});

test('renderer creates textarea', t => {
	const input = h.createTextArea();

	t.is(input.tagName.toLowerCase(), 'textarea');

	t.is(input.classList.length, 1);
	t.true(input.classList.contains('form-control'));

	t.is(input.attributes.length, 8); // includes "class" attribute
	t.is(input.type, 'textarea');
	t.is(input.getAttribute('ng-attr-id'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(input.getAttribute('ng-attr-name'), '{{id}}_{{$ctrl.uniqueId}}');
	t.is(input.getAttribute('ng-model'), '$ctrl.ngModel');
	t.is(input.getAttribute('ng-model-options'), '$ctrl.ngModelOptions');
	t.is(input.getAttribute('maxlength'), '{{maxlength}}');
	t.is(input.getAttribute('placeholder'), '{{placeholder}}');
});

test('renderer creates icon', t => {
	const icon = h.createIcon('test');
	t.is(icon.tagName.toLowerCase(), 'span');

	t.is(icon.classList.length, 2);
	t.true(icon.classList.contains('fa'));
	t.true(icon.classList.contains('fa-test'));

	t.is(icon.attributes.length, 2); // includes "class" attribute
	t.is(icon.getAttribute('aria-hidden'), 'true');
});

test('renderer creates fixed-width icon', t => {
	const icon = h.createIcon('test', true);
	t.is(icon.tagName.toLowerCase(), 'span');

	t.is(icon.classList.length, 3);
	t.true(icon.classList.contains('fa'));
	t.true(icon.classList.contains('fa-test'));
	t.true(icon.classList.contains('fa-fw'));

	t.is(icon.attributes.length, 2); // includes "class" attribute
	t.is(icon.getAttribute('aria-hidden'), 'true');
});

test('renderer creates label', t => {
	const label = h.createLabel(['test']);
	t.is(label.tagName.toLowerCase(), 'label');

	t.is(label.classList.length, 1);
	t.true(label.classList.contains('test'));

	t.is(label.attributes.length, 2); // includes "class" attribute
	t.is(label.getAttribute('ng-attr-for'), '{{id}}_{{$ctrl.uniqueId}}');
});

test('renderer creates slot', t => {
	const label = h.createSlot('test');
	t.is(label.tagName.toLowerCase(), 'div');

	t.is(label.classList.length, 0);
	t.is(label.attributes.length, 1);
	t.is(label.getAttribute('ng-transclude'), 'test');
});

test('renderer creates icon input', t => {
	const input = h.createInput();
	const iconInput = h.createIconInput(input, 'calendar');
	t.truthy(iconInput.querySelector('.fa-calendar'));
	t.true((iconInput.querySelector('input') as HTMLInputElement).isEqualNode(input));
});
