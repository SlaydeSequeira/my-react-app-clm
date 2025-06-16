import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
function GetForm() {
    const userEmail = useSelector((state) => state.auth.user?.email || '');
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedFormId, setCopiedFormId] = useState(null);
    useEffect(() => {
        fetch('http://localhost:5000/api/forms')
            .then((response) => response.json())
            .then((json) => {
            const userForms = json.forms.filter((form) => form.createdBy === userEmail);
            setFilteredForms(userForms);
            setLoading(false);
        })
            .catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    }, [userEmail]);
    const handleCopyLink = (formId) => {
        const link = `http://localhost:5173/viewForm/${formId}`;
        navigator.clipboard.writeText(link);
        setCopiedFormId(formId);
        setTimeout(() => setCopiedFormId(null), 2000);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getResponseCountColor = (count) => {
        if (count === 0)
            return 'bg-secondary-subtle text-secondary';
        if (count < 10)
            return 'bg-info-subtle text-info';
        if (count < 50)
            return 'bg-primary-subtle text-primary';
        return 'bg-success-subtle text-success';
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
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
      ` }), _jsx("div", { className: "min-vh-100", style: { background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }, children: _jsxs("div", { className: "container py-5", children: [_jsx("div", { className: "row mb-5", children: _jsx("div", { className: "col-12", children: _jsxs("div", { className: "form-card bg-white rounded-4 shadow-lg p-5 border-0 position-relative overflow-hidden", children: [_jsx("div", { className: "position-absolute top-0 end-0 w-25 h-100 gradient-bg opacity-10" }), _jsxs("div", { className: "d-flex justify-content-between align-items-center position-relative", children: [_jsxs("div", { children: [_jsxs("h1", { className: "display-5 fw-bold form-title mb-2", children: [_jsx("i", { className: "bi bi-collection-fill me-3" }), "My Forms Dashboard"] }), _jsx("p", { className: "text-muted fs-5 mb-0", children: "Create, manage, and analyze your form responses" })] }), _jsx("div", { className: "text-end", children: _jsxs("div", { className: "stats-card rounded-4 px-4 py-3 text-center", children: [_jsx("div", { className: "fs-2 fw-bold", children: filteredForms.length }), _jsx("div", { className: "small opacity-90", children: "Total Forms" })] }) })] })] }) }) }), !loading && filteredForms.length > 0 && (_jsxs("div", { className: "row mb-4", children: [_jsx("div", { className: "col-md-4 mb-3", children: _jsxs("div", { className: "bg-white rounded-3 shadow-sm p-4 text-center form-card", children: [_jsx("i", { className: "bi bi-check-circle-fill text-success fs-1 mb-2" }), _jsx("h5", { className: "fw-bold", children: filteredForms.filter(f => f.isActive).length }), _jsx("p", { className: "text-muted mb-0", children: "Active Forms" })] }) }), _jsx("div", { className: "col-md-4 mb-3", children: _jsxs("div", { className: "bg-white rounded-3 shadow-sm p-4 text-center form-card", children: [_jsx("i", { className: "bi bi-bar-chart-fill text-primary fs-1 mb-2" }), _jsx("h5", { className: "fw-bold", children: filteredForms.reduce((sum, form) => sum + form.responseCount, 0) }), _jsx("p", { className: "text-muted mb-0", children: "Total Responses" })] }) }), _jsx("div", { className: "col-md-4 mb-3", children: _jsxs("div", { className: "bg-white rounded-3 shadow-sm p-4 text-center form-card", children: [_jsx("i", { className: "bi bi-graph-up-arrow text-info fs-1 mb-2" }), _jsx("h5", { className: "fw-bold", children: filteredForms.length > 0 ? Math.round(filteredForms.reduce((sum, form) => sum + form.responseCount, 0) / filteredForms.length) : 0 }), _jsx("p", { className: "text-muted mb-0", children: "Avg. Responses" })] }) })] })), _jsx("div", { className: "row", children: _jsx("div", { className: "col-12", children: _jsx("div", { className: "bg-white rounded-4 shadow-lg border-0 overflow-hidden", children: loading ? (_jsxs("div", { className: "text-center py-5", children: [_jsx("div", { className: "spinner-border text-primary mb-4", role: "status", style: { width: '4rem', height: '4rem' }, children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }), _jsx("h4", { className: "text-muted", children: "Loading your forms..." }), _jsx("p", { className: "text-muted", children: "Please wait while we fetch your data" })] })) : filteredForms.length === 0 ? (_jsxs("div", { className: "text-center py-5", children: [_jsx("div", { className: "mb-4", children: _jsx("i", { className: "bi bi-inbox display-1 empty-state" }) }), _jsx("h3", { className: "empty-state mb-3 fw-bold", children: "No forms found" }), _jsx("p", { className: "text-muted mb-4 fs-5", children: "Ready to collect responses? Create your first form and start gathering valuable feedback!" }), _jsxs(Link, { to: "/createForm", className: "btn btn-lg px-5 py-3 rounded-pill shadow-lg action-btn", style: { background: 'linear-gradient(45deg, #667eea, #764ba2)', border: 'none', color: 'white' }, children: [_jsx("i", { className: "bi bi-plus-circle me-2" }), "Create Your First Form"] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "d-none d-lg-block", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "d-flex justify-content-between align-items-center mb-4", children: [_jsx("h4", { className: "fw-bold text-dark mb-0", children: "Your Forms" }), _jsxs(Link, { to: "/createForm", className: "btn btn-primary rounded-pill px-4 action-btn", children: [_jsx("i", { className: "bi bi-plus-circle me-2" }), "New Form"] })] }), _jsx("div", { className: "table-responsive", children: _jsxs("table", { className: "table table-hover mb-0", children: [_jsx("thead", { children: _jsxs("tr", { style: { background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }, children: [_jsx("th", { className: "border-0 fw-bold text-dark py-4 ps-4 rounded-start", children: "Form Details" }), _jsx("th", { className: "border-0 fw-bold text-dark py-4 text-center", children: "Responses" }), _jsx("th", { className: "border-0 fw-bold text-dark py-4 text-center", children: "Status" }), _jsx("th", { className: "border-0 fw-bold text-dark py-4 text-center rounded-end", children: "Actions" })] }) }), _jsx("tbody", { children: filteredForms.map((form, index) => (_jsxs("tr", { className: "border-bottom", style: { animationDelay: `${index * 0.1}s` }, children: [_jsx("td", { className: "py-4 ps-4", children: _jsxs("div", { className: "d-flex align-items-center", children: [_jsx("div", { className: "bg-primary bg-opacity-10 rounded-circle p-3 me-3", children: _jsx("i", { className: "bi bi-file-earmark-text text-primary fs-5" }) }), _jsxs("div", { children: [_jsx("h6", { className: "mb-1 fw-bold text-dark", children: form.title }), _jsx("p", { className: "text-muted mb-1", children: form.description }), _jsxs("small", { className: "text-muted", children: [_jsx("i", { className: "bi bi-calendar3 me-1" }), "Created ", formatDate(form.createdAt)] })] })] }) }), _jsx("td", { className: "py-4 text-center", children: _jsxs("span", { className: `badge fs-6 px-3 py-2 rounded-pill ${getResponseCountColor(form.responseCount)}`, children: [_jsx("i", { className: "bi bi-bar-chart me-1" }), form.responseCount] }) }), _jsx("td", { className: "py-4 text-center", children: _jsxs("span", { className: `badge fs-6 px-3 py-2 rounded-pill ${form.isActive ? 'bg-success text-white pulse-animation' : 'bg-warning text-dark'}`, children: [_jsx("i", { className: `bi ${form.isActive ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'} me-1` }), form.isActive ? 'Active' : 'Paused'] }) }), _jsx("td", { className: "py-4", children: _jsxs("div", { className: "d-flex gap-2 justify-content-center flex-wrap", children: [_jsxs(Link, { className: "btn btn-outline-primary btn-sm rounded-pill action-btn px-3", to: `/viewForm/${form.formId}`, title: "View Form", children: [_jsx("i", { className: "bi bi-eye me-1" }), "View"] }), _jsxs(Link, { className: "btn btn-outline-info btn-sm rounded-pill action-btn px-3", to: `/viewResponse/${form.formId}`, title: "View Responses", children: [_jsx("i", { className: "bi bi-graph-up me-1" }), "Analytics"] }), _jsxs(Link, { className: "btn btn-outline-secondary btn-sm rounded-pill action-btn px-3", to: `/version/${form.formId}`, title: "View Versions", children: [_jsx("i", { className: "bi bi-clock-history me-1" }), "History"] }), _jsxs("button", { className: `btn btn-sm ${copiedFormId === form.formId ? 'btn-success' : 'btn-outline-success'}`, style: { backgroundColor: copiedFormId === form.formId ? '' : 'transparent' }, onClick: () => handleCopyLink(form.formId), title: "Copy Share Link", children: ["Copy Link", _jsx("i", { className: `bi ${copiedFormId === form.formId ? 'bi-check' : 'bi-share'}` })] })] }) })] }, form._id))) })] }) })] }) }), _jsxs("div", { className: "d-lg-none p-4", children: [_jsxs("div", { className: "d-flex justify-content-between align-items-center mb-4", children: [_jsx("h4", { className: "fw-bold text-dark mb-0", children: "Your Forms" }), _jsx(Link, { to: "/createForm", className: "btn btn-primary rounded-pill px-3 action-btn", children: _jsx("i", { className: "bi bi-plus-circle" }) })] }), filteredForms.map((form, index) => (_jsx("div", { className: "form-card mb-4 border-0 shadow-sm rounded-4 overflow-hidden", style: { animationDelay: `${index * 0.1}s` }, children: _jsxs("div", { className: "card-body p-4", children: [_jsxs("div", { className: "d-flex align-items-start mb-3", children: [_jsx("div", { className: "bg-primary bg-opacity-10 rounded-circle p-3 me-3 flex-shrink-0", children: _jsx("i", { className: "bi bi-file-earmark-text text-primary" }) }), _jsxs("div", { className: "flex-grow-1", children: [_jsx("h6", { className: "card-title fw-bold mb-1", children: form.title }), _jsx("p", { className: "card-text text-muted small mb-2", children: form.description }), _jsxs("small", { className: "text-muted", children: [_jsx("i", { className: "bi bi-calendar3 me-1" }), formatDate(form.createdAt)] })] }), _jsx("span", { className: `badge rounded-pill ${form.isActive ? 'bg-success' : 'bg-warning text-dark'}`, children: form.isActive ? 'Active' : 'Paused' })] }), _jsx("div", { className: "d-flex justify-content-between align-items-center mb-4", children: _jsxs("span", { className: `badge rounded-pill px-3 py-2 ${getResponseCountColor(form.responseCount)}`, children: [_jsx("i", { className: "bi bi-bar-chart me-1" }), form.responseCount, " Response", form.responseCount !== 1 ? 's' : ''] }) }), _jsxs("div", { className: "d-grid gap-2", children: [_jsxs("div", { className: "row g-2", children: [_jsx("div", { className: "col-6", children: _jsxs(Link, { className: "btn btn-outline-primary btn-sm w-100 rounded-pill action-btn", to: `/viewForm/${form.formId}`, children: [_jsx("i", { className: "bi bi-eye me-1" }), "View"] }) }), _jsx("div", { className: "col-6", children: _jsxs(Link, { className: "btn btn-outline-info btn-sm w-100 rounded-pill action-btn", to: `/viewResponse/${form.formId}`, children: [_jsx("i", { className: "bi bi-graph-up me-1" }), "Analytics"] }) })] }), _jsxs("div", { className: "row g-2", children: [_jsx("div", { className: "col-6", children: _jsxs(Link, { className: "btn btn-outline-secondary btn-sm w-100 rounded-pill action-btn", to: `/version/${form.formId}`, children: [_jsx("i", { className: "bi bi-clock-history me-1" }), "History"] }) }), _jsx("div", { className: "col-6", children: _jsxs("button", { className: `btn btn-sm ${copiedFormId === form.formId ? 'btn-success' : 'btn-outline-success'}`, style: { backgroundColor: 'transparent' }, onClick: () => handleCopyLink(form.formId), title: "Copy Share Link", children: ["Copy Link", _jsx("i", { className: `bi ${copiedFormId === form.formId ? 'bi-check' : 'bi-share'}` })] }) })] })] })] }) }, form._id)))] })] })) }) }) })] }) })] }));
}
export default GetForm;
