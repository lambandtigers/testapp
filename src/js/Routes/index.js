import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../Components/App'
import Connect from '../Components/Connect'
import Sign from '../Components/Sign'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Connect} />
    <Route path='connect' component={Connect} />
    <Route path='sign' component={Sign} />
  </Route>
)
