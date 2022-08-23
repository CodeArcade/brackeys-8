import { FC } from "react";
import { FisherTile as FisherTileModel } from "../TileType";

const FisherTile: FC<{ tile: FisherTileModel }> = ({ tile }) => {
  return (
    <div className="tile tile-fisher">
      A
      {tile.fishers?.map((fisher) => (
        <div key={`fisher-area-${fisher.direction}`} className={`fisher fisher-${fisher.direction}`}>
          {new Array(fisher.count).fill(0).map((_, index) => (
            <div key={`fisher-dot-${fisher.direction}-${index}`} className="fisher-dot" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FisherTile;
