import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Tables/Table.jsx";

// sample data (replace with real data / API)
const SAMPLE = [
  { invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },
  { invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },

  { invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },

  { invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },

  { invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },

  { invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },
{ invoice: "1261756", order: "20116018", postcode: "2170", status: "Complete", description: "Refrig", driver: "Adam", podUrl: "/pods/1261756.pdf" },
  { invoice: "1261756", order: "20116020", postcode: "2167", status: "Complete", description: "AC", driver: "Mark", podUrl: "/pods/1261756-2.pdf" },

];

export default function CompletedTasks() {
  const navigate = useNavigate();

  const columns = [
    {
      key: "invoice",
      label: "Invoice No.",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            // navigate to invoice details / track page
            navigate(`/invoices/${row.invoice}`);
          }}
          className="text-indigo-600 hover:underline text-sm font-medium"
        >
          {row.invoice}
        </button>
      ),
    },
    { key: "order", label: "Order Number" },
    { key: "postcode", label: "Postcode" },
    { key: "status", label: "Status", className: "text-sm text-gray-600" },
    { key: "description", label: "Description" },
    { key: "driver", label: "Driver Name" },
    {
      key: "pod",
      label: "Proof of Delivery",
      render: (row) => (
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
      ),
      disableRowClick: true,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Completed Assignments</h1>
      <div className="mb-4 text-sm text-gray-600">Total Assignments <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">20</span></div>

      <Table
        columns={columns}
        data={SAMPLE}
        onRowClick={(row) => {
          // optional: click whole row to open details
          // navigate(`/invoices/${row.invoice}`);
        }}
      />
    </div>
  );
}