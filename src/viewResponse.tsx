import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewResponse.css";

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
  _id: string;
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

type Answer = {
  fieldId: string;
  value: string | string[];
  _id: string;
};

type ResponseItem = {
  _id: string;
  formId: string;
  userId: string;
  answers: Answer[];
  submittedAt: string;
  __v: number;
};

type FormApiResponse = {
  success: boolean;
  form: Form;
};

type ResponseApiResponse = {
  success: boolean;
  responses: ResponseItem[];
};

const ViewResponse = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const API_BASE1 = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!id) return;
    const fetchFormAndResponses = async () => {
      try {
        const formRes = await fetch(`${API_BASE1}/api/forms/${id}`);
        const formJson: FormApiResponse = await formRes.json();
        if (formJson.success) setForm(formJson.form);

        const resRes = await fetch(`${API_BASE1}/api/responses/${id}`);
        const resJson: ResponseApiResponse = await resRes.json();
        if (resJson.success) setResponses(resJson.responses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFormAndResponses();
  }, [id]);

  const getFieldLabel = (fieldId: string): string => {
    return form?.fields.find((f) => f.id === fieldId)?.label || fieldId;
  };

  const allFieldIds = Array.from(
    new Set(responses.flatMap((response) => response.answers.map((ans) => ans.fieldId)))
  );

  const handleDelete = async () => {
    if (!selectedResponseId) return;
    try {
      const res = await fetch(`${API_BASE1}/api/responses/${selectedResponseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setResponses((prev) => prev.filter((r) => r._id !== selectedResponseId));
        setShowModal(false);
        setSelectedResponseId(null);
      } else {
        alert("Failed to delete response");
      }
    } catch (error) {
      console.error("Error deleting response:", error);
      alert("Something went wrong");
    }
  };

  const openDeleteModal = (responseId: string) => {
    setSelectedResponseId(responseId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResponseId(null);
  };

  return (
    <div className="container">
      <h2 className="form-title">{form?.title || "Form Responses"}</h2>
      <div className="table-container">
        <table className="response-table">
          <thead>
            <tr>
              <th>#</th>
              {allFieldIds.map((fieldId) => (
                <th key={fieldId}>{getFieldLabel(fieldId)}</th>
              ))}
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr key={response._id}>
                <td>{index + 1}</td>
                {allFieldIds.map((fieldId) => {
                  const answer = response.answers.find((ans) => ans.fieldId === fieldId);
                  const value = Array.isArray(answer?.value)
                    ? answer?.value.join(", ")
                    : answer?.value ?? "";
                  return <td key={fieldId}>{value}</td>;
                })}
                <td>{new Date(response.submittedAt).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => openDeleteModal(response._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this response?</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResponse;
