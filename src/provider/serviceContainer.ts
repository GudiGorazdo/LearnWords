export interface IServiceContainerOptions {
  singleton?: boolean;
}

export interface IServiceContainer {
	register<T>(name: string, dependency: T, options?: IServiceContainerOptions): void;
  resolve<T>(name: string): T;
}

export class ServiceContainer implements IServiceContainer {
  private dependencies: { [key: string]: any } = {};
  private singletons: { [key: string]: any } = {};

  register<T>(name: string, dependency: T, options?: IServiceContainerOptions): void {
    const { singleton = false } = options || {};

    if (singleton) {
      this.singletons[name] = dependency;
    } else {
      this.dependencies[name] = dependency;
    }
  }

  resolve<T>(name: string): T {
    if (this.singletons[name]) {
      return this.singletons[name];
    }

    if (this.dependencies[name]) {
      return this.dependencies[name];
    }

    throw new Error(`Dependency '${name}' is not registered.`);
  }
}


