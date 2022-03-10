import app from '@utils/app'
import router from './router/index'
import store from './store/index'
import * as getApi from '@apis/http'
import util from '@utils/util'
import common from '@assets/js/common'
import '@plugins/elements'

import '@assets/css/global.css'
import '@assets/less/reset.less'

app.config.globalProperties['$http'] = getApi
app.config.globalProperties['$utils'] = util
app.config.globalProperties['$COMMON'] = common

app.use(router).use(store).mount('#app')
