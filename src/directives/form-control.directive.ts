import { DirectiveOptions, VNode } from 'vue';
import {get} from 'lodash';
import { FormControl } from '../models';

export default (() => {
  const focusHandler = (fc: FormControl) => {
    fc.$focus = true;
    if (!fc.$touch) {
      fc.$touch = true;
    }

    fc.notifyParent();
  };

  const blurHandler = (fc: FormControl) => {
    fc.$focus = false;

    if (!fc.$touch) {
      fc.$touch = true;
    }

    fc.validate();
    fc.notifyParent();
  };

  const inputHandler = (fc: FormControl, event: any) => {
    fc.value = get(event, 'target.value', event);

    fc.validateDebounce();

    if (!fc.$dirty) {
      fc.$dirty = true;
    }

    fc.notifyParent();
  };

  return {
    priority: 3000,
    // When the bound element is inserted into the DOM...
    bind: function(el, binding, vnode: VNode) {
      let event = get(vnode, 'componentOptions.Ctor.options.model.event', 'input');

      el.data = {
        inputFn: inputHandler.bind(this, binding.value),
        focusFn: focusHandler.bind(this, binding.value),
        blurFn: blurHandler.bind(this, binding.value),
      };

      if (vnode.componentInstance) {
        vnode.componentInstance.$on(event, el.data.inputFn);
        vnode.componentInstance.$on('activate', el.data.focusFn);
        vnode.componentInstance.$on('focus', el.data.focusFn);
        vnode.componentInstance.$on('blur', el.data.blurFn);
        vnode.componentInstance.$on('deactivate', el.data.blurFn);
      } else {
        el.addEventListener(event, el.data.inputFn);
        el.addEventListener('focus', el.data.focusFn);
        el.addEventListener('blur', el.data.blurFn);
      }
    },

    unbind: function(el, binding, vnode) {
      let event = get(vnode, 'componentOptions.Ctor.options.model.event', 'input');

      if (vnode.componentInstance) {
        vnode.componentInstance.$off(event, el.data.inputFn);
        vnode.componentInstance.$off('focus', el.data.focusFn);
        vnode.componentInstance.$off('blur', el.data.blurFn);
        vnode.componentInstance.$off('activate', el.data.focusFn);
        vnode.componentInstance.$off('deactivate', el.data.blurFn);
        
      } else {
        el.removeEventListener(event, el.data.inputFn);
        el.removeEventListener('focus', el.data.focusFn);
        el.removeEventListener('blur', el.data.blurFn);
      }
    },

    componentUpdated: function(el, binding, vnode: VNode) {
      let event = get(vnode, 'componentOptions.Ctor.options.model.event', 'input');
      let prop = get(vnode, 'componentOptions.Ctor.options.model.prop', 'value');

      el.data = {
        inputFn: inputHandler.bind(this, binding.value),
        focusFn: focusHandler.bind(this, binding.value),
        blurFn: blurHandler.bind(this, binding.value),
      };

      if (vnode.componentInstance) {
        vnode.componentInstance.$on(event, el.data.inputFn);
        vnode.componentInstance.$on('focus', el.data.focusFn);
        vnode.componentInstance.$on('blur', el.data.blurFn);
      } else {
        el.addEventListener(event, el.data.inputFn);
        el.addEventListener('focus', el.data.focusFn);
        el.addEventListener('blur', el.data.blurFn);
      }

      // vnode.componentInstance[prop] = binding.value.value
    },

    // inserted: function(el, binding, vnode) {
    //   console.log('Inserted', el, vnode);
    // },
  };
})();
