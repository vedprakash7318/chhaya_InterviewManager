import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

function TotalLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processing, setProcessing] = useState(false);
  const toast = useRef(null);

  const fetchLeads = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const InterviewManagerId = localStorage.getItem("InterviewManager");
      const res = await axios.get(
        `http://localhost:5000/api/client-form/get-by-interview/${InterviewManagerId}`,
        { params: { page, limit } }
      );
      setLeads(res.data.leads);
      setTotalRecords(res.data.total);
      setLoading(false);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch leads",
        life: 3000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1, rows);
  }, []);

  const srNoTemplate = (rowData, options) => options.rowIndex + 1 + first;

  const statusTemplate = (rowData) => {
    if (rowData.InterviewStatus === "Pass")
      return <Tag value="Pass" severity="success" />;
    if (rowData.InterviewStatus === "Fail")
      return <Tag value="Fail" severity="danger" />;
    return <Tag value="Applied" severity="warning" />;
  };

  const handleStatusUpdate = async (leadId, status) => {
    setProcessing(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/client-form/mark-interview/${leadId}`,
        { status }
      );
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Interview marked as ${status}`,
          life: 3000,
        });
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === leadId ? { ...lead, InterviewStatus: status } : lead
          )
        );
      }
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update status",
        life: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const confirmUpdate = (leadId, status) => {
    confirmDialog({
      message: `Are you sure you want to mark this lead as ${status}?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: status === "Pass" ? "p-button-success" : "p-button-danger",
      accept: () => handleStatusUpdate(leadId, status),
    });
  };

  const actionTemplate = (rowData) => (
    <div style={{display:"flex", gap:"10px"}}>
      <Button
        icon="pi pi-check"
        className="p-button-rounded p-button-success p-button-sm"
        tooltip="Pass"
        onClick={() => confirmUpdate(rowData._id, "Pass")}
        disabled={processing}
      />
      <Button
        icon="pi pi-times"
        className="p-button-rounded p-button-danger p-button-sm"
        tooltip="Fail"
        onClick={() => confirmUpdate(rowData._id, "Fail")}
        disabled={processing}
      />
    </div>
  );

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Total Leads Table</h2>
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
          const page = e.page + 1;
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
          field="InterviewStatus"
          header="Status"
          body={statusTemplate}
          sortable
        />
        <Column header="Action" body={actionTemplate} style={{ width: "140px" }} />
      </DataTable>
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />
    </div>
  );
}

export default TotalLeads;
