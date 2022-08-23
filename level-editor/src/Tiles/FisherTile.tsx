import { FC } from "react";
import { FisherTile as FisherTileModel } from "../TileType";

const FisherTile: FC<{ tile: FisherTileModel }> = () => {
  return <div className="tile tile-start">A</div>;
};

export default FisherTile