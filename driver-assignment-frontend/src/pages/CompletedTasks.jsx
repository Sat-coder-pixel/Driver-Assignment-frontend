import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const SAMPLE = [
  { id: "1", invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { id: "2", invoice: "1261757", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261757.pdf" },
  { id: "3", invoice: "3", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756-2.pdf" },
];

const customStyles = {
  header: { style: { padding: "0.75rem 1rem" } },
  headRow: { style: { backgroundColor: "transparent", borderBottomWidth: "0px" } },
  headCells: { style: { paddingLeft: "1rem", paddingRight: "1rem", fontSize: "0.9rem", color: "#475569" } },
  rows: { style: { minHeight: "56px" } },
  cells: { style: { paddingLeft: "1rem", paddingRight: "1rem" } },
};

export default function CompletedTasks() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = useMemo(
    () => [
      {
        name: "Invoice No.",
        selector: (row) => row.invoice,
        sortable: true,
        cell: (row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/invoices/${row.invoice}`);
            }}
            className="text-indigo-600 hover:underline text-sm font-medium"
          >
            {row.invoice}
          </button>
        ),
        grow: 0.6,
      },
      { name: "Order Number", selector: (row) => row.order, sortable: true, grow: 0.8 },
      { name: "Postcode", selector: (row) => row.postcode, sortable: true, grow: 0.4 },
      { name: "Status", selector: (row) => row.status, sortable: true, grow: 0.6, cell: (r) => <span className="text-sm text-gray-600">{r.status}</span> },
      { name: "Description", selector: (row) => row.description, grow: 1 },
      { name: "Driver Name", selector: (row) => row.driver, grow: 0.8 },
      {
        name: "Proof of Delivery",
        selector: (row) => row.podUrl,
        sortable: false,
        // align right via cell renderer wrapper
        cell: (row) => (
          <div className="text-right">
            <a
              href={row.podUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-block p-2 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M21 21H3" />
              </svg>
            </a>
          </div>
        ),
        grow: 0.4,
      },
    ],
    [navigate]
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
          <h1 className="text-2xl font-semibold">Completed Assignments</h1>
          <div className="text-sm text-gray-600 mt-1">Total Assignments <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">20</span></div>
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
          defaultSortFieldId={1}
          responsive
        />
      </div>
    </div>
  );
}