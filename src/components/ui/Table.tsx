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
      <div className="border border-stone-200 rounded-xl bg-white py-14 px-4 text-center text-base text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border border-stone-200 rounded-xl bg-white overflow-x-auto -mx-0">
      <table className="w-full min-w-[640px] text-base border-collapse">
        <thead>
          <tr className="border-b border-stone-200">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left text-sm font-semibold text-stone-500 px-4 sm:px-5 py-3.5 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-cream-100/60">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`px-4 sm:px-5 py-5 align-middle ${col.className ?? ""}`}
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
