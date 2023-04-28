import type { SearchResult } from "~/server/api/routers/spotify_user_router";

export interface TableConfig {
  headers: string[];
  data: SearchResult[];
}

const CompactTable = ({ data, headers }: TableConfig) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-compact table w-full">
        <thead>
          <tr>
            <th></th>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((data, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              <td>{data.track.name}</td>
              <td>{data.playlist}</td>
              <td>{data.creator}</td>
              <td>{data.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompactTable;
