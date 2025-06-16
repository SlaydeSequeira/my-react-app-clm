import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
const ViewForm = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [initialVersion, setInitialVersion] = useState(null); // ✅ Track initial version
    const [answers, setAnswers] = useState({});
    useEffect(() => {
        if (!id)
            return;
        fetch(`http://localhost:5000/api/forms/${id}`)
            .then((response) => response.json())
            .then((json) => {
            if (json.success && json.form) {
                setForm(json.form);
                setInitialVersion(json.form.version); // ✅ Store initial version
                console.log(json);
            }
        })
            .catch((error) => console.error("Error fetching data:", error));
    }, [id]);
    const handleChange = (fieldId, value) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form || !id || initialVersion === null)
            return;
        try {
            // ✅ Re-fetch the form before submitting
            const latestRes = await fetch(`http://localhost:5000/api/forms/${id}`);
            const latestJson = await latestRes.json();
            if (!latestJson.success || !latestJson.form) {
                alert("Unable to validate form version.");
                return;
            }
            // ✅ Compare version
            if (latestJson.form.version !== initialVersion) {
                alert("The form was edited. Please contact the sender for the latest form or refresh the form.");
                return;
            }
            // ✅ Proceed with response submission
            const formIdentifier = form.formId || form._id;
            const responseBody = {
                formId: formIdentifier,
                userId: "user123",
                answers: Object.entries(answers).map(([fieldId, value]) => ({
                    fieldId,
                    value,
                })),
            };
            const res = await fetch("http://localhost:5000/api/responses/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(responseBody),
            });
            const data = await res.json();
            console.log("Response submitted:", data);
            alert("Response submitted successfully!");
        }
        catch (err) {
            console.error("Submission error:", err);
            alert("Submission failed!");
        }
    };
    return (_jsx("div", { className: "max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8", children: form ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: form.title }), _jsx("p", { className: "text-gray-600 mb-6", children: form.description }), _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [form.fields.map((field) => (_jsxs("div", { className: "flex flex-col", children: [_jsxs("label", { className: "font-medium text-gray-700 mb-1", children: [field.label, " ", field.required && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: field.type, placeholder: field.placeholder, required: field.required, onChange: (e) => handleChange(field.id, e.target.value), className: "border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }, field.id))), _jsx("button", { type: "submit", className: "mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700", children: "Submit" })] })] })) : (_jsx("p", { children: "Loading..." })) }));
};
export default ViewForm;
