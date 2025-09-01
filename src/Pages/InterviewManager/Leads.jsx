import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate=useNavigate()
  // ✅ Fetch leads from API
  const fetchLeads = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const InterviewManagerId = localStorage.getItem("InterviewManager");
      const res = await axios.get(
        `http://localhost:5000/api/client-form/get-by-interview/${InterviewManagerId}`,
        { params: { page, limit } }
      );

      // ❌ Remove leads which are already marked Pass/Fail
      const filtered = res.data.leads.filter(
        (lead) =>
          lead.InterviewStatus !== "Pass" && lead.InterviewStatus !== "Fail"
      );

      setLeads(filtered);
      setTotalRecords(filtered.length);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leads");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1, rows);
  }, []);

  // ✅ Sr No Column
  const srNoTemplate = (rowData, options) => options.rowIndex + 1 + first;

  // ✅ Action Column - Only View Button
  const actionTemplate = (rowData) => (
    <Button
      label="View"
      icon="pi pi-eye"
      className="p-button-info p-button-sm"
     onClick={() =>
            navigate(`/view-form`, { state: { leadId: rowData._id } })
          }
    />
  );

  // // ✅ View Handler
  // const handleView = (lead) => {
  //   // You can open a modal or navigate to a detail page
  //   toast.info(`Viewing lead: ${lead.number}`);
  //   console.log("Lead details:", lead);
  // };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Pending Leads Table</h2>

      <DataTable
        value={leads}
        loading={loading}
        paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        lazy
        onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
          const page = e.page + 1; // PrimeReact page starts at 0
          fetchLeads(page, e.rows);
        }}
        emptyMessage="No leads found."
      >
        <Column header="Sr No" body={srNoTemplate} style={{ width: "80px" }} />
        <Column field="fullName" header="Name" sortable />
        <Column field="contactNo" header="Number" sortable />
        <Column field="passportNumber" header="Passport Number" sortable />
        <Column field="InterviewAppliedBy.name" header="Applied By" sortable />
        <Column
          header="Action"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Leads;
