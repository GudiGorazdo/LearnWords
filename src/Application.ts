import AppProvider from './provider/appProvider';

export default class Application {
	private static instance: Application;
	private provider: AppProvider;

	private constructor() {
		this.provider = AppProvider.getInstance();
	}

	static getInstance(): Application {
		if (!Application.instance) {
			Application.instance = new Application();
		}
		return Application.instance;
	}

	resolve<T>(name: string): T {
		return this.provider.resolve(name);
	}
}


