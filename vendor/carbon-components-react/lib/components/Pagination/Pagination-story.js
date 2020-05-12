"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _FeatureFlags = require("../../internal/FeatureFlags");

var _addonKnobs = require("@storybook/addon-knobs");

var _Pagination = _interopRequireDefault(require("../Pagination"));

var _PaginationV = _interopRequireDefault(require("../PaginationV2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var props = function props() {
  return {
    disabled: (0, _addonKnobs.boolean)('Disable backward/forward buttons (disabled)', false),
    page: (0, _addonKnobs.number)('The current page (page)', 1),
    totalItems: (0, _addonKnobs.number)('Total number of items (totalItems)', 103),
    pagesUnknown: (0, _addonKnobs.boolean)('Total number of items unknown (pagesUnknown)', false),
    pageInputDisabled: (0, _addonKnobs.boolean)('Disable page input (pageInputDisabled)', false),
    isLastPage: _FeatureFlags.componentsX ? null : (0, _addonKnobs.boolean)('At the last page (isLastPage)', false),
    backwardText: (0, _addonKnobs.text)('The description for the backward icon (backwardText)', 'Previous page'),
    forwardText: (0, _addonKnobs.text)('The description for the backward icon (forwardText)', 'Next page'),
    pageSize: (0, _addonKnobs.number)('Number of items per page (pageSize)', 10),
    pageSizes: (0, _addonKnobs.array)('Choices of `pageSize` (pageSizes)', [10, 20, 30, 40, 50]),
    itemsPerPageText: (0, _addonKnobs.text)('Label for `pageSizes` select UI (itemsPerPageText)', 'Items per page:'),
    onChange: (0, _addonActions.action)('onChange')
  };
};

var story = (0, _react2.storiesOf)('Pagination', module).addDecorator(_addonKnobs.withKnobs).addDecorator(function (story) {
  return _react.default.createElement("div", {
    style: {
      width: '800px'
    }
  }, story());
}).add('v2', function () {
  return _react.default.createElement(_PaginationV.default, props());
}, {
  info: {
    text: "\n            V2 version of the Pagination\n          "
  }
});

if (!_FeatureFlags.breakingChangesX) {
  story.add('v1', function () {
    return _react.default.createElement(_Pagination.default, props());
  }, {
    info: {
      text: "\n            The pagination component is used to paginate through items.\n          "
    }
  }).add('multipe pagination components', function () {
    return _react.default.createElement("div", null, _react.default.createElement(_Pagination.default, props()), _react.default.createElement(_Pagination.default, props()));
  }, {
    info: {
      text: "Showcasing unique ids for each pagination component"
    }
  });
}