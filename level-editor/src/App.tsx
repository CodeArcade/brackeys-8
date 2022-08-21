import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Tile as TileComponent } from "./Tile";
import { Rotation, Tile, TileType } from "./TileType";
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
    });
  }, [tiles, width, height, levelName, startFishes, goalFishes]);

  return (
    <div className="App">
      <div className="dimensions">
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
          <label>Level Name:</label>
          <input
            type="text"
            value={levelName}
            onChange={(event) => setLevelName(event.target.value)}
            placeholder="Level Name"
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
    </div>
  );
}

export default App;
