import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const FormVersionControl = ({ formId }) => {
    const params = useParams();
    const currentFormId = formId || params.id;
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const fetchVersions = async () => {
        if (!currentFormId)
            return;
        try {
            const response = await fetch(`http://localhost:5000/api/forms/${currentFormId}/versions`);
            const data = await response.json();
            if (data.success && data.versions) {
                setVersions(data.versions);
                const active = data.versions.find(v => v.isActive) || data.versions[0];
                setSelectedVersion(active);
            }
        }
        catch (error) {
            console.error('Error fetching versions:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchVersions();
    }, [currentFormId]);
    const setAsActive = async (version) => {
        try {
            const res = await fetch(`http://localhost:5000/api/forms/${currentFormId}/versions/${version}/activate`, { method: 'PATCH' });
            const data = await res.json();
            if (data.success) {
                alert(`Version ${version} is now active`);
                fetchVersions();
            }
            else {
                alert(data.message || 'Failed to set version as active');
            }
        }
        catch (error) {
            console.error('Error setting version as active:', error);
        }
    };
    return (_jsxs("div", { className: "p-4", children: [loading && _jsx("p", { children: "Loading..." }), !loading && selectedVersion && (_jsxs("div", { className: "border rounded p-4 shadow mb-4", children: [_jsxs("h2", { className: "text-xl font-semibold mb-2", children: ["Version ", selectedVersion.version, ' ', selectedVersion.isActive && _jsx("span", { className: "text-green-600", children: "(Active)" })] }), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "Title:" }), " ", selectedVersion.title] }), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "Description:" }), " ", selectedVersion.description] }), _jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "Fields:" }), _jsx("ul", { className: "list-disc ml-5", children: selectedVersion.fields.map((field) => (_jsxs("li", { children: [field.label, " (", field.type, ") ", field.required && '*'] }, field.id))) })] }), _jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "Settings:" }), _jsx("pre", { className: "bg-gray-100 p-2 rounded", children: JSON.stringify(selectedVersion.settings, null, 2) })] })] })), !loading && versions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-3", children: versions.map((version) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setSelectedVersion(version), className: `px-4 py-2 rounded border ${selectedVersion?.version === version.version
                                ? 'bg-blue-600 text-white'
                                : 'bg-white hover:bg-gray-100'}`, children: ["v", version.version] }), !version.isActive && (_jsx("button", { onClick: () => setAsActive(version.version), className: "text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600", children: "Set as Active" })), _jsx(Link, { to: `/edit/${currentFormId}`, children: "Edit" })] }, version.version))) }))] }));
};
export default FormVersionControl;
