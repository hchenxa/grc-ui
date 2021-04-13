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
import { getAge, getLabels } from '../../lib/client/resource-helper'
import { Link } from 'react-router-dom'
import StatusField from '../components/common/StatusField'
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
  policyTemplatesKeys: {
    title: 'policy.template.details',
    headerRows: ['description.title.name', 'description.title.last.transition', 'description.title.templateType'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'name',
          },
          {
            resourceKey: 'lastTransition',
            transformFunction: getAge
          },
          {
            resourceKey: 'templateType',
          }
        ]
      }
    ]
  },
  policyRules: {
    title: 'table.header.rules',
    resourceKey: 'rules',
    defaultSortField: 'ruleUID',
    normalizedKey: 'ruleUID',
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'ruleUID',
        key: 'ruleUID',
      },
      {
        msgKey: 'table.header.templateType',
        resourceKey: 'templateType',
        key: 'templateType',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'table.header.apiGroups',
        resourceKey: 'apiGroups',
        key: 'apiGroups',
        transformFunction: getAPIGroups
      },
      {
        msgKey: 'table.header.ruleVerbs',
        resourceKey: 'verbs',
        key: 'verbs',
        transformFunction: getRuleVerbs
      },
      {
        msgKey: 'table.header.resources',
        resourceKey: 'resources',
        key: 'resources',
      },
    ],
  },
  policyViolations: {
    resourceKey: 'violations',
    title: 'table.header.violation.detail',
    defaultSortField: 'name',
    normalizedKey: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.cluster',
        resourceKey: 'cluster',
        key: 'cluster',
        transformFunction: formLinkToCluster,
      },
      {
        msgKey: 'table.header.message',
        resourceKey: 'message',
        key: 'message',
        transformFunction: formMessageLink,
      },
      {
        msgKey: 'table.header.timestamp',
        resourceKey: 'timestamp',
        key: 'timestamp',
        transformFunction: getAge,
      },
    ],
  },
  policyInfoKeys: {
    title: 'policy.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
            type: 'i18n'
          },
          {
            resourceKey: 'name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.message',
            type: 'i18n'
          },
          {
            resourceKey: 'message'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.status',
            type: 'i18n'
          },
          {
            resourceKey: 'status'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.remediation',
            type: 'i18n'
          },
          {
            resourceKey: 'remediation'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.exclude_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'detail.exclude_namespace',
            transformFunction: getExcludeNamespace
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.include_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'detail.include_namespace',
            transformFunction: getIncludeNamespace
          }
        ]
      },
    ]
  },
  policyDetailKeys: {
    title: 'policy.details',
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
            resourceKey: 'table.header.cluster',
            type: 'i18n'
          },
          {
            resourceKey: 'cluster'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.message',
            type: 'i18n'
          },
          {
            resourceKey: 'status.details',
            transformFunction: getAggregatedMessage,
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.status',
            type: 'i18n'
          },
          {
            resourceKey: 'status.compliant'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.remediation',
            type: 'i18n'
          },
          {
            resourceKey: 'remediation'
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
export function getDecisionList(policy = {}) {
  // Gather full cluster list from placementPolicy status
  const fullClusterList = _.get(policy, 'placementPolicies[0].status.decisions', []).map(decision => decision.clusterNamespace)
  // Gather status list from policy status
  const rawStatusList = _.get(policy, 'raw.status.status', [])
  // Build lists of clusters, organized by status keys
  const clusterList = {}
  _.forEach(fullClusterList, (cluster) => {
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
    _.remove(fullClusterList, (cluster) => cluster === clusterNamespace)
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
  // Push lists of clusters along with status icon and heading
  const statusList = []
  for (const status of Object.keys(clusterList)) {
    statusList.push(<div className={`${status}-status-list`}>
      <StatusField status={status} text='' />
      <span className='status-heading'>{msgs.get(`table.cell.${status}`, context.locale)}: </span>
      {Array.from(clusterList[status]).map((cluster, i) =>
        <span key={`${cluster}-link`}>
          <Link key={`${cluster}-link`} to={`${config.contextPath}/all/${policy.metadata.namespace}/${policy.metadata.name}/status?${cluster}`} >
            {cluster}
          </Link>
          {i < clusterList[status].length && ', '}
        </span>)
      }
    </div>)
  }
  // If there are no clusters, return a hyphen
  if (statusList.length === 0) {
    return '-'
  }
  return statusList
}

export function formLinkToCluster(item){
  if(item && item.cluster && item.consoleURL){
    return <a target='_blank' rel='noopener noreferrer' href={`${item.consoleURL}`}>{item.cluster}</a>
  }
  else if (item && item.cluster) {
    return item.cluster
  }
  return '-'
}

export function formMessageLink(item, locale){
  if(item && item.message){
    if (item.policyNamespace) {
      return <div>
        {`${item.message} `}
        <Link to={`${config.contextPath}/all/${item.policyNamespace}/${item.policyName}/template/${item.cluster}/${item.apiVersion}/${item.kind}/${item.name}`}>
          {msgs.get('table.actions.view.details', locale)}
        </Link>
      </div>
    }
    return <div>
      {item.message}
    </div>

  }
  return '-'
}

export function getAggregatedMessage(item) {
  const details = _.get(item, 'status.details', [])
  let message = ''
  details.forEach((detail) => {
    const policyName = _.get(detail, 'templateMeta.name','-')
    if(_.get(detail, 'compliant') === 'Compliant') {
      message += `${policyName}: Compliant, `
    } else {
      const policyMessage = _.get(detail, 'history[0].message','-')
      message += `${policyName}: ${policyMessage} `
    }
  })
  return message
}

export function getAPIGroups(item) {
  const apiGroups = _.get(item, 'apiGroups')
  if (apiGroups) {
    return apiGroups.join(', ')
  }
  return '-'
}

export function getRuleVerbs(item) {
  const verbs = _.get(item, 'verbs')
  if (verbs) {
    return verbs.join(', ')
  }
  return '-'
}

export function getExcludeNamespace(item) {
  const namespace = _.get(item, 'detail.exclude_namespace')
  if (namespace) {
    return namespace.join(', ')
  }
  return '-'
}

export function getIncludeNamespace(item) {
  const namespace = _.get(item, 'detail.include_namespace')
  if (namespace) {
    return namespace.join(', ')
  }
  return '-'
}
