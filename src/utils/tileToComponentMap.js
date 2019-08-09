import config from 'config'

import DotTile from 'components/canvas/tiles/DotTile'
import WallTile from 'components/canvas/tiles/WallTile'
import BombTile from 'components/canvas/tiles/BombTile'
import AnchorTile from 'components/canvas/tiles/AnchorTile'

export default {
  [config.tileTypes.DOT]: DotTile,
  [config.tileTypes.WALL]: WallTile,
  [config.tileTypes.BOMB]: BombTile,
  [config.tileTypes.ANCHOR]: AnchorTile
}
