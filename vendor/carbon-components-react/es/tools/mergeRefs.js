/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @param {...Ref<Element>} refs List of React refs to merge.
 * @returns {Ref<Element>} Merged React ref.
 */
var mergeRefs = function mergeRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (el) {
    refs.forEach(function (ref) {
      // https://github.com/facebook/react/issues/13029#issuecomment-410002316
      if (typeof ref === 'function') {
        ref(el);
      } else if (Object(ref) === ref) {
        ref.current = el;
      }
    });
  };
};

export default mergeRefs;