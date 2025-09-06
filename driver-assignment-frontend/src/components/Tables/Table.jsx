// ...existing code...
import React, { useEffect, useMemo, useState } from "react";

/**
 * Reusable Table
 * Props:
 *  - columns: [{ key, label, render?, className?, sortable?, sortFn? }]
 *  - data: array of row objects
 *  - rowKey: string key to use as unique id for rows (default: 'id')
 *  - selectable: boolean (default: true)
 *  - onSelectionChange: (selectedRowsArray) => void
 *  - defaultPageSize: number (default: 10)
 *  - pageSizeOptions: number[] (default: [10,20,50])
 *  - initialSort: { key, dir } where dir = 'asc'|'desc'
 *  - searchableKeys: string[] (optional) keys to search; defaults to all column keys
 */
export default function Table({
  columns = [],
  data = [],
  rowKey = "id",
  selectable = true,
  onSelectionChange,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  initialSort = {},
  className = "",
  onRowClick,
  searchableKeys = null,
}) {
  const [sortKey, setSortKey] = useState(initialSort.key || null);
  const [sortDir, setSortDir] = useState(initialSort.dir || null); // 'asc' | 'desc' | null
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // derive stable keys for rows (fallback to index if rowKey missing)
  const keyedData = useMemo(() => {
    return data.map((row, idx) => {
      const keyVal = row[rowKey] ?? `${idx}`;
      return { __key: String(keyVal), __idx: idx, ...row };
    });
  }, [data, rowKey]);

  // determine which keys to search over
  const keysToSearch = useMemo(() => {
    if (Array.isArray(searchableKeys) && searchableKeys.length > 0) return searchableKeys;
    // fallback to columns keys
    return columns.map((c) => c.key).filter(Boolean);
  }, [searchableKeys, columns]);

  // filtered by search query
  const filteredData = useMemo(() => {
    const q = String(searchQuery || "").trim().toLowerCase();
    if (!q) return keyedData;
    return keyedData.filter((row) =>
      keysToSearch.some((k) => {
        const val = row[k];
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [keyedData, searchQuery, keysToSearch]);

  // reconcile selection when underlying data changes (keep selection only for existing keys)
  useEffect(() => {
    const currentKeys = new Set(keyedData.map((r) => r.__key));
    setSelected((prev) => {
      const next = new Set(Array.from(prev).filter((k) => currentKeys.has(k)));
      if (onSelectionChange) {
        const selectedRows = keyedData.filter((r) => next.has(r.__key));
        onSelectionChange(selectedRows);
      }
      return next;
    });
    // reset to page 1 if data shrinks or search changes
    setPage((p) => Math.max(1, Math.min(p, Math.ceil(filteredData.length / pageSize) || 1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, rowKey, filteredData.length]);

  // sorting (applies to filtered data)
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    const sortFn = col && col.sortFn;
    const dir = sortDir === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      if (sortFn) return dir * sortFn(a, b);
      const va = a[sortKey];
      const vb = b[sortKey];

      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;

      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dir;
      }

      const da = new Date(va);
      const db = new Date(vb);
      if (!isNaN(da) && !isNaN(db)) {
        return (da - db) * dir;
      }

      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [filteredData, sortKey, sortDir, columns]);

  // pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // selection helpers
  const toggleRow = (key) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (onSelectionChange) {
        const selectedRows = keyedData.filter((r) => next.has(r.__key));
        onSelectionChange(selectedRows);
      }
      return next;
    });
  };

  const isAllPageSelected = pageData.every((r) => selected.has(r.__key)) && pageData.length > 0;
  const toggleSelectAllOnPage = () => {
    setSelected((s) => {
      const next = new Set(s);
      if (isAllPageSelected) {
        pageData.forEach((r) => next.delete(r.__key));
      } else {
        pageData.forEach((r) => next.add(r.__key));
      }
      if (onSelectionChange) {
        const selectedRows = keyedData.filter((r) => next.has(r.__key));
        onSelectionChange(selectedRows);
      }
      return next;
    });
  };

  const handleHeaderSort = (col) => {
    if (!col.sortable) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  };

  // small UI helpers for pagination
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className={`bg-white/60 panel p-3 rounded-lg border border-indigo-100 ${className}`}>
      {/* top: search + optional selection summary */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-sm text-gray-600">{selected.size > 0 ? `${selected.size} selected` : `Showing ${pageData.length} of ${totalItems} items`}</div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="pl-3 pr-8 py-1.5 rounded-full border border-gray-200 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 text-sm px-2"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 text-sm">⌕</span>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              {selectable && (
                <th className="pr-4 py-2">
                  <input
                    type="checkbox"
                    aria-label="select all rows on page"
                    checked={isAllPageSelected}
                    onChange={toggleSelectAllOnPage}
                    className="w-4 h-4"
                  />
                </th>
              )}
              {columns.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-2 text-sm font-medium text-gray-600 ${col.className || ""} ${col.sortable ? "cursor-pointer select-none" : ""}`}
                    onClick={() => handleHeaderSort(col)}
                    scope="col"
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {col.sortable && <span className="text-xs text-gray-400">{active ? (sortDir === "asc" ? "▲" : sortDir === "desc" ? "▼" : "") : "⇅"}</span>}
                    </div>
                  </th>
                );
              })}
              <th className="px-4 py-2" /> {/* actions column */}
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 2 : 1)} className="px-6 py-8 text-center text-sm text-gray-500">
                  No records
                </td>
              </tr>
            ) : (
              pageData.map((row, rIdx) => {
                const key = row.__key;
                const isSelected = selected.has(key);
                return (
                  <tr
                    key={key}
                    className="border-t last:border-b hover:bg-white/50 transition-colors"
                    onClick={() => {
                      if (onRowClick) onRowClick(row);
                    }}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`select row ${rIdx}`}
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleRow(key);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 align-middle text-sm ${col.className || "text-gray-700"}`}
                        onClick={(e) => {
                          if (col.disableRowClick) e.stopPropagation();
                        }}
                      >
                        {col.render ? col.render(row) : String(row[col.key] ?? "")}
                      </td>
                    ))}

                    <td className="px-4 py-3 text-right" />
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* footer: selection summary + pagination controls */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          {selected.size > 0 ? (
            <span>
              {selected.size} selected
              <button
                onClick={() => {
                  setSelected(new Set());
                  if (onSelectionChange) onSelectionChange([]);
                }}
                className="ml-3 text-indigo-600 underline text-sm"
              >
                Clear
              </button>
            </span>
          ) : (
            <span>
              Showing {pageData.length} of {totalItems} items
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={prevPage} className="px-2 py-1 rounded-md bg-white/80 border border-gray-200 hover:bg-gray-50" disabled={page <= 1}>
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} / {totalPages}
            </span>
            <button onClick={nextPage} className="px-2 py-1 rounded-md bg-white/80 border border-gray-200 hover:bg-gray-50" disabled={page >= totalPages}>
              Next
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-600">Rows</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 border border-gray-200 rounded-md bg-white text-sm"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
// ...existing code...