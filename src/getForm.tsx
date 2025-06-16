import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import 'bootstrap/dist/css/bootstrap.min.css';

type Field = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
};

type Settings = {
  allowMultipleResponses: boolean;
  collectEmail: boolean;
  showProgressBar: boolean;
  confirmationMessage: string;
  requireSignIn: boolean;
};

type Form = {
  formId: string;
  _id: string;
  version: string;
  title: string;
  description: string;
  fields: Field[];
  settings: Settings;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  responseCount: number;
  __v: number;
};

type ApiResponse = {
  success: boolean;
  forms: Form[];
};

function GetForm() {
  const userEmail = useSelector((state: RootState) => state.auth.user?.email || '');
  const [filteredForms, setFilteredForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE1}/api/forms`)
      .then((response) => response.json())
      .then((json: ApiResponse) => {
        const userForms = json.forms.filter((form) => form.createdBy === userEmail);
        setFilteredForms(userForms);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [userEmail]);
  const API_BASE1 = import.meta.env.VITE_API_BASE;

  const handleCopyLink = (formId: string) => {
    const link = `http://localhost:5173/viewForm/${formId}`;
    navigator.clipboard.writeText(link);
    setCopiedFormId(formId);
    setTimeout(() => setCopiedFormId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getResponseCountColor = (count: number) => {
    if (count === 0) return 'bg-secondary-subtle text-secondary';
    if (count < 10) return 'bg-info-subtle text-info';
    if (count < 50) return 'bg-primary-subtle text-primary';
    return 'bg-success-subtle text-success';
  };

  return (
    <>
      <style >{`
        .form-card {
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        .form-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
          border-color: #dee2e6;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .stats-card {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        .action-btn {
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .action-btn:hover {
          transform: translateY(-1px);
        }
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        .form-title {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .table-hover tbody tr:hover {
          background-color: #f8f9ff;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
        .empty-state {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-12">
              <div className="form-card bg-white rounded-4 shadow-lg p-5 border-0 position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 w-25 h-100 gradient-bg opacity-10"></div>
                <div className="d-flex justify-content-between align-items-center position-relative">
                  <div>
                    <h1 className="display-5 fw-bold form-title mb-2">
                      <i className="bi bi-collection-fill me-3"></i>
                      My Forms Dashboard
                    </h1>
                    <p className="text-muted fs-5 mb-0">Create, manage, and analyze your form responses</p>
                  </div>
                  <div className="text-end">
                    <div className="stats-card rounded-4 px-4 py-3 text-center">
                      <div className="fs-2 fw-bold">{filteredForms.length}</div>
                      <div className="small opacity-90">Total Forms</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!loading && filteredForms.length > 0 && (
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="bg-white rounded-3 shadow-sm p-4 text-center form-card">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
                  <h5 className="fw-bold">{filteredForms.filter(f => f.isActive).length}</h5>
                  <p className="text-muted mb-0">Active Forms</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="bg-white rounded-3 shadow-sm p-4 text-center form-card">
                  <i className="bi bi-bar-chart-fill text-primary fs-1 mb-2"></i>
                  <h5 className="fw-bold">{filteredForms.reduce((sum, form) => sum + form.responseCount, 0)}</h5>
                  <p className="text-muted mb-0">Total Responses</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="bg-white rounded-3 shadow-sm p-4 text-center form-card">
                  <i className="bi bi-graph-up-arrow text-info fs-1 mb-2"></i>
                  <h5 className="fw-bold">
                    {filteredForms.length > 0 ? Math.round(filteredForms.reduce((sum, form) => sum + form.responseCount, 0) / filteredForms.length) : 0}
                  </h5>
                  <p className="text-muted mb-0">Avg. Responses</p>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="bg-white rounded-4 shadow-lg border-0 overflow-hidden">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-4" role="status" style={{ width: '4rem', height: '4rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="text-muted">Loading your forms...</h4>
                    <p className="text-muted">Please wait while we fetch your data</p>
                  </div>
                ) : filteredForms.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="bi bi-inbox display-1 empty-state"></i>
                    </div>
                    <h3 className="empty-state mb-3 fw-bold">No forms found</h3>
                    <p className="text-muted mb-4 fs-5">Ready to collect responses? Create your first form and start gathering valuable feedback!</p>
                    <Link to="/createForm" className="btn btn-lg px-5 py-3 rounded-pill shadow-lg action-btn" 
                          style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', border: 'none', color: 'white' }}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Your First Form
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="d-none d-lg-block">
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="fw-bold text-dark mb-0">Your Forms</h4>
                          <Link to="/createForm" className="btn btn-primary rounded-pill px-4 action-btn">
                            <i className="bi bi-plus-circle me-2"></i>New Form
                          </Link>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                <th className="border-0 fw-bold text-dark py-4 ps-4 rounded-start">Form Details</th>
                                <th className="border-0 fw-bold text-dark py-4 text-center">Responses</th>
                                <th className="border-0 fw-bold text-dark py-4 text-center">Status</th>
                                <th className="border-0 fw-bold text-dark py-4 text-center rounded-end">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredForms.map((form, index) => (
                                <tr key={form._id} className="border-bottom" style={{ animationDelay: `${index * 0.1}s` }}>
                                  <td className="py-4 ps-4">
                                    <div className="d-flex align-items-center">
                                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                        <i className="bi bi-file-earmark-text text-primary fs-5"></i>
                                      </div>
                                      <div>
                                        <h6 className="mb-1 fw-bold text-dark">{form.title}</h6>
                                        <p className="text-muted mb-1">{form.description}</p>
                                        <small className="text-muted">
                                          <i className="bi bi-calendar3 me-1"></i>
                                          Created {formatDate(form.createdAt)}
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 text-center">
                                    <span className={`badge fs-6 px-3 py-2 rounded-pill ${getResponseCountColor(form.responseCount)}`}>
                                      <i className="bi bi-bar-chart me-1"></i>
                                      {form.responseCount}
                                    </span>
                                  </td>
                                  <td className="py-4 text-center">
                                    <span className={`badge fs-6 px-3 py-2 rounded-pill ${form.isActive ? 'bg-success text-white pulse-animation' : 'bg-warning text-dark'}`}>
                                      <i className={`bi ${form.isActive ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'} me-1`}></i>
                                      {form.isActive ? 'Active' : 'Paused'}
                                    </span>
                                  </td>
                                  <td className="py-4">
                                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                                      <Link 
                                        className="btn btn-outline-primary btn-sm rounded-pill action-btn px-3" 
                                        to={`/viewForm/${form.formId}`}
                                        title="View Form"
                                      >
                                        <i className="bi bi-eye me-1"></i>View
                                      </Link>
                                      <Link 
                                        className="btn btn-outline-info btn-sm rounded-pill action-btn px-3" 
                                        to={`/viewResponse/${form.formId}`}
                                        title="View Responses"
                                      >
                                        <i className="bi bi-graph-up me-1"></i>Analytics
                                      </Link>
                                      <Link 
                                        className="btn btn-outline-secondary btn-sm rounded-pill action-btn px-3" 
                                        to={`/version/${form.formId}`}
                                        title="View Versions"
                                      >
                                        <i className="bi bi-clock-history me-1"></i>History
                                      </Link>
                                      <button
                                        className={`btn btn-sm ${copiedFormId === form.formId ? 'btn-success' : 'btn-outline-success'}`}
                                        style={{ backgroundColor: copiedFormId === form.formId ? '' : 'transparent' }}
                                        onClick={() => handleCopyLink(form.formId)}
                                        title="Copy Share Link"
                                      >
                                        Copy Link
                                        <i className={`bi ${copiedFormId === form.formId ? 'bi-check' : 'bi-share'}`}></i>
                                      </button>

                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="d-lg-none p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold text-dark mb-0">Your Forms</h4>
                        <Link to="/createForm" className="btn btn-primary rounded-pill px-3 action-btn">
                          <i className="bi bi-plus-circle"></i>
                        </Link>
                      </div>
                      {filteredForms.map((form, index) => (
                        <div key={form._id} className="form-card mb-4 border-0 shadow-sm rounded-4 overflow-hidden" 
                             style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="card-body p-4">
                            <div className="d-flex align-items-start mb-3">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 flex-shrink-0">
                                <i className="bi bi-file-earmark-text text-primary"></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="card-title fw-bold mb-1">{form.title}</h6>
                                <p className="card-text text-muted small mb-2">{form.description}</p>
                                <small className="text-muted">
                                  <i className="bi bi-calendar3 me-1"></i>
                                  {formatDate(form.createdAt)}
                                </small>
                              </div>
                              <span className={`badge rounded-pill ${form.isActive ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {form.isActive ? 'Active' : 'Paused'}
                              </span>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <span className={`badge rounded-pill px-3 py-2 ${getResponseCountColor(form.responseCount)}`}>
                                <i className="bi bi-bar-chart me-1"></i>
                                {form.responseCount} Response{form.responseCount !== 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="d-grid gap-2">
                              <div className="row g-2">
                                <div className="col-6">
                                  <Link 
                                    className="btn btn-outline-primary btn-sm w-100 rounded-pill action-btn" 
                                    to={`/viewForm/${form.formId}`}
                                  >
                                    <i className="bi bi-eye me-1"></i>View
                                  </Link>
                                </div>
                                <div className="col-6">
                                  <Link 
                                    className="btn btn-outline-info btn-sm w-100 rounded-pill action-btn" 
                                    to={`/viewResponse/${form.formId}`}
                                  >
                                    <i className="bi bi-graph-up me-1"></i>Analytics
                                  </Link>
                                </div>
                              </div>
                              <div className="row g-2">
                                <div className="col-6">
                                  <Link 
                                    className="btn btn-outline-secondary btn-sm w-100 rounded-pill action-btn" 
                                    to={`/version/${form.formId}`}
                                  >
                                    <i className="bi bi-clock-history me-1"></i>History
                                  </Link>
                                </div>
                                <div className="col-6">
                                <button
                                  className={`btn btn-sm ${copiedFormId === form.formId ? 'btn-success' : 'btn-outline-success'}`}
                                  style={{ backgroundColor: 'transparent' }}
                                  onClick={() => handleCopyLink(form.formId)}
                                  title="Copy Share Link"
                                >
                                  Copy Link
                                  <i className={`bi ${copiedFormId === form.formId ? 'bi-check' : 'bi-share'}`}></i>
                                </button>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GetForm;