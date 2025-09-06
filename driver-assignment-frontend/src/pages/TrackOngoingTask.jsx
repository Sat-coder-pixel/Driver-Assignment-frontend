import React from "react";
import Table from "../components/Tables/Table.jsx";

// sample data
const SAMPLE = [
  { invoice: "1261756", order: "20116018", postcode: "2170", status: "In Progress", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },
];

export default function TrackOngoingTask() {
  const downloadPod = (url) => {
    // simple download helper (replace with signed URL fetch if protected)
    window.open(url, "_blank");
  };

  const columns = [
    { key: "invoice", label: "Invoice No." },
    { key: "order", label: "Order Number" },
    { key: "postcode", label: "Postcode" },
    { key: "status", label: "Status", className: "text-sm text-gray-600" },
    { key: "description", label: "Description" },
    { key: "driver", label: "Driver Name" },
    {
      key: "pod",
      label: "Proof of Delivery",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadPod(row.podUrl);
          }}
          className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100"
        >
          Download
        </button>
      ),
      disableRowClick: true,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Ongoing Assignments</h1>
      <div className="mb-4 text-sm text-gray-600">Total Assignments <span className="ml-2 px-2 py-0.5 bg-sky-50 text-sky-700 rounded">20</span></div>

      <Table columns={columns} data={SAMPLE} onRowClick={(row) => {
        // optional row click for tracking
      }} />
    </div>
  );
}