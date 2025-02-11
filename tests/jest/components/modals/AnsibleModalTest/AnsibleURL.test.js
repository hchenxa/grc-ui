/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import { renderAnsibleURL } from '../../../../../src-web/components/modals/AnsibleAutomationModal/AnsibleURL'

describe('render AnsibleURL component', () => {
  it('AnsibleURL link renders as empty text', () => {
    const component = renderAnsibleURL('testAnsibleURL', '', '/multicloud/credentials', 3)
    expect(component).toMatchSnapshot()
  })

  it('AnsibleURL link renders as "-" text', () => {
    const component = renderAnsibleURL('testAnsibleURL', '-', '/multicloud/credentials', 3)
    expect(component).toMatchSnapshot()
  })

  it('AnsibleURL link renders as normal text with truncate', () => {
    const component = renderAnsibleURL('testAnsibleURL', 'This is an ansible url', '/multicloud/credentials', 3)
    expect(component).toMatchSnapshot()
  })

  it('AnsibleURL link renders as normal text without truncate', () => {
    const component = renderAnsibleURL('testAnsibleURL', 'This is an ansible url',  '/multicloud/credentials')
    expect(component).toMatchSnapshot()
  })
})
