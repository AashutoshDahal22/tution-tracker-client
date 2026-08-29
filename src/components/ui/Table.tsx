import React from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="border border-stone-200 py-14 text-center text-sm text-stone-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border border-stone-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left text-xs uppercase tracking-widest text-stone-400 font-medium px-5 py-3 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`px-5 py-4 align-middle ${col.className ?? ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
