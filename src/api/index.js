import core from '@/modules/core/api'
import activity from '@/modules/activity/api'
import app from '@/modules/app/api'
import shopping from '@/modules/shopping/api'
import sms from '@/modules/sms/api'
import flywheel from '@/modules/flywheel/api'
import lesson from '@/modules/lesson/api'
import channel from '@/modules/channel/api'
import salesman from '@/modules/salesman/api'
import setting from '@/modules/setting/api'
import store from '@/modules/store/api'
import scrm from '@/modules/scrm/api'

export default {
  ...core,
  ...shopping,
  ...activity,
  ...flywheel,
  ...app,
  ...sms,
  ...lesson,
  ...channel,
  ...salesman,
  ...setting,
  ...store,
  ...scrm
}
