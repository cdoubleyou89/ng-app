import * as inputs from './src/input';
import { NgApp } from './src/app';

export const app = new NgApp().registerComponents(inputs);

export function wrapCtrl(controller: new() => any) {
	return app._wrapComponentController(controller);
}

export { NgApp };
export { NgService } from './src/service';
export { NgComponentController, NgController } from './src/controller';
export { NgDataService } from './src/http';
export { NgLogger } from './src/logger';
export { NgModalService } from './src/modal';
export { NgRenderer } from './src/renderer';
export { StateServiceWithMeta } from './src/interfaces';
