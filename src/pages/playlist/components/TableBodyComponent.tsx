import { type Table } from "@tanstack/react-table";
import { type Playlist } from "~/types/spotify-types";
import { PlaylistComponent } from "./PlaylistComponent";

export function TableBodyComponent<TData>({
  table,
  data,
}: {
  table: Table<TData>;
  data: Playlist[];
}) {
  return (
    <div className="flex w-full flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:w-3/4">
      {table.getRowModel().rows?.length ? (
        table
          .getRowModel()
          .rows.map((row, i) => (
            <PlaylistComponent
              key={row.id}
              data={data}
              playlist={row.original as Playlist}
            />
          ))
      ) : (
        <div>No results</div>
      )}
    </div>
  );
}
