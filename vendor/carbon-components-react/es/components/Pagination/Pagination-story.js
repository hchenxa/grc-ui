/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { breakingChangesX } from '../../internal/FeatureFlags';
import { withKnobs, array, boolean, number, text } from '@storybook/addon-knobs';
import Pagination from '../Pagination';
import PaginationV2 from '../PaginationV2';
import { componentsX } from '../../internal/FeatureFlags';

var props = function props() {
  return {
    disabled: boolean('Disable backward/forward buttons (disabled)', false),
    page: number('The current page (page)', 1),
    totalItems: number('Total number of items (totalItems)', 103),
    pagesUnknown: boolean('Total number of items unknown (pagesUnknown)', false),
    pageInputDisabled: boolean('Disable page input (pageInputDisabled)', false),
    isLastPage: componentsX ? null : boolean('At the last page (isLastPage)', false),
    backwardText: text('The description for the backward icon (backwardText)', 'Previous page'),
    forwardText: text('The description for the backward icon (forwardText)', 'Next page'),
    pageSize: number('Number of items per page (pageSize)', 10),
    pageSizes: array('Choices of `pageSize` (pageSizes)', [10, 20, 30, 40, 50]),
    itemsPerPageText: text('Label for `pageSizes` select UI (itemsPerPageText)', 'Items per page:'),
    onChange: action('onChange')
  };
};

var story = storiesOf('Pagination', module).addDecorator(withKnobs).addDecorator(function (story) {
  return React.createElement("div", {
    style: {
      width: '800px'
    }
  }, story());
}).add('v2', function () {
  return React.createElement(PaginationV2, props());
}, {
  info: {
    text: "\n            V2 version of the Pagination\n          "
  }
});

if (!breakingChangesX) {
  story.add('v1', function () {
    return React.createElement(Pagination, props());
  }, {
    info: {
      text: "\n            The pagination component is used to paginate through items.\n          "
    }
  }).add('multipe pagination components', function () {
    return React.createElement("div", null, React.createElement(Pagination, props()), React.createElement(Pagination, props()));
  }, {
    info: {
      text: "Showcasing unique ids for each pagination component"
    }
  });
}