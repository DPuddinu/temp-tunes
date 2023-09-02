import { type Table } from "@tanstack/react-table";
import { type Playlist } from "~/types/spotify-types";
import PlaylistComponent from "./PlaylistComponent";

function TableBodyComponent<TData>({
  table,
  data,
}: {
  table: Table<TData>;
  data: Playlist[];
}) {
  return (
    <div className="m-auto mb-6 flex w-full flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
      {table.getRowModel().rows?.length ? (
        table
          .getRowModel()
          .rows.map((row) => (
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
export default TableBodyComponent;
