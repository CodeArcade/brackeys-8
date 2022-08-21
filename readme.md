# Brackeys 8 - Fish Game

This is a game about rivers and fish.

## Tiles

### Empty tile

- Can be placed upon
- has random small decorations on it (e.g. flowers, ferns, pebbles)

### Blocked Tile

- Cannot be placed upon
- has a random big decoration on it (e.g. tree, big rock, moai head)

### Start Tile

- Cannot be placed upon
- is a pond
- attaches to river tiles

### End Tile

- Cannot be placed upon
- is a pond
- attaches to river tiles

### Straight River Tile

- Can be placed
- Attaches to other rivers, start and end tiles

### Bendy River Tile

- Can be placed
- Attaches to other rivers, start and end tiles

### T-Cross River Tile

- can be placed
- Attaches to other rivers, start and end tiles

### Dead End River Tile

- can't be placed
- Occurs when tiny pond (e.g. from factory) gets connected to river tile

### 4-Way Cross River Tile

- can be placed
- Attaches to other rivers, start and end tiles

### Fisher Tile

- can't be placed on
- has n fishers in any direction
- each fisher will take out one fish that swims by

### Factory Tile

- can't be placed on
- will pollute any river tile placed top, left, right or below it

## Placing rules

- All river connections will need to lead into a body of water
- don't need to use all available river tiles
- start pond needs to be connected to end pond

## Placing features

### Essential

- indicate tile that will be placed on
- mark unplaceable tiles red when trying to place on tile
- rotate placeable tiles (mouse wheel?)
- remove placed tiles