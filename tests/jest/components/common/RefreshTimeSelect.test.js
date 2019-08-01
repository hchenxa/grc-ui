/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import RefreshTimeSelect from '../../../../src-web/components/common/RefreshTimeSelect'
import renderer from 'react-test-renderer'

describe('RefreshTimeSelect component', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <RefreshTimeSelect
        locale = {''}
        refreshValues = {[]}
        refreshControl = {{}}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})