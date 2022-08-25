import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Tile as TileComponent } from "./Tile";
import { FisherTile, Rotation, Tile, TileType } from "./TileType";
import { Level } from "./Level";

function App() {
  const [levelName, setLevelName] = useState("");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [startFishes, setStartFishes] = useState(2);
  const [goalFishes, setGoalFishes] = useState(2);
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [level, setLevel] = useState<Level>();
  const [selectedTile, setSelectedTile] = useState<{
    i: number;
    j: number;
  } | null>(null);

  const [straightTiles, setStraightTiles] = useState(0);
  const [bendyTiles, setBendyTiles] = useState(0);
  const [tTiles, setTTiles] = useState(0);
  const [crossTiles, setCrossTiles] = useState(0);

  useEffect(() => {
    const newTiles: Tile[][] = [];
    for (let i = 0; i < height; i++) {
      newTiles.push([]);
      for (let j = 0; j < width; j++) {
        const tile = tiles[i]?.[j] || {
          type: TileType.Empty,
          rotation: Rotation.Left,
        };
        newTiles[i].push(tile);
      }
    }

    setTiles(newTiles);
  }, [width, height]);

  useEffect(() => {
    setLevel({
      name: levelName,
      width,
      height,
      startFishes,
      goalFishes,
      tiles,
      placeables: [
        {
          type: TileType.Straight,
          count: straightTiles,
        },
        {
          type: TileType.Bendy,
          count: bendyTiles,
        },
        {
          type: TileType.Cross,
          count: crossTiles,
        },
        {
          type: TileType.TCross,
          count: tTiles,
        },
      ],
    });
  }, [tiles, width, height, levelName, startFishes, goalFishes]);

  return (
    <div className="App">
      <div className="dimensions">
        <div className="label-group">
          <label>Level Name:</label>
          <input
            type="text"
            value={levelName}
            onChange={(event) => setLevelName(event.target.value)}
            placeholder="Level Name"
          />
        </div>
        <div className="label-group">
          <label>Width: </label>
          <input
            type="number"
            value={width}
            min={1}
            step={1}
            onChange={(event) => setWidth(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>Height: </label>
          <input
            type="number"
            value={height}
            min={1}
            step={1}
            onChange={(event) => setHeight(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>Start Fishes: </label>
          <input
            type="number"
            value={startFishes}
            min={1}
            step={1}
            onChange={(event) => setStartFishes(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>Goal Fishes: </label>
          <input
            type="number"
            value={goalFishes}
            min={1}
            step={1}
            onChange={(event) => setGoalFishes(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>Straight tiles: </label>
          <input
            type="number"
            value={straightTiles}
            min={0}
            step={1}
            onChange={(event) => setStraightTiles(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>Bendy tiles: </label>
          <input
            type="number"
            value={bendyTiles}
            min={0}
            step={1}
            onChange={(event) => setBendyTiles(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>T-cross tiles: </label>
          <input
            type="number"
            value={tTiles}
            min={0}
            step={1}
            onChange={(event) => setTTiles(parseInt(event.target.value))}
          />
        </div>
        <div className="label-group">
          <label>Cross tiles: </label>
          <input
            type="number"
            value={crossTiles}
            min={0}
            step={1}
            onChange={(event) => setCrossTiles(parseInt(event.target.value))}
          />
        </div>
      </div>

      {levelName.length > 0 && (
        <a
          className="export"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(level, null, 2)
          )}`}
          download={levelName + ".json"}
        >
          EXPORT
        </a>
      )}

      <div className="grid">
        {tiles.map((row, i) => (
          <div className="tile-row" key={`tile-row-${i}`}>
            {row.map((tile, j) => (
              <TileComponent
                key={`tile-${i}-${j}`}
                tile={tile}
                selected={selectedTile?.i === i && selectedTile?.j === j}
                onClick={() => {
                  setSelectedTile({ i, j });
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="tile-picker">
        <TileComponent
          tile={{
            rotation: Rotation.Left,
            type: TileType.Start,
          }}
          selected={false}
          onClick={() => {
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = {
              rotation: Rotation.Left,
              type: TileType.Start,
            };
            setTiles(newTiles);
          }}
        />
        <TileComponent
          tile={{
            rotation: Rotation.Left,
            type: TileType.End,
          }}
          selected={false}
          onClick={() => {
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = {
              rotation: Rotation.Left,
              type: TileType.End,
            };
            setTiles(newTiles);
          }}
        />
        <TileComponent
          tile={{
            rotation: Rotation.Left,
            type: TileType.Blocked,
          }}
          selected={false}
          onClick={() => {
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = {
              rotation: Rotation.Left,
              type: TileType.Blocked,
            };
            setTiles(newTiles);
          }}
        />
        <TileComponent
          tile={{
            rotation: Rotation.Left,
            type: TileType.Empty,
          }}
          selected={false}
          onClick={() => {
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = {
              rotation: Rotation.Left,
              type: TileType.Empty,
            };
            setTiles(newTiles);
          }}
        />
        <TileComponent
          tile={{
            rotation: Rotation.Left,
            type: TileType.Fisher,
          }}
          selected={false}
          onClick={() => {
            const fisherTile: FisherTile = {
              type: TileType.Fisher,
              rotation: Rotation.Left,
              fishers: [
                {
                  direction: Rotation.Left,
                  count: 0,
                },
                {
                  direction: Rotation.Top,
                  count: 0,
                },
                {
                  direction: Rotation.Right,
                  count: 0,
                },
                {
                  direction: Rotation.Bottom,
                  count: 0,
                },
              ],
            };
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = fisherTile;
            setTiles(newTiles);
          }}
        />
        <TileComponent
          tile={{
            rotation: Rotation.Left,
            type: TileType.Factory,
          }}
          selected={false}
          onClick={() => {
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = {
              rotation: Rotation.Left,
              type: TileType.Factory,
            };
            setTiles(newTiles);
          }}
        />
        <TileComponent 
          tile={{
            rotation: Rotation.Left,
            type: TileType.TCross
          }}
          selected={false}
          onClick={() => {
            const newTiles = [...tiles];
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = {
              rotation: Rotation.Left,
              type: TileType.TCross,
            };
            setTiles(newTiles);
          }}
        />
      </div>

      <div className="tile-rotation">
        <button
          onClick={() => {
            const newTiles = [...tiles];
            const tile = newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0];
            tile.rotation -= 1;
            if (tile.rotation < 0) {
              tile.rotation = 3;
            }
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = tile;
            setTiles(newTiles);
          }}
        >
          ⥀
        </button>
        <button
          onClick={() => {
            const newTiles = [...tiles];
            const tile = newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0];
            tile.rotation += 1;
            if (tile.rotation >= 4) {
              tile.rotation = 0;
            }
            newTiles[selectedTile?.i ?? 0][selectedTile?.j ?? 0] = tile;
            setTiles(newTiles);
          }}
        >
          ⥁
        </button>
      </div>

      {selectedTile &&
        tiles[selectedTile?.i || 0][selectedTile?.j || 0].type ===
          TileType.Fisher && (
          <div className="fisher-inspector">
            <div className="label-group">
              <label>Left: </label>
              <input
                type="number"
                value={
                  (
                    tiles[selectedTile?.i || 0][
                      selectedTile?.j || 0
                    ] as FisherTile
                  ).fishers?.[Rotation.Left]?.count
                }
                min={0}
                step={1}
                onChange={(event) => {
                  const tile = tiles[selectedTile?.i || 0][
                    selectedTile?.j || 0
                  ] as FisherTile;
                  tile.fishers![Rotation.Left].count = parseInt(
                    event.target.value || "0"
                  );
                  const newTiles = [...tiles];
                  newTiles[selectedTile?.i || 0][selectedTile?.j || 0] = tile;
                  setTiles(newTiles);
                }}
              />
            </div>
            <div className="label-group">
              <label>Top: </label>
              <input
                type="number"
                value={
                  (
                    tiles[selectedTile?.i || 0][
                      selectedTile?.j || 0
                    ] as FisherTile
                  ).fishers?.[Rotation.Top]?.count
                }
                min={0}
                step={1}
                onChange={(event) => {
                  const tile = tiles[selectedTile?.i || 0][
                    selectedTile?.j || 0
                  ] as FisherTile;
                  tile.fishers![Rotation.Top].count = parseInt(
                    event.target.value || "0"
                  );
                  const newTiles = [...tiles];
                  newTiles[selectedTile?.i || 0][selectedTile?.j || 0] = tile;
                  setTiles(newTiles);
                }}
              />
            </div>
            <div className="label-group">
              <label>Right: </label>
              <input
                type="number"
                value={
                  (
                    tiles[selectedTile?.i || 0][
                      selectedTile?.j || 0
                    ] as FisherTile
                  ).fishers?.[Rotation.Right]?.count
                }
                min={0}
                step={1}
                onChange={(event) => {
                  const tile = tiles[selectedTile?.i || 0][
                    selectedTile?.j || 0
                  ] as FisherTile;
                  tile.fishers![Rotation.Right].count = parseInt(
                    event.target.value || "0"
                  );
                  const newTiles = [...tiles];
                  newTiles[selectedTile?.i || 0][selectedTile?.j || 0] = tile;
                  setTiles(newTiles);
                }}
              />
            </div>
            <div className="label-group">
              <label>Bottom: </label>
              <input
                type="number"
                value={
                  (
                    tiles[selectedTile?.i || 0][
                      selectedTile?.j || 0
                    ] as FisherTile
                  ).fishers?.[Rotation.Bottom]?.count
                }
                min={0}
                step={1}
                onChange={(event) => {
                  const tile = tiles[selectedTile?.i || 0][
                    selectedTile?.j || 0
                  ] as FisherTile;
                  tile.fishers![Rotation.Bottom].count = parseInt(
                    event.target.value || "0"
                  );
                  const newTiles = [...tiles];
                  newTiles[selectedTile?.i || 0][selectedTile?.j || 0] = tile;
                  setTiles(newTiles);
                }}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
