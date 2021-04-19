/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { PolicyDetailsOverview } from '../../../../src-web/components/modules/PolicyDetailsOverview'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GrcApolloClient from '../../../../lib/client/apollo-client'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import {
  staticResourceDataPolicyOverview,
  itemPolicyOverview_extra
} from '../common/CommonTestingData'

describe('PolicyDetailsOverview component', () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const middleware = [thunkMiddleware]
  const store = createStore(combineReducers(reducers), composeEnhancers(
    applyMiddleware(...middleware)
  ))
  const location = {
    'pathname': '/multicloud/policies/all/default/case6-test-policy',
    'search': '',
    'hash': '',
    'key': 'q1uagn'
  }
  const resourceType = {
    'name': 'HCMCompliance',
    'query': 'POLICIES_BY_POLICY'
  }
  const refreshControl = {
    'reloading': false,
    'refreshCookie': 'grc-refresh-interval-cookie',
    'timestamp': 'Tue Sep 24 2019 09:56:26 GMT-0400 (Eastern Daylight Time)'
  }
  it('renders as normal', () => {
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsOverview
              items={[itemPolicyOverview_extra]}
              updateResourceToolbar={jest.fn()}
              staticResourceData={staticResourceDataPolicyOverview}
              location={location}
              resourceType={resourceType}
              refreshControl={refreshControl}
              error={null}
              loading={false}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('renders no resource', () => {
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsOverview
              items={[]}
              updateResourceToolbar={jest.fn()}
              staticResourceData={staticResourceDataPolicyOverview}
              location={location}
              resourceType={resourceType}
              refreshControl={refreshControl}
              error={null}
              loading={false}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('logs an error with more than one policy', () => {
    console.error = jest.fn()
    renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsOverview
              items={[{}, {}]}
              updateResourceToolbar={jest.fn()}
              staticResourceData={staticResourceDataPolicyOverview}
              location={location}
              resourceType={resourceType}
              refreshControl={refreshControl}
              error={null}
              loading={false}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(console.error.mock.calls.length).toEqual(1)
    expect(console.error.mock.calls[0][0]).toMatchSnapshot()
  })
})
