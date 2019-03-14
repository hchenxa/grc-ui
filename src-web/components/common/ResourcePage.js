/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import ResourceDetails from './ResourceDetails'
import ResourceList from './ResourceList'
// import ResourceTopology from './ResourceTopology'
import { Route, Switch } from 'react-router-dom'
import getResourceDefinitions from '../../definitions'
import { makeGetVisibleTableItemsSelector } from '../../reducers/common'
import Page from './Page'

/* FIXME: Please fix disabled eslint rules when making changes to this file. */
/* eslint-disable react/prop-types, react/jsx-no-bind */
const WrappedResourceList = props =>
  <div>
    <ResourceList
      {...props}
      tabs={props.secondaryHeaderProps.tabs}
      title={props.secondaryHeaderProps.title}>
      {props.buttons}
    </ResourceList>
  </div>

const WrappedResourceDetails = props =>
  <ResourceDetails
    resourceType={props.resourceType}
    staticResourceData={props.staticResourceData}
    tabs={props.detailsTabs}
    routes={props.routes}>
    {props.modules}
  </ResourceDetails>

// const WrappedResourceTopology = props =>
//   <ResourceTopology
//     resourceType={props.resourceType}
//     staticResourceData={props.staticResourceData}>
//   </ResourceTopology>

const ResourcePageWithList = props =>
  <Switch>
    <Route exact path={props.match.url} render={() => (
      <WrappedResourceList {...props} />
    )} />
  </Switch>

const ResourcePageWithListAndDetails = props =>
  <Switch>
    <Route exact path={props.match.url} render={() => (
      <WrappedResourceList {...props} />
    )} />
    <Route path={`${props.match.url}/:namespace/:name?`} render={() => (
      <WrappedResourceDetails {...props} />
    )} />
  </Switch>

// const ResourcePageWithTopology = props =>
//   <Switch>
//     <Route exact path={props.match.url} render={() => (
//       <WrappedResourceTopology {...props} />
//     )} />
//   </Switch>

const typedResourcePageWithList = (resourceType, detailsTabs, buttons) => {

  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  return class ResourcePage extends React.PureComponent {

    constructor(props) {
      super(props)
    }

    render() {
      return (
        <Page>
          <ResourcePageWithList
            {...this.props}
            detailsTabs={detailsTabs}
            resourceType={resourceType}
            staticResourceData={staticResourceData}
            getVisibleResources={getVisibleResources}
            buttons={buttons}>
          </ResourcePageWithList>
        </Page>
      )
    }
  }
}

const typedResourcePageWithListAndDetails = (resourceType, detailsTabs, buttons, routes, modules) => {

  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  // eslint-disable-next-line react/display-name
  return class extends React.PureComponent {

    constructor(props) {
      super(props)
    }

    render() {
      return (
        <Page>
          <ResourcePageWithListAndDetails
            {...this.props}
            detailsTabs={detailsTabs}
            routes={routes}
            resourceType={resourceType}
            staticResourceData={staticResourceData}
            getVisibleResources={getVisibleResources}
            buttons={buttons}
            modules={modules}>
          </ResourcePageWithListAndDetails>
        </Page>
      )
    }
  }
}

// const typedResourcePageWithTopology = (resourceType) => {

//   const staticResourceData = getResourceDefinitions(resourceType)

//   const TypedResourcePageWithTopology = class extends React.PureComponent {

//     constructor(props) {
//       super(props)
//     }

//     render() {
//       return (
//         <ResourcePageWithTopology
//           {...this.props}
//           resourceType={resourceType}
//           staticResourceData={staticResourceData}>
//         </ResourcePageWithTopology>
//       )
//     }
//   }
//   TypedResourcePageWithTopology.displayName = 'TypedResourcePageWithTopology'
//   return TypedResourcePageWithTopology
// }

export { typedResourcePageWithList, typedResourcePageWithListAndDetails} //, typedResourcePageWithTopology }
