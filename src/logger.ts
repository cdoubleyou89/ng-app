import { ILogCall, ILogService } from 'angular';
import * as Noty from 'noty';
import { Callback, Indexed } from '@ledge/types';
import { app } from '..';

export class NgLogger {
	public log: ILogCall;
	private typeMap: Indexed<string> = {
		warning: 'warn',
		success: 'log',
		info: 'info',
		error: 'error',
	};

	constructor(private $log: ILogService) {
		this.log = this.$log.log;
	}

	public clear() {
		Noty.closeAll();
	}

	public confirm(action: Callback) {
		const n = new Noty({
			type: 'alert',
			theme: 'metroui',
			text: 'Do you want to continue?',
			buttons: [
				Noty.button('Yes', 'btn btn-success', (_: any) => {
					action();
					n.close();
				}),
				Noty.button('No', 'btn btn-danger', (_: any) => n.close()),
			],
		});

		n.show();
	}

	public error(msg: string, isTemporary = true) {
		this.showNotification(msg, 'error', isTemporary && null);
	}

	public info(msg: string, isTemporary = true) {
		this.showNotification(msg, 'info', isTemporary && null);
	}

	public success(msg: string, isTemporary = true) {
		this.showNotification(msg, 'success', isTemporary && null);
	}

	public warning(msg: string, isTemporary = true) {
		this.showNotification(msg, 'warning', isTemporary && null);
	}

	public devWarning(msg: string) {
		if (app.config.ENV !== 'production') {
			this.warning(`[DEV] ${msg}`, false);
		}
	}

	private showNotification(text: string, type: Noty.Type, timeout: false | number = 3000) {
		new Noty({ type, text, theme: 'metroui', progressBar: false, timeout, closeWith: ['click'] }).show();

		const logType = this.typeMap[type];
		(this.$log as ILogService & Indexed<Callback>)[logType](`${type}: ${text}`);
	}
}
