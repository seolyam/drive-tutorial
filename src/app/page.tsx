"use client"

import { useState } from "react"
import { File, Folder, Upload, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"

type FileType = {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  children?: FileType[]
}

const initialFiles: FileType[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    size: "--",
    children: [
      { id: "2", name: "Resume.pdf", type: "file", size: "1.2 MB" },
      { id: "3", name: "Cover Letter.docx", type: "file", size: "890 KB" },
    ],
  },
  {
    id: "4",
    name: "Photos",
    type: "folder",
    size: "--",
    children: [
      { id: "5", name: "Vacation.jpg", type: "file", size: "3.5 MB" },
      { id: "6", name: "Family.png", type: "file", size: "2.7 MB" },
    ],
  },
  { id: "7", name: "Project.zip", type: "file", size: "15.2 MB" },
]

export default function GoogleDriveClone() {
  const [files, setFiles] = useState<FileType[]>(initialFiles)
  const [currentFolder, setCurrentFolder] = useState<FileType[]>([])
  const [currentFiles, setCurrentFiles] = useState<FileType[]>(files)

  const handleUpload = () => {
    const newFile: FileType = {
      id: Date.now().toString(),
      name: `New File ${currentFiles.length + 1}.txt`,
      type: "file",
      size: "0 KB",
    }
    setCurrentFiles([...currentFiles, newFile])
  }

  const navigateToFolder = (folder: FileType) => {
    setCurrentFolder([...currentFolder, folder])
    setCurrentFiles(folder.children || [])
  }

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentFolder([])
      setCurrentFiles(files)
    } else {
      const newCurrentFolder = currentFolder.slice(0, index + 1)
      setCurrentFolder(newCurrentFolder)
      setCurrentFiles(newCurrentFolder[newCurrentFolder.length - 1].children || [])
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Google Drive Clone</h1>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>
      <Breadcrumbs currentFolder={currentFolder} onNavigate={navigateToBreadcrumb} />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <FileList files={currentFiles} onFolderClick={navigateToFolder} />
      </div>
    </div>
  )
}

function Breadcrumbs({
  currentFolder,
  onNavigate,
}: { currentFolder: FileType[]; onNavigate: (index: number) => void }) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button variant="ghost" onClick={() => onNavigate(-1)}>
        Home
      </Button>
      {currentFolder.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <Button variant="ghost" onClick={() => onNavigate(index)}>
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  )
}

function FileList({ files, onFolderClick }: { files: FileType[]; onFolderClick: (folder: FileType) => void }) {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-500 border-b">
        <div className="col-span-6">Name</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-3">Size</div>
      </div>
      <ul className="divide-y divide-gray-200">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onFolderClick={onFolderClick} />
        ))}
      </ul>
    </div>
  )
}

function FileItem({ file, onFolderClick }: { file: FileType; onFolderClick: (folder: FileType) => void }) {
  const handleClick = () => {
    if (file.type === "folder") {
      onFolderClick(file)
    }
  }

  return (
    <li>
      <div className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 cursor-pointer" onClick={handleClick}>
        <div className="col-span-6 flex items-center space-x-4">
          {file.type === "folder" ? (
            <Folder className="h-6 w-6 text-blue-500" />
          ) : (
            <File className="h-6 w-6 text-gray-500" />
          )}
          <span className={file.type === "folder" ? "font-semibold" : ""}>{file.name}</span>
        </div>
        <div className="col-span-3">{file.type === "folder" ? "Folder" : "File"}</div>
        <div className="col-span-3">{file.size}</div>
      </div>
    </li>
  )
}

