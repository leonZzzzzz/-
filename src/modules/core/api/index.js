import position from './position'
import category from './category'
import tag from './tag'
import common from './common'
import base from './base'
import systemManager from './system-manager'
import service from './service'
import config from './config'
import memberLevel from './memberLevel'
import functionsPalette from './functions-palette'
import statistics from './statistics'

export default {
  ...common,
  ...position,
  ...category,
  ...tag,
  ...base,
  ...service,
  ...systemManager,
  ...config,
  ...memberLevel,
  ...functionsPalette,
  ...statistics
}
