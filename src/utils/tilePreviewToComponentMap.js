import config from 'config'

import DotTile from 'components/canvas/tiles/previews/DotTile'
import AnchorTile from 'components/canvas/tiles/previews/AnchorTile'

export default {
  [config.tileTypes.DOT]: DotTile,
  [config.tileTypes.ANCHOR]: AnchorTile
}
