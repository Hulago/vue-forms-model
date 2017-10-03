import * as Directives from './directives';

function plugin(Vue) {
  Vue.directive('fc', Directives.FormControlDirective);
}

if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(plugin);
}

export * from './models';
export * from './services';

export default plugin;
