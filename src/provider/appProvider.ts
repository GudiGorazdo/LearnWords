import { dependencies, TDependency } from '../config/dependencies.config';
import { ServiceContainer, IServiceContainer } from './serviceContainer';

class AppProvider {
	private static instance: AppProvider;
	private container: IServiceContainer;

	constructor() {
		this.container = new ServiceContainer();
		this.init()
	}

	init() {
		dependencies.forEach((dependency: TDependency) => {
			this.container.register(dependency[0], dependency[1], dependency[2]);
		});
	}

	static getInstance() {
		if (!AppProvider.instance) {
			AppProvider.instance = new AppProvider();
		}
		return AppProvider.instance;
	}

  resolve<T>(name: string): T {
		return this.container.resolve(name);
  }
}

export default AppProvider;

// const app = AppProvider.getInstance();
//
// export default app;

