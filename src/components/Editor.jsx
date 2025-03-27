import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Editor.css";



const Editor = () => {
  const [text, setText] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [loadingDrive, setLoadingDrive] = useState(true);
  const [saving, setSaving] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("drafts")) || [];
    setDrafts(savedDrafts);
    setLoadingDrafts(false);
  }, []);

  useEffect(() => {
    const fetchDriveFiles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-drive-files`, {
          withCredentials: true,
        });
        
        
        // const response = await axios.get("http://localhost:5000/get-drive-files", { withCredentials: true });
        setDriveFiles(response.data.files || []);
      } catch (error) {
        console.error("Error fetching Letter files:", error);
      } finally {
        setLoadingDrive(false);
      }
    };

    fetchDriveFiles();
  }, []);

  const logout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  const handleSaveDraft = () => {
    setSaving(true);
    const newDraft = {
      id: uuidv4(),
      content: text,
      timestamp: new Date().toLocaleString(),
    };
    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    setTimeout(() => {
      setSaving(false);
      alert("Draft saved locally!");
    }, 500);
  };

  const handleEditDraft = (id) => {
    const draftToEdit = drafts.find((draft) => draft.id === id);
    if (draftToEdit) {
      setText(draftToEdit.content);
    }
  };

  const handleDeleteDraft = (id) => {
    const updatedDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
  };

  const saveToGoogleDrive = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/save-to-drive`,
        { content: `<h1>My Letter</h1><p>${text}</p>` },
        { withCredentials: true }
      );
      
      // const response = await axios.post(
      //   "http://localhost:5000/save-to-drive",
      //   { content: `<h1>My Letter</h1><p>${text}</p>` },
      //   { withCredentials: true }
      // );
      alert("Saved to Google Drive! File ID: " + response.data.fileId);
    } catch (error) {
      console.error("Error saving to Drive:", error);
      alert("Failed to save to Google Drive: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <h2>Hiii</h2>
      <h2>I am !</h2>
      <h2>Text Editor</h2>
      <button className="logout-btn" onClick={logout}>Logout</button>
      <ReactQuill value={text} onChange={setText} className="text-editor" />
      <div className="button-group">
        <button className="save-btn" onClick={handleSaveDraft} disabled={saving}>
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button className="drive-btn" onClick={saveToGoogleDrive} disabled={saving}>
          {saving ? "Saving to Drive..." : "Save to Google Drive"}
        </button>
      </div>

      <div className="saved-section">
        <div className="saved-column">
          <h3>Saved Drafts</h3>
          <div className="saved-drafts-list">
            {loadingDrafts ? (
              <p>Loading drafts...</p>
            ) : drafts.length > 0 ? (
              drafts.map((draft) => (
                <div key={draft.id} className="draft-item">
                  <p><strong>Saved On:</strong> {draft.timestamp}</p>
                  <p>{draft.content.slice(0, 100)}...</p>
                  <button className="edit-btn" onClick={() => handleEditDraft(draft.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteDraft(draft.id)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No drafts saved yet.</p>
            )}
          </div>
        </div>

        <div className="saved-column">
          <h3>Saved Letter Files from Google Drive</h3>
          <div className="drive-files-list">
            {loadingDrive ? (
              <p>Fetching files...</p>
            ) : driveFiles.length > 0 ? (
              driveFiles.map((file) => (
                <div key={file.id} className="file-item">
                  <p><strong>{file.name}</strong> (Created: {new Date(file.createdTime).toLocaleString()})</p>
                  <a className="open-link" href={file.webViewLink} target="_blank" rel="noopener noreferrer">
                    Open in Google Docs
                  </a>
                </div>
              ))
            ) : (
              <p>No Letter files found in Google Drive.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
