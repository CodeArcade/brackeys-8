import classNames from "classnames";
import { FC } from "react";
import BlockedTile from "./Tiles/BlockedTile";
import EndTile from "./Tiles/EndTile";
import StartTile from "./Tiles/StartTile";
import { Tile as TileModel, TileType } from "./TileType";

interface TileProps {
  tile: TileModel;
  onClick?: () => void;
  selected: boolean;
}

export const Tile: FC<TileProps> = ({ tile, selected, onClick }) => {
  const classes = classNames("main-tile tile", {
    "tile-selected": selected,
  });

  let currentTile = <></>

  switch (tile.type) {
    case TileType.Empty:
      currentTile = <></>;
      break;
    case TileType.Blocked:
      currentTile = <BlockedTile />
      break;
    case TileType.Start:
      currentTile = <StartTile />
      break;
    case TileType.End:
      currentTile = <EndTile />
  }

  return <div style={{
    transform: `rotate(${tile.rotation * 90}deg)`
  }} className={classes} onClick={onClick}>
    {currentTile}
  </div>;
};
