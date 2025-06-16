import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
  formId?: string; 
  _id: string;
  version: number;
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
  form: Form;
};

type FieldValue = string | string[];

type AnswerMap = Record<string, FieldValue>;

const ViewForm = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [initialVersion, setInitialVersion] = useState<number | null>(null); // ✅ Track initial version
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    if (!id) return;
    const API_BASE1 = import.meta.env.VITE_API_BASE;

    fetch(`${API_BASE1}/api/forms/${id}`)
      .then((response) => response.json())
      .then((json: ApiResponse) => {
        if (json.success && json.form) {
          setForm(json.form);
          setInitialVersion(json.form.version); // ✅ Store initial version
          console.log(json);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  const handleChange = (fieldId: string, value: FieldValue) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id || initialVersion === null) return;
    const API_BASE1 = import.meta.env.VITE_API_BASE;

    try {
      // ✅ Re-fetch the form before submitting
      const latestRes = await fetch(`${API_BASE1}/api/forms/${id}`);
      const latestJson: ApiResponse = await latestRes.json();

      if (!latestJson.success || !latestJson.form) {
        alert("Unable to validate form version.");
        return;
      }

      // ✅ Compare version
      if (latestJson.form.version !== initialVersion) {
        alert(
          "The form was edited. Please contact the sender for the latest form or refresh the form."
        );
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
      const API_BASE1 = import.meta.env.VITE_API_BASE;

      const res = await fetch(`${API_BASE1}/api/responses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseBody),
      });

      const data = await res.json();
      console.log("Response submitted:", data);
      alert("Response submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      {form ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
          <p className="text-gray-600 mb-6">{form.description}</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {form.fields.map((field) => (
              <div key={field.id} className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewForm;