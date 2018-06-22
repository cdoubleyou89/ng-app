import test from 'ava';
import { $compCtrl, $ctrl, $prefix } from './mocks';

test('$ctrl.getApiPrefix', t => {
	t.is($ctrl.getApiPrefix(), $prefix);
});

test('$ctrl.splitByCapitalLetter', t => {
	t.is($ctrl.splitByCapitalLetter('splitByCapitalLetter'), 'Split By Capital Letter');
	t.is($ctrl.splitByCapitalLetter('splitBy CapitalLetter'), 'Split By Capital Letter');
	t.is($ctrl.splitByCapitalLetter('splitBy capitalLetter'), 'Split By capital Letter');
});

test('$compCtrl.uniqueId', t => {
	t.is(typeof $compCtrl.uniqueId, 'string');
	t.false($compCtrl.uniqueId.includes('-'));
	t.false($compCtrl.uniqueId.includes(','));
});
