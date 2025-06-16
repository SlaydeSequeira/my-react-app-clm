import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './createForm.css';
import { useSelector } from 'react-redux';
function CreateForm() {
    const userEmail = useSelector((state) => state.auth.user?.email || '');
    const [form, setForm] = useState({
        title: '',
        description: '',
        createdBy: '',
        fields: [],
        settings: {
            allowMultipleResponses: false,
            collectEmail: false,
            showProgressBar: false,
            confirmationMessage: '',
            requireSignIn: false,
        },
    });
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (name.startsWith('settings.')) {
            const key = name.split('.')[1];
            setForm((prev) => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [key]: type === 'checkbox' && e.target instanceof HTMLInputElement
                        ? e.target.checked
                        : value,
                },
            }));
        }
        else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleFieldChange = (index, key, value) => {
        const updatedFields = [...form.fields];
        updatedFields[index][key] = value;
        setForm((prev) => ({
            ...prev,
            fields: updatedFields,
        }));
    };
    const handleAddField = () => {
        const newField = {
            id: crypto.randomUUID(),
            type: 'text',
            label: '',
            placeholder: '',
            required: false,
        };
        setForm((prev) => ({
            ...prev,
            fields: [...prev.fields, newField],
        }));
    };
    const handleRemoveField = (index) => {
        const updatedFields = [...form.fields];
        updatedFields.splice(index, 1);
        setForm((prev) => ({
            ...prev,
            fields: updatedFields,
        }));
    };
    const handleSubmit = async () => {
        if (!userEmail) {
            alert('You must be logged in to create a form.');
            return;
        }
        const payload = {
            ...form,
            createdBy: userEmail,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            responseCount: 0,
        };
        try {
            const res = await fetch('http://localhost:5000/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            console.log('Form created:', data);
            alert('Form created successfully!');
        }
        catch (err) {
            console.error('Failed to create form:', err);
            alert('Failed to create form');
        }
    };
    return (_jsxs("div", { className: "card", style: { padding: '20px' }, children: [_jsx("h2", { children: "Create Form" }), _jsx("input", { type: "text", name: "title", placeholder: "Title", value: form.title, onChange: handleChange }), _jsx("br", {}), _jsx("textarea", { name: "description", placeholder: "Description", value: form.description, onChange: handleChange }), _jsx("br", {}), _jsx("h3", { children: "Fields" }), form.fields.map((field, index) => (_jsxs("div", { style: { marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }, children: [_jsxs("select", { value: field.type, onChange: (e) => handleFieldChange(index, 'type', e.target.value), children: [_jsx("option", { value: "text", children: "Text" }), _jsx("option", { value: "email", children: "Email" })] }), _jsx("input", { type: "text", placeholder: "Label", value: field.label, onChange: (e) => handleFieldChange(index, 'label', e.target.value) }), _jsx("input", { type: "text", placeholder: "Placeholder", value: field.placeholder, onChange: (e) => handleFieldChange(index, 'placeholder', e.target.value) }), _jsxs("label", { children: ["Required?", _jsx("input", { type: "checkbox", checked: field.required, onChange: (e) => handleFieldChange(index, 'required', e.target.checked) })] }), _jsx("button", { onClick: () => handleRemoveField(index), style: { marginLeft: '10px' }, children: "Remove" })] }, field.id))), _jsx("button", { onClick: handleAddField, children: "Add Field" }), _jsx("h3", { children: "Settings" }), _jsxs("label", { children: ["Allow Multiple Responses", _jsx("input", { type: "checkbox", name: "settings.allowMultipleResponses", checked: form.settings.allowMultipleResponses, onChange: handleChange })] }), _jsx("br", {}), _jsxs("label", { children: ["Collect Email", _jsx("input", { type: "checkbox", name: "settings.collectEmail", checked: form.settings.collectEmail, onChange: handleChange })] }), _jsx("br", {}), _jsxs("label", { children: ["Show Progress Bar", _jsx("input", { type: "checkbox", name: "settings.showProgressBar", checked: form.settings.showProgressBar, onChange: handleChange })] }), _jsx("br", {}), _jsx("input", { type: "text", name: "settings.confirmationMessage", placeholder: "Confirmation Message", value: form.settings.confirmationMessage, onChange: handleChange }), _jsx("br", {}), _jsxs("label", { children: ["Require Sign In", _jsx("input", { type: "checkbox", name: "settings.requireSignIn", checked: form.settings.requireSignIn, onChange: handleChange })] }), _jsx("br", {}), _jsx("button", { onClick: handleSubmit, children: "Submit Form" })] }));
}
export default CreateForm;
