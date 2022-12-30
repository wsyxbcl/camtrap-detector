import { useEffect, useState } from "react";
import "./App.css";
import { listen } from "@tauri-apps/api/event";
import FolderSelectDialog from "./components/FolderSelectDialog";
import ProgressDialog from "./components/ProgressDialog";
import ExportDialog from "./components/ExportDialog";
import { process } from "./api";
import { invoke } from "@tauri-apps/api";

function App() {
  const [path, setPath] = useState(null);
  const [includeSubfolders, setIncludeSubfolders] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);

  useEffect(() => {
    invoke("showup");
  }, []);

  useEffect(() => {
    listen("progress", (event) => {
      setProcessingStatus(event.payload);
    });
  }, []);

  useEffect(() => {
    if (path && includeSubfolders) {
      process(path, includeSubfolders);
    }
  }, [path, includeSubfolders]);

  const resetApp = () => {
    setPath(null);
    setIncludeSubfolders(null);
    setProcessingStatus(null);
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
      }}
    >
      {processingStatus == null ? (
        <FolderSelectDialog
          onDrop={(dirPath, recursive) => {
            setPath(dirPath);
            setIncludeSubfolders(recursive);
          }}
        />
      ) : (
        <>
          {processingStatus.percent < 100 ? (
            <ProgressDialog processingStatus={processingStatus} />
          ) : (
            <ExportDialog onReset={resetApp}/>
          )}
        </>
      )}
    </div>
  );
}

export default App;
