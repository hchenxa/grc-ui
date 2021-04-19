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
import _ from 'lodash'
import msgs from '../../nls/platform.properties'
import { getLabels } from '../../lib/client/resource-helper'
import { Link } from 'react-router-dom'
import StatusField from '../components/common/StatusField'
import { Label, LabelGroup } from '@patternfly/react-core'
import config from '../../lib/shared/config'
import { wrappable, sortable, breakWord } from '@patternfly/react-table'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  compliancePolicies: {
    resourceKey: 'compliancePolicies',
    title: 'table.header.compliance.policies',
    defaultSortField: 'name',
    normalizedKey: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'policyCompliantStatus',
        key: 'policyCompliantStatus',
        transformFunction: getCompliancePolicyStatus,
      },
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
        transformFunction: createPolicyLink,
      },
      {
        msgKey: 'table.header.cluster.compliant',
        resourceKey: 'clusterCompliant',
        key: 'clusterCompliant',
        transformFunction: createCompliancePolicyLink,
      },
      {
        msgKey: 'table.header.cluster.not.compliant',
        resourceKey: 'clusterNotCompliant',
        key: 'clusterNotCompliant',
        transformFunction: createCompliancePolicyLink,
      },
    ],
  },
  placementClusterKeys: {
    tableKeys: [
      {
        key: 'clusterSelector',
        resourceKey: 'placementPolicies',
        transforms: [wrappable, sortable],
        cellTransforms: [breakWord],
        msgKey: 'table.header.cluster.selector',
        transformFunction: getLabels,
      },
      {
        key: 'cluster',
        resourceKey: 'clusters',
        transforms: [wrappable, sortable],
        cellTransforms: [breakWord],
        msgKey: 'table.header.clusters',
        transformFunction: getDecisionCount,
      },
      {
        key: 'decisions',
        resourceKey: 'status',
        transforms: [wrappable],
        cellTransforms: [breakWord],
        msgKey: 'table.header.status',
        transformFunction: getDecisionList,
      },
    ],
  },
  tableKeys: [
    {
      msgKey: 'table.header.policy.name',
      resourceKey: 'metadata.name',
      transformFunction: createComplianceLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'metadata.namespace',
    },
    {
      msgKey: 'table.header.remediation',
      resourceKey: 'remediation',
    },
    {
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
    },
    {
      msgKey: 'table.header.controls',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
      transformFunction: getControls,
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
      transformFunction: getStandards,
    },
    {
      msgKey: 'table.header.categories',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
      transformFunction: getCategories
    },
  ],
  tableActions: [
    'table.actions.edit',
    'table.actions.remove',
  ],
  detailKeys: {
    title: 'compliance.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.namespace'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.remediation',
            information: 'grc.remediation.tooltip',
            type: 'i18n'
          },
          {
            resourceKey: 'raw.spec.remediationAction'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.disabled',
            type: 'i18n'
          },
          {
            resourceKey: 'raw.spec.disabled'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.cluster.violation',
            type: 'i18n'
          },
          {
            resourceKey: 'clusterCompliant'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.categories',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.controls',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.standards',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.created',
            type: 'timestamp'
          },
          {
            resourceKey: 'metadata.creationTimestamp'
          }
        ]
      },
    ]
  },
  policyPolicyTemplates: {
    title: 'table.header.policyTemplates',
    defaultSortField: 'name',
    normalizedKey: 'name',
    resourceKey: 'policyTemplates',
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'description.title.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.kind',
        resourceKey: 'kind',
        key: 'kind',
      },
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'compliant',
        key: 'compliant',
        transformFunction: getStatus
      },
    ],
  },
}

export function createComplianceLink(item = {}, ...param){
  if (param[2]) {
    return item.metadata.name
  } else {
    if (item.raw.kind === 'Compliance') {
      return <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name} (Deprecated)</Link>
    }
    else {
      return <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name}</Link>
    }
  }
}

export function getStatus(item, locale) {
  const status = _.get(item, 'status', '-')
  if (status.compliant){
    return <StatusField status={status.compliant.toLowerCase()} text={msgs.get(`policy.status.${status.compliant.toLowerCase()}`, locale)} />
  } else if (status && typeof(status)==='string' && status !== '-'){
    return <StatusField status={status.toLowerCase()} text={msgs.get(`policy.status.${status.toLowerCase()}`, locale)} />
  }
  return '-'
}

export function getCompliancePolicyStatus(item, locale) {
  if (item.clusterNotCompliant && item.clusterNotCompliant.length > 0){
    return <StatusField status='noncompliant' text={msgs.get('policy.status.noncompliant', locale)} />
  }
  return <StatusField status='compliant' text={msgs.get('policy.status.compliant', locale)} />
}

export function createCompliancePolicyLink(item = {}, ...param){
  const policyKeys = item[param[1]]
  const policyArray = []
  policyKeys && policyKeys.forEach(policyKey => {
    const targetPolicy = item.policies.find(policy => item.name === policy.name && policyKey === policy.cluster)
    policyArray.push(targetPolicy)
  })

  return policyArray.length > 0 ?
    <ul>{policyArray.map(policy => (<li key={`${policy.cluster}-${policy.name}`}>
      <Link
        to={`${config.contextPath}/all/${encodeURIComponent(policy.complianceNamespace)}/${encodeURIComponent(policy.complianceName)}/compliancePolicy/${encodeURIComponent(policy.name)}/${policy.cluster}`}>
        {policy.cluster}
      </Link>
    </li>))}</ul>
    :
    '-'
}

export function createPolicyLink(item = {}){
  return  <Link
    to={`${config.contextPath}/all/${encodeURIComponent(item.complianceNamespace)}/${encodeURIComponent(item.complianceName)}/compliancePolicy/${encodeURIComponent(item.name)}`}>
    {item.name}
  </Link>
}

export function getStatusCount(item) {
  return `${item.policyCompliant}/${item.policyTotal}`
}

export function getClusterCount(item) {
  return `${item.clusterCompliant}/${item.clusterTotal}`
}

export function getSubjects(item) {
  if(item && item.subjects){
    return item.subjects.map(subject => `${subject.name}(${subject.apiGroup})`).join(', ')
  }
  else{
    return '-'
  }
}

export function getControls(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return formatAnnotationString(annotations['policy.open-cluster-management.io/controls'])
}

export function getStandards(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return formatAnnotationString(annotations['policy.open-cluster-management.io/standards'])
}

export function getCategories(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return formatAnnotationString(annotations['policy.open-cluster-management.io/categories'])
}

export function formatAnnotationString(items){
  if (items) {
    return items.split(',').map(item => item.trim()).join(', ')
  }
  return '-'
}

// Return a count of total clusters from the placementPolicy
export function getDecisionCount(item = {}){
  const decisions = _.get(item, 'placementPolicies[0].status.decisions') || _.get(item, 'status.decisions')
  if (decisions) {
    return decisions.map(decision => decision.clusterName).length
  }
  return 0
}

// Construct a list of compliant clusters and return a formatted list with icons and headings
export function getDecisionList(policy, locale) {
  // Gather full cluster list from placementPolicy status
  const fullClusterList = _.get(policy, 'placementPolicies[0].status.decisions', [])
  // Gather status list from policy status
  const rawStatusList = _.get(policy, 'raw.status.status', [])
  // Build lists of clusters, organized by status keys
  const clusterList = {}
  _.forEach(fullClusterList, (clusterObj) => {
    const cluster = clusterObj.clusterNamespace
    const statusObject = _.filter(rawStatusList, (status) => status.clusternamespace === cluster)
    // Log error if more than one status is returned since each cluster name should be unique
    if (statusObject.length > 1) {
      console.error(`Expected one cluster but got ${statusObject.length}:`, statusObject)
    // Push a new cluster object if there is no status found
    } else if (statusObject.length === 0) {
      statusObject.push({clusternamespace: cluster})
    }
    const compliant = _.get(statusObject[0], 'compliant', 'nostatus').toLowerCase()
    const clusterNamespace = _.get(statusObject[0], 'clusternamespace')
    // Add cluster to its associated status list in the clusterList object
    if (Object.prototype.hasOwnProperty.call(clusterList, compliant)) {
      // Each cluster name should be unique, so if one is already present, log an error
      if (clusterList[compliant].has(clusterNamespace)) {
        console.error(`Unexpected duplicate cluster in '${compliant}' cluster list: ${clusterNamespace}`)
      } else {
        clusterList[compliant].add(clusterNamespace)
      }
    } else {
      clusterList[compliant] = new Set([clusterNamespace])
    }
  })
  // Push lists of clusters along with status icon, heading, and overflow badge
  const statusList = []
  for (const status of Object.keys(clusterList)) {
    statusList.push(
      <div key={`${status}-status-container`} className='status-container'>
        <div key={`${status}-status-heading`} className='status-heading'>
          <StatusField status={status} text='' />
          <span>{msgs.get(`table.cell.${status}`, locale)}: </span>
        </div>
        <div key={`${status}-status-list`} className='status-list'>
          <LabelGroup
            collapsedText='+${remaining}'
            numLabels='5'
          >
            {Array.from(clusterList[status]).map((cluster) =>{
                // If there's no status, there's no point in linking to the status page
                let href='', color='grey'
                if (status !== 'nostatus') {
                  href=`${config.contextPath}/all/${policy.metadata.namespace}/${policy.metadata.name}/status?clusterFilter=${cluster}&index=0`
                  color='blue'
                }
                // Return links to status page, filtered by selected cluster
                return (<span key={`${cluster}-link`}>
                  <Label
                    key={`${cluster}-link`}
                    color={color}
                    variant='outline'
                    render={({
                        className,
                        content,
                        componentRef
                      })=>
                        <Link to={href} className={className} innerRef={componentRef}>
                        {content}
                      </Link>
                    }
                  >
                    {cluster}
                  </Label>
                </span>)
              })
            }
          </LabelGroup>
        </div>
      </div>
    )
  }
  // If there are no clusters, return a hyphen
  if (statusList.length === 0) {
    return '-'
  }
  return statusList
}
