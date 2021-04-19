/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import msgs from '../../nls/platform.properties'
import { Chip } from '@patternfly/react-core'
import _uniqueId from 'lodash/uniqueId'

/*
* UI helpers to help with data transformations
* */

export function getLabels(item) {
  const labels = _.get(item, 'placementPolicies[0].clusterLabels')
  if (!labels || Object.keys(labels).length===0) {
    return '-'
  }
  return _.map(labels, (value, key) => {
      return <p key={key}>{`${key}=${JSON.stringify(labels[key])}`}</p>
    })
}

export const transform = (resource, key, locale, isSearch) => {
  let value = _.get(resource, key.resourceKey)
  if (key.type === 'timestamp') {
    return moment.unix(value).format('MMM Do YYYY \\at h:mm A')
  } else if (key.type === 'i18n') {
    return msgs.get(key.resourceKey, locale)
  } else if (key.type === 'boolean') {
    value = (Boolean(value)).toString()
    return msgs.get(value, locale)
  } else if (key.transformFunction && typeof key.transformFunction === 'function') {
    return key.transformFunction(resource, locale, key.resourceKey, isSearch)
  } else if (key.type === 'tag') {
    const data = key.getData(resource)
    return data ?
      data.map(tagText =>
      <Chip
      key={_uniqueId('tag')}
      isReadOnly={true}
      title={tagText.title}>
        {tagText.value ? `${tagText.name}:${tagText.value}` : tagText.name}
      </Chip>
      )
      : '-'
  } else {
    return (value || value === 0) ? value : '-'
  }
}

