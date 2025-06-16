import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewResponse.css";
const ViewResponse = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedResponseId, setSelectedResponseId] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        const fetchFormAndResponses = async () => {
            try {
                const formRes = await fetch(`http://localhost:5000/api/forms/${id}`);
                const formJson = await formRes.json();
                if (formJson.success)
                    setForm(formJson.form);
                const resRes = await fetch(`http://localhost:5000/api/responses/${id}`);
                const resJson = await resRes.json();
                if (resJson.success)
                    setResponses(resJson.responses);
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchFormAndResponses();
    }, [id]);
    const getFieldLabel = (fieldId) => {
        return form?.fields.find((f) => f.id === fieldId)?.label || fieldId;
    };
    const allFieldIds = Array.from(new Set(responses.flatMap((response) => response.answers.map((ans) => ans.fieldId))));
    const handleDelete = async () => {
        if (!selectedResponseId)
            return;
        try {
            const res = await fetch(`http://localhost:5000/api/responses/${selectedResponseId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setResponses((prev) => prev.filter((r) => r._id !== selectedResponseId));
                setShowModal(false);
                setSelectedResponseId(null);
            }
            else {
                alert("Failed to delete response");
            }
        }
        catch (error) {
            console.error("Error deleting response:", error);
            alert("Something went wrong");
        }
    };
    const openDeleteModal = (responseId) => {
        setSelectedResponseId(responseId);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedResponseId(null);
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { className: "form-title", children: form?.title || "Form Responses" }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "response-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "#" }), allFieldIds.map((fieldId) => (_jsx("th", { children: getFieldLabel(fieldId) }, fieldId))), _jsx("th", { children: "Submitted At" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: responses.map((response, index) => (_jsxs("tr", { children: [_jsx("td", { children: index + 1 }), allFieldIds.map((fieldId) => {
                                        const answer = response.answers.find((ans) => ans.fieldId === fieldId);
                                        const value = Array.isArray(answer?.value)
                                            ? answer?.value.join(", ")
                                            : answer?.value ?? "";
                                        return _jsx("td", { children: value }, fieldId);
                                    }), _jsx("td", { children: new Date(response.submittedAt).toLocaleString() }), _jsx("td", { children: _jsx("button", { className: "delete-button", onClick: () => openDeleteModal(response._id), children: "Delete" }) })] }, response._id))) })] }) }), showModal && (_jsx("div", { className: "modal-backdrop", children: _jsxs("div", { className: "modal", children: [_jsx("p", { children: "Are you sure you want to delete this response?" }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { className: "cancel-button", onClick: closeModal, children: "Cancel" }), _jsx("button", { className: "confirm-button", onClick: handleDelete, children: "Confirm" })] })] }) }))] }));
};
export default ViewResponse;
