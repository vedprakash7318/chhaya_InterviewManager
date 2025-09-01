import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/ViewClientForm.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const ViewClientForm = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const toast = React.useRef(null);

  const { state } = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const leadId = location.state?.leadId;
  

  useEffect(() => {
    if (!state) {
      navigate('/leads');
      return;
    }

    const fetchData = async () => {
      
      
      try {
        const res = await axios.get(`http://localhost:5000/api/client-form/getbyId/${leadId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leadId, navigate, state]);

const handleStatusUpdate = async (status) => {
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

      // update local state
      setData((prevData) => ({
        ...prevData,
        InterviewStatus: status, 
      }));
    }
  } catch (err) {
    console.error(err);
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


  const confirmStatusChange = (status) => {
    confirmDialog({
      message: `Are you sure you want to mark this client as ${status}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleStatusUpdate(status),
      reject: () => {}
    });
  };

  if (!state) return null;
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return <div className="no-data">No data available</div>;

  return (
    <div className="form-container">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="form-header">
        <div className="company-info">
          <h2>Chhaya International Pvt. Ltd.</h2>
          <p>LIG 2 Nehru Nagar Unnao</p>
          <p>Uttar Pradesh 209801</p>
          <p>Email: chhayainternationalpvtltd@gmail.com</p>
          <p>Contact No.: 8081478427</p>
        </div>
        <div className="client-images">
          <div className="image-box">
            <label>Client Photo:</label>
            <img src={data.photo || '/placeholder-user.jpg'} alt="Client" className="client-photo" />
          </div>
          <div className="image-box">
            <label>Client Signature:</label>
            <img src={data.Sign || '/placeholder-signature.png'} alt="Signature" className="client-signature" />
          </div>
        </div>
      </div>

      <div className="form-title-section">
        <h3 className="form-title">Registration Form</h3>
        <div className="form-meta">
          <span className="form-date"><strong>Date:</strong> {new Date(data.createdAt).toLocaleDateString()}</span>
          <span className="form-reg-no"><strong>Registration No. :- </strong>{data.regNo}</span>
          {data.status && (
            <span className={`status-badge status-${data.status.toLowerCase()}`}>
              {data.status}
            </span>
          )}
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <section className="form-section personal-details">
        <h4 className="section-title">
          <span className="section-bullet">•</span> Personal Details
        </h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name:</label>
            <div className="form-control">{data.fullName}</div>
          </div>

          <div className="form-group">
            <label>Father's Name:</label>
            <div className="form-control">{data.fatherName}</div>
          </div>

          <div className="form-group">
            <label>Address:</label>
            <div className="form-control">{data.address}</div>
          </div>

          <div className="form-group">
            <label>State:</label>
            <div className="form-control">{data.state}</div>
          </div>

          <div className="form-group">
            <label>PIN Code:</label>
            <div className="form-control">{data.pinCode}</div>
          </div>

          <div className="form-group">
            <label>WhatsApp Number:</label>
            <div className="form-control">{data.whatsAppNo}</div>
          </div>

          <div className="form-group">
            <label>Family Number:</label>
            <div className="form-control">{data.familyContact}</div>
          </div>
          
          <div className="form-group">
            <label>Contact Number:</label>
            <div className="form-control">{data.contactNo}</div>
          </div>
          
          <div className="form-group full-width">
            <label>Email:</label>
            <div className="form-control">{data.email}</div>
          </div>
        </div>
      </section>

      {/* PASSPORT DETAILS */}
      <section className="form-section passport-details">
        <h4 className="section-title">
          <span className="section-bullet">•</span> Passport Details
        </h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Passport Number:</label>
            <div className="form-control">{data.passportNumber}</div>
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <div className="form-control">{new Date(data.dateOfBirth).toLocaleDateString()}</div>
          </div>

          <div className="form-group">
            <label>Passport Expiry Date:</label>
            <div className="form-control">{new Date(data.passportExpiry).toLocaleDateString()}</div>
          </div>

          <div className="form-group">
            <label>Nationality:</label>
            <div className="form-control">{data.nationality}</div>
          </div>

          <div className="form-group checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="ecr"
                checked={data.ecr || false}
                readOnly
              />
              <label htmlFor="ecr">ECR</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="ecnr"
                checked={data.ecnr || false}
                readOnly
              />
              <label htmlFor="ecnr">ECNR</label>
            </div>
          </div>
        </div>
      </section>

      {/* WORK DETAILS */}
      <section className="form-section work-details">
        <h4 className="section-title">
          <span className="section-bullet">•</span> Work Details
        </h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Occupation:</label>
            <div className="form-control">{data.occupation}</div>
          </div>

          <div className="form-group">
            <label>Place of Deployment:</label>
            <div className="form-control">{data.placeOfEmployment}</div>
          </div>

          <div className="form-group">
            <label>Last Experience:</label>
            <div className="form-control">{data.lastExperience}</div>
          </div>

          <div className="form-group">
            <label>Last Salary & Post Details:</label>
            <div className="form-control">{data.lastSalaryPostDetails}</div>
          </div>

          <div className="form-group">
            <label>Expected Salary:</label>
            <div className="form-control">{data.expectedSalary}</div>
          </div>

          <div className="form-group">
            <label>Medical Report:</label>
            <div className="form-control">{data.medicalReport}</div>
          </div>

          <div className="form-group">
            <label>Interview Status:</label>
            <div className="form-control">{data.InterviewStatus}</div>
          </div>

          <div className="form-group">
            <label>PCC Status:</label>
            <div className="form-control">{data.pccStatus}</div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Button 
          label="Pass" 
          icon="pi pi-check" 
          className="p-button-success"
          loading={processing}
          onClick={() => confirmStatusChange('Pass')}
        />
        <Button 
          label="Fail" 
          icon="pi pi-times" 
          className="p-button-danger"
          loading={processing}
          onClick={() => confirmStatusChange('Fail')}
        />
      </div>
    </div>
  );
};

export default ViewClientForm;