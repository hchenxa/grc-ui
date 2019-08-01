/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSecondaryHeader } from '../actions/common'
import { POLICY_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { getPollInterval } from '../components/common/RefreshTimeSelect'
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'
import {  Loading } from 'carbon-components-react'
import lodash from 'lodash'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { HCMPolicyViolations } from '../../lib/client/queries'
// import { getTabs } from '../../lib/client/resource-helper'
import NoResource from '../components/common/NoResource'

resources(() => {
  require('../../scss/policy-violation-tab.scss')
})

class PolicyViolationTab extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    const url = lodash.get(this.props, 'match.url')
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 2]
    const {staticResourceData} = this.props
    const pollInterval = getPollInterval(POLICY_REFRESH_INTERVAL_COOKIE)

    return (
      <Query query={HCMPolicyViolations} pollInterval={pollInterval} variables={{policyName: policyName}}>
        {({ data, loading }) => {
          if (loading && data.violations === undefined) {
            return (<Loading withOverlay={false} className='content-spinner' />)
          }
          if( data.violations && data.violations.length > 0){
            return (<div className='policy-violation-tab'>
              <h5 className='section-title'>Violations</h5>
              <ResourceTableModule definitionsKey='policyViolations' staticResourceData={staticResourceData} resourceData={data} showModuleHeader={false} showSearch={false} showPagination={false} />
            </div>)
          }
          else {
            return <NoResource title={msgs.get('table.title.no.violation', this.context.locale)} />
          }
        }}
      </Query>
    )
  }
}

PolicyViolationTab.contextTypes = {
  locale: PropTypes.string
}

PolicyViolationTab.propTypes = {
  staticResourceData: PropTypes.object,

}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicyViolationTab))