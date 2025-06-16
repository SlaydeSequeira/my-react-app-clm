import { useState } from 'react';
import type { ChangeEvent } from 'react';
import './createForm.css';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import dotenv from 'dotenv';
dotenv.config();
interface Field {
  id: string;
  type: 'text' | 'email';
  label: string;
  placeholder: string;
  required: boolean;
}

interface FormSettings {
  allowMultipleResponses: boolean;
  collectEmail: boolean;
  showProgressBar: boolean;
  confirmationMessage: string;
  requireSignIn: boolean;
}

interface FormData {
  title: string;
  description: string;
  fields: Field[];
  settings: FormSettings;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  responseCount?: number;
}

function CreateForm() {
  const userEmail = useSelector((state: RootState) => state.auth.user?.email || '');
  const [form, setForm] = useState<FormData>({
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('settings.')) {
      const key = name.split('.')[1] as keyof FormSettings;

      setForm((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [key]: type === 'checkbox' && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFieldChange = (
    index: number,
    key: keyof Field,
    value: string | boolean
  ) => {
    const updatedFields = [...form.fields];
    updatedFields[index][key] = value as never;
    setForm((prev) => ({
      ...prev,
      fields: updatedFields,
    }));
  };

  const handleAddField = () => {
    const newField: Field = {
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

  const handleRemoveField = (index: number) => {
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

    const payload: FormData = {
      ...form,
      createdBy: userEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      responseCount: 0,
    };

const API_BASE1 = import.meta.env.VITE_API_BASE;
    try {
      const res = await fetch(`${API_BASE1}/api/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Form created:', data);
      alert('Form created successfully!');
    } catch (err) {
      console.error('Failed to create form:', err);
      alert('Failed to create form');
    }
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      <h2>Create Form</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      <br />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <br />
      <h3>Fields</h3>
      {form.fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
          </select>
          <input
            type="text"
            placeholder="Label"
            value={field.label}
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
          />
          <input
            type="text"
            placeholder="Placeholder"
            value={field.placeholder}
            onChange={(e) => handleFieldChange(index, 'placeholder', e.target.value)}
          />
          <label>
            Required?
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
            />
          </label>
          <button onClick={() => handleRemoveField(index)} style={{ marginLeft: '10px' }}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddField}>Add Field</button>
      <h3>Settings</h3>
      <label>
        Allow Multiple Responses
        <input
          type="checkbox"
          name="settings.allowMultipleResponses"
          checked={form.settings.allowMultipleResponses}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Collect Email
        <input
          type="checkbox"
          name="settings.collectEmail"
          checked={form.settings.collectEmail}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Show Progress Bar
        <input
          type="checkbox"
          name="settings.showProgressBar"
          checked={form.settings.showProgressBar}
          onChange={handleChange}
        />
      </label>
      <br />
      <input
        type="text"
        name="settings.confirmationMessage"
        placeholder="Confirmation Message"
        value={form.settings.confirmationMessage}
        onChange={handleChange}
      />
      <br />
      <label>
        Require Sign In
        <input
          type="checkbox"
          name="settings.requireSignIn"
          checked={form.settings.requireSignIn}
          onChange={handleChange}
        />
      </label>
      <br />
      <button onClick={handleSubmit}>Submit Form</button>
    </div>
  );
}

export default CreateForm;
