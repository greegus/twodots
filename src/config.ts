import { TileType, DotColors, ModifierType, type Theme, type Size } from '@/types.d'

export const config: {
  tileSize: number;
  gameboardSize: Size;
  dotColors: typeof DotColors;
  tileTypes: typeof TileType;
  modifierTypes: typeof ModifierType;
  defaultTheme: Theme
} = {
  tileSize: 54,

  gameboardSize: {
    width: 8,
    height: 8
  },

  dotColors: DotColors,

  tileTypes: TileType,

  modifierTypes: ModifierType,

  defaultTheme: {
    background: 'white',
    colorMap: {
      dots: {
        [DotColors.RED]: '#E53E3E',
        [DotColors.BLUE]: '#3182CE',
        [DotColors.GREEN]: '#48BB78',
        [DotColors.PINK]: '#97266D',
        [DotColors.YELLOW]: '#F6E05E',
        [DotColors.TEAL]: '#81E6D9'
      }
    }
  }
}