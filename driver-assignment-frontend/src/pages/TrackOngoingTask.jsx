import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";

const SAMPLE = [
  { id: "1", invoice: "1261756", order: "20116018", postcode: "2170", status: "In Progress", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { id: "2", invoice: "1261757", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261757.pdf" },
];

const customStyles = {
  header: { style: { padding: "0.75rem 1rem" } },
  headRow: { style: { backgroundColor: "transparent", borderBottomWidth: "0px" } },
  headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem", fontSize: "0.9rem", color: "#475569" } },
  rows: { style: { minHeight: "56px" } },
  cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
};

export default function TrackOngoing() {
  const [filter, setFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = useMemo(
    () => [
      { name: "Invoice No.", selector: (row) => row.invoice, sortable: true },
      { name: "Order Number", selector: (row) => row.order, sortable: true },
      { name: "Postcode", selector: (row) => row.postcode, sortable: true },
      { name: "Status", selector: (row) => row.status, sortable: true, cell: (r) => <span className="text-sm text-gray-600">{r.status}</span> },
      { name: "Description", selector: (row) => row.description },
      { name: "Driver Name", selector: (row) => row.driver },
      {
        name: "Proof of Delivery",
        selector: (row) => row.podUrl,
        // removed `right: true` to avoid DOM warning; align in cell
        cell: (row) => (
          <div className="text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(row.podUrl, "_blank");
              }}
              className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100"
            >
              Download
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = (filter || "").trim().toLowerCase();
    if (!q) return SAMPLE;
    return SAMPLE.filter((r) =>
      ["invoice", "order", "postcode", "status", "description", "driver"].some((k) => String(r[k] ?? "").toLowerCase().includes(q))
    );
  }, [filter]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ongoing Assignments</h1>
          <div className="text-sm text-gray-600 mt-1">Total Assignments <span className="ml-2 px-2 py-0.5 bg-sky-50 text-sky-700 rounded">20</span></div>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            className="pl-3 pr-3 py-2 rounded-full border border-gray-200 text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="panel p-3 rounded-2xl border border-indigo-100">
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          selectableRows
          onSelectedRowsChange={(s) => setSelectedRows(s.selectedRows)}
          selectableRowsHighlight
          highlightOnHover
          customStyles={customStyles}
          responsive
        />
      </div>
    </div>
  );
}