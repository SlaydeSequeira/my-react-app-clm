import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const EditFormPage = () => {
    const email = useSelector((state) => state.auth.user?.email);
    const formId = useParams().id;
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        fields: [],
        settings: {
            allowMultipleResponses: false,
            collectEmail: true,
            showProgressBar: true,
            confirmationMessage: "",
            requireSignIn: false
        },
        createdBy: `${email}`
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchFormData = async () => {
            if (!formId) {
                setError('Form ID is required');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/forms/${formId}`);
                const result = await response.json();
                if (result.success && result.form) {
                    const form = result.form;
                    setFormData({
                        title: form.title,
                        description: form.description,
                        fields: form.fields,
                        settings: form.settings,
                        createdBy: form.createdBy
                    });
                }
                else {
                    setError(result.message || 'Failed to fetch form data');
                }
            }
            catch (err) {
                console.error('Error fetching form data:', err);
                setError('Failed to load form data');
            }
            finally {
                setLoading(false);
            }
        };
        fetchFormData();
    }, [formId]);
    const handleFieldChange = (index, key, value) => {
        const updatedFields = [...formData.fields];
        updatedFields[index] = { ...updatedFields[index], [key]: value };
        setFormData({ ...formData, fields: updatedFields });
    };
    const handleValidationChange = (index, key, value) => {
        const updatedFields = [...formData.fields];
        updatedFields[index] = {
            ...updatedFields[index],
            validation: {
                ...updatedFields[index].validation,
                [key]: value
            }
        };
        setFormData({ ...formData, fields: updatedFields });
    };
    const handleOptionsChange = (index, optionsText) => {
        const updatedFields = [...formData.fields];
        const options = optionsText.split('\n').filter(opt => opt.trim() !== '');
        updatedFields[index] = { ...updatedFields[index], options };
        setFormData({ ...formData, fields: updatedFields });
    };
    const handleFormChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };
    const handleSettingsChange = (key, value) => {
        setFormData({
            ...formData,
            settings: { ...formData.settings, [key]: value }
        });
    };
    const addField = () => {
        const newField = {
            id: `field_${Date.now()}`,
            type: 'text',
            label: 'New Field',
            placeholder: 'Enter value',
            required: false
        };
        setFormData({
            ...formData,
            fields: [...formData.fields, newField]
        });
    };
    const removeField = (index) => {
        const updatedFields = formData.fields.filter((_, i) => i !== index);
        setFormData({ ...formData, fields: updatedFields });
    };
    const handleSubmit = async () => {
        setSaving(true);
        setError(null);
        console.log('Form data to be submitted:', JSON.stringify(formData, null, 2));
        try {
            const res = await fetch(`http://localhost:5000/api/forms/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (result.success) {
                alert(`Form updated as version ${result.form.version}`);
            }
            else {
                alert(result.message || 'Update failed');
                setError(result.message || 'Update failed');
            }
        }
        catch (err) {
            console.error('Update error:', err);
            const errorMessage = 'Failed to update form';
            alert(errorMessage);
            setError(errorMessage);
        }
        finally {
            setSaving(false);
        }
    };
    const fieldRequiresOptions = (type) => {
        return ['select', 'radio', 'checkbox'].includes(type);
    };
    const fieldSupportsValidation = (type) => {
        return ['number', 'date'].includes(type);
    };
    if (loading) {
        return (_jsx("div", { children: _jsx("div", { children: _jsx("div", { children: "Loading form data..." }) }) }));
    }
    if (error) {
        return (_jsx("div", { children: _jsxs("div", { children: [_jsx("div", { children: "Error" }), _jsx("div", { children: error })] }) }));
    }
    return (_jsxs("div", { children: [_jsx("h2", { children: "Edit Form" }), _jsxs("div", { children: [_jsx("h3", { children: "Form Details" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => handleFormChange('title', e.target.value), placeholder: "Form Title" }), _jsx("textarea", { value: formData.description, onChange: (e) => handleFormChange('description', e.target.value), placeholder: "Form Description", rows: 3 })] }), _jsxs("div", { children: [_jsxs("div", { children: [_jsx("h3", { children: "Form Fields" }), _jsx("button", { onClick: addField, children: "Add Field" })] }), formData.fields.map((field, index) => (_jsxs("div", { children: [_jsxs("div", { children: [_jsxs("span", { children: ["Field ", index + 1] }), _jsx("button", { onClick: () => removeField(index), children: "Remove" })] }), _jsxs("div", { children: [_jsx("input", { type: "text", value: field.label, onChange: (e) => handleFieldChange(index, 'label', e.target.value), placeholder: "Field Label" }), _jsx("input", { type: "text", value: field.placeholder, onChange: (e) => handleFieldChange(index, 'placeholder', e.target.value), placeholder: "Placeholder Text" })] }), _jsxs("div", { children: [_jsxs("select", { value: field.type, onChange: (e) => handleFieldChange(index, 'type', e.target.value), children: [_jsx("option", { value: "text", children: "Text" }), _jsx("option", { value: "email", children: "Email" }), _jsx("option", { value: "number", children: "Number" }), _jsx("option", { value: "textarea", children: "Textarea" }), _jsx("option", { value: "select", children: "Select" }), _jsx("option", { value: "radio", children: "Radio" }), _jsx("option", { value: "checkbox", children: "Checkbox" }), _jsx("option", { value: "date", children: "Date" })] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: field.required, onChange: (e) => handleFieldChange(index, 'required', e.target.checked) }), "Required"] })] }), fieldRequiresOptions(field.type) && (_jsxs("div", { children: [_jsx("label", { children: "Options (one per line):" }), _jsx("textarea", { value: field.options?.join('\n') || '', onChange: (e) => handleOptionsChange(index, e.target.value), placeholder: "Option 1\nOption 2\nOption 3", rows: 3 })] })), fieldSupportsValidation(field.type) && (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("label", { children: "Min Value:" }), _jsx("input", { type: "number", value: field.validation?.min || '', onChange: (e) => handleValidationChange(index, 'min', parseInt(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { children: "Max Value:" }), _jsx("input", { type: "number", value: field.validation?.max || '', onChange: (e) => handleValidationChange(index, 'max', parseInt(e.target.value)) })] })] }))] }, field.id)))] }), _jsxs("div", { children: [_jsx("h3", { children: "Form Settings" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: formData.settings.allowMultipleResponses, onChange: (e) => handleSettingsChange('allowMultipleResponses', e.target.checked) }), "Allow Multiple Responses"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: formData.settings.collectEmail, onChange: (e) => handleSettingsChange('collectEmail', e.target.checked) }), "Collect Email"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: formData.settings.showProgressBar, onChange: (e) => handleSettingsChange('showProgressBar', e.target.checked) }), "Show Progress Bar"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: formData.settings.requireSignIn, onChange: (e) => handleSettingsChange('requireSignIn', e.target.checked) }), "Require Sign In"] })] }), _jsxs("div", { children: [_jsx("label", { children: "Confirmation Message:" }), _jsx("textarea", { value: formData.settings.confirmationMessage, onChange: (e) => handleSettingsChange('confirmationMessage', e.target.value), placeholder: "Thank you message after form submission", rows: 2 })] })] }), _jsx("div", { children: _jsx("button", { onClick: handleSubmit, disabled: saving, children: saving ? 'Saving...' : 'Save & Create New Version' }) })] }));
};
export default EditFormPage;
