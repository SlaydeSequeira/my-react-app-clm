import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
type Field = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
};

type Settings = {
  allowMultipleResponses: boolean;
  collectEmail: boolean;
  showProgressBar: boolean;
  confirmationMessage: string;
  requireSignIn: boolean;
};

type FormVersion = {
  formId: string;
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
};

type ApiResponse = {
  success: boolean;
  versions?: FormVersion[];
  message?: string;
};

const FormVersionControl = ({ formId }: { formId?: string }) => {
  const params = useParams<{ id: string }>();
  const currentFormId = formId || params.id;

  const [versions, setVersions] = useState<FormVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<FormVersion | null>(null);

  const fetchVersions = async () => {
    if (!currentFormId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/forms/${currentFormId}/versions`);
      const data: ApiResponse = await response.json();
      if (data.success && data.versions) {
        setVersions(data.versions);
        const active = data.versions.find(v => v.isActive) || data.versions[0];
        setSelectedVersion(active);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [currentFormId]);

  const setAsActive = async (version: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/forms/${currentFormId}/versions/${version}/activate`,
        { method: 'PATCH' }
      );
      const data = await res.json();
      if (data.success) {
        alert(`Version ${version} is now active`);
        fetchVersions(); 
      } else {
        alert(data.message || 'Failed to set version as active');
      }
    } catch (error) {
      console.error('Error setting version as active:', error);
    }
  };

  return (
    <div className="p-4">
      {loading && <p>Loading...</p>}

      {!loading && selectedVersion && (
        <div className="border rounded p-4 shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Version {selectedVersion.version}{' '}
            {selectedVersion.isActive && <span className="text-green-600">(Active)</span>}
          </h2>
          <p className="mb-2"><strong>Title:</strong> {selectedVersion.title}</p>
          <p className="mb-2"><strong>Description:</strong> {selectedVersion.description}</p>
          <div className="mb-2">
            <strong>Fields:</strong>
            <ul className="list-disc ml-5">
              {selectedVersion.fields.map((field) => (
                <li key={field.id}>
                  {field.label} ({field.type}) {field.required && '*'}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <strong>Settings:</strong>
            <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(selectedVersion.settings, null, 2)}</pre>
          </div>
        </div>
      )}

      {!loading && versions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {versions.map((version) => (
            <div key={version.version} className="flex items-center gap-2">
              <button
                onClick={() => setSelectedVersion(version)}
                className={`px-4 py-2 rounded border ${
                  selectedVersion?.version === version.version
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                v{version.version}
              </button>
              {!version.isActive && (
                <button
                  onClick={() => setAsActive(version.version)}
                  className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Set as Active
                </button>
                
              )}
                  <Link to={`/edit/${currentFormId}`}>Edit</Link>
                  </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormVersionControl;
