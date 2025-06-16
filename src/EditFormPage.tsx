import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "./store";

type Field = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
  };
};

type Settings = {
  allowMultipleResponses: boolean;
  collectEmail: boolean;
  showProgressBar: boolean;
  confirmationMessage: string;
  requireSignIn: boolean;
};

type FormData = {
  title: string;
  description: string;
  fields: Field[];
  settings: Settings;
  createdBy: string;
};

const EditFormPage = () => {
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const formId = useParams<{ id: string }>().id;
  
  const [formData, setFormData] = useState<FormData>({
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        setError('Form ID is required');
        setLoading(false);
        return;
      }
      const API_BASE1 = import.meta.env.VITE_API_BASE;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE1}/api/forms/${formId}`);
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
        } else {
          setError(result.message || 'Failed to fetch form data');
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  const handleFieldChange = (index: number, key: keyof Field, value: any) => {
    const updatedFields = [...formData.fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleValidationChange = (index: number, key: 'min' | 'max', value: number) => {
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

  const handleOptionsChange = (index: number, optionsText: string) => {
    const updatedFields = [...formData.fields];
    const options = optionsText.split('\n').filter(opt => opt.trim() !== '');
    updatedFields[index] = { ...updatedFields[index], options };
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleFormChange = (key: keyof FormData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSettingsChange = (key: keyof Settings, value: any) => {
    setFormData({
      ...formData,
      settings: { ...formData.settings, [key]: value }
    });
  };

  const addField = () => {
    const newField: Field = {
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

  const removeField = (index: number) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    
    console.log('Form data to be submitted:', JSON.stringify(formData, null, 2));
    const API_BASE1 = import.meta.env.VITE_API_BASE;

    try {
      const res = await fetch(`${API_BASE1}/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        alert(`Form updated as version ${result.form.version}`);
      } else {
        alert(result.message || 'Update failed');
        setError(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = 'Failed to update form';
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const fieldRequiresOptions = (type: string) => {
    return ['select', 'radio', 'checkbox'].includes(type);
  };

  const fieldSupportsValidation = (type: string) => {
    return ['number', 'date'].includes(type);
  };

  if (loading) {
    return (
      <div>
        <div>
          <div>Loading form data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <div>Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Edit Form</h2>

      <div>
        <h3>Form Details</h3>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleFormChange('title', e.target.value)}
          placeholder="Form Title"
        />
        <textarea
          value={formData.description}
          onChange={(e) => handleFormChange('description', e.target.value)}
          placeholder="Form Description"
          rows={3}
        />
      </div>

      <div>
        <div>
          <h3>Form Fields</h3>
          <button
            onClick={addField}
          >
            Add Field
          </button>
        </div>

        {formData.fields.map((field, index) => (
          <div key={field.id}>
            <div>
              <span>Field {index + 1}</span>
              <button
                onClick={() => removeField(index)}
              >
                Remove
              </button>
            </div>
            
            <div>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                placeholder="Field Label"
              />
              <input
                type="text"
                value={field.placeholder}
                onChange={(e) => handleFieldChange(index, 'placeholder', e.target.value)}
                placeholder="Placeholder Text"
              />
            </div>

            <div>
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
              </select>
              
              <label>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                />
                Required
              </label>
            </div>

            {fieldRequiresOptions(field.type) && (
              <div>
                <label>
                  Options (one per line):
                </label>
                <textarea
                  value={field.options?.join('\n') || ''}
                  onChange={(e) => handleOptionsChange(index, e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={3}
                />
              </div>
            )}

            {fieldSupportsValidation(field.type) && (
              <div>
                <div>
                  <label>Min Value:</label>
                  <input
                    type="number"
                    value={field.validation?.min || ''}
                    onChange={(e) => handleValidationChange(index, 'min', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label>Max Value:</label>
                  <input
                    type="number"
                    value={field.validation?.max || ''}
                    onChange={(e) => handleValidationChange(index, 'max', parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h3>Form Settings</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={formData.settings.allowMultipleResponses}
              onChange={(e) => handleSettingsChange('allowMultipleResponses', e.target.checked)}
            />
            Allow Multiple Responses
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={formData.settings.collectEmail}
              onChange={(e) => handleSettingsChange('collectEmail', e.target.checked)}
            />
            Collect Email
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={formData.settings.showProgressBar}
              onChange={(e) => handleSettingsChange('showProgressBar', e.target.checked)}
            />
            Show Progress Bar
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={formData.settings.requireSignIn}
              onChange={(e) => handleSettingsChange('requireSignIn', e.target.checked)}
            />
            Require Sign In
          </label>
        </div>

        <div>
          <label>
            Confirmation Message:
          </label>
          <textarea
            value={formData.settings.confirmationMessage}
            onChange={(e) => handleSettingsChange('confirmationMessage', e.target.value)}
            placeholder="Thank you message after form submission"
            rows={2}
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save & Create New Version'}
        </button>
      </div>
    </div>
  );
};

export default EditFormPage;