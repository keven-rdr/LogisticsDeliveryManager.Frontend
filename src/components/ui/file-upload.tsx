import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Download,
  ExternalLink,
  File,
  FileCode,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { StorageObjectResponse } from "@/schemas/storage";
import { useStorageService } from "@/services/storage-service";

interface FileObj {
  id: string;
  file?: File;
  name: string;
  size: number;
  contentType: string;
  previewUrl?: string;
  type: "image" | "pdf" | "spreadsheet" | "code" | "other";
  status: "uploading" | "completed" | "error";
  progress: number;
  response?: StorageObjectResponse;
}

interface FileUploadProps {
  value?: string | string[];
  onChange?: (value: StorageObjectResponse | StorageObjectResponse[] | null) => void;
  initialFiles?: StorageObjectResponse[];
  readOnly?: boolean;
  title?: string;
  subtitle?: string;
  variant?: "single" | "multiple";
  accept?: string;
  className?: string;
  error?: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const getFileType = (contentType: string, fileName: string): FileObj["type"] => {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  if (
    contentType.includes("spreadsheet") ||
    contentType.includes("excel") ||
    fileName.endsWith(".csv") ||
    fileName.endsWith(".xlsx")
  )
    return "spreadsheet";
  if (
    contentType.includes("javascript") ||
    contentType.includes("json") ||
    fileName.endsWith(".ts") ||
    fileName.endsWith(".tsx")
  )
    return "code";
  return "other";
};

const canOpenInNewTab = (type: FileObj["type"]) => {
  return ["pdf", "image", "code"].includes(type);
};

const FileIcon = ({ type, className }: { type: FileObj["type"]; className?: string }) => {
  switch (type) {
    case "image":
      return <ImageIcon className={className} />;
    case "pdf":
      return <FileText className={className} />;
    case "spreadsheet":
      return <FileSpreadsheet className={className} />;
    case "code":
      return <FileCode className={className} />;
    default:
      return <File className={className} />;
  }
};

const AuthenticatedFileImage = ({ fileObj }: { fileObj: FileObj }) => {
  const { download } = useStorageService();
  const [url, setUrl] = useState<string>(fileObj.previewUrl || "");

  const isLocal =
    fileObj.previewUrl?.startsWith("blob:") || fileObj.previewUrl?.startsWith("data:");

  const { data: blob } = useQuery({
    queryKey: ["file-preview", fileObj.id],
    queryFn: () => download(fileObj.id, true),
    enabled: fileObj.status === "completed" && fileObj.type === "image" && !isLocal,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    if (blob && blob.size > 0) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [blob]);

  if (!url && !isLocal) {
    return <Loader2 className="animate-spin text-muted-foreground" size={20} />;
  }

  return (
    <img
      src={url}
      alt="preview"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  );
};

const ImageModal = ({
  fileObj,
  onClose,
  onDownload,
}: {
  fileObj: FileObj;
  onClose: () => void;
  onDownload: () => void;
}) => {
  const { download } = useStorageService();
  const [url, setUrl] = useState<string>(fileObj.previewUrl || "");
  const isLocal =
    fileObj.previewUrl?.startsWith("blob:") || fileObj.previewUrl?.startsWith("data:");

  const { data: blob } = useQuery({
    queryKey: ["file-preview-large", fileObj.id],
    queryFn: () => download(fileObj.id, true),
    enabled: fileObj.status === "completed" && fileObj.type === "image" && !isLocal,
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (blob && blob.size > 0) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [blob]);

  if (!url && !isLocal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in transition-all">
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center">
        <div className="absolute top-4 right-4 flex gap-3 z-10">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <Download size={20} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>

        <img
          src={url}
          alt={fileObj.name}
          className="max-w-full max-h-full object-contain rounded-card animate-in zoom-in-95 duration-200"
        />

        <div className="absolute bottom-6 bg-black/60 text-white px-6 py-2 rounded-full backdrop-blur-md text-sm font-medium">
          {fileObj.name} • {formatBytes(fileObj.size)}
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

const FileCard = ({
  fileObj,
  readOnly,
  onRemove,
  onPreview,
  onDownload,
  onOpenNewTab,
}: {
  fileObj: FileObj;
  readOnly?: boolean;
  onRemove: (id: string) => void;
  onPreview: (file: FileObj) => void;
  onDownload: (file: FileObj) => void;
  onOpenNewTab: (file: FileObj) => void;
}) => {
  const isUploading = fileObj.status === "uploading";
  const isError = fileObj.status === "error";

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-3 theme-card transition-all duration-200",
        isError ? "border-destructive animate-pulse" : "hover:border-primary",
      )}
    >
      <div
        className={cn(
          "relative flex-shrink-0 w-14 h-14 rounded-input overflow-hidden flex items-center justify-center border border-border",
          fileObj.type === "image" && !isUploading ? "cursor-pointer bg-muted" : "bg-muted",
        )}
        onClick={() => fileObj.type === "image" && !isUploading && onPreview(fileObj)}
      >
        {isUploading ? (
          <Loader2 className="animate-spin text-primary" size={24} />
        ) : fileObj.type === "image" ? (
          <>
            <AuthenticatedFileImage fileObj={fileObj} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Maximize2
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                size={18}
              />
            </div>
          </>
        ) : (
          <FileIcon type={fileObj.type} className="text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate pr-2" title={fileObj.name}>
          {fileObj.name}
        </h4>

        {isUploading ? (
          <div className="mt-2">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${fileObj.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 flex justify-between">
              <span>Enviando...</span>
              <span>{fileObj.progress}%</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
            {formatBytes(fileObj.size)}
            <span className="uppercase text-[10px] font-bold bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">
              {fileObj.name.split(".").pop() || "FILE"}
            </span>
          </p>
        )}
      </div>

      {!isUploading && (
        <div className="flex items-center gap-1 pl-2 border-l border-border ml-2">
          {canOpenInNewTab(fileObj.type) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => onOpenNewTab(fileObj)}
                  className="h-8 w-8 text-muted-foreground transition-colors"
                >
                  <ExternalLink size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Abrir arquivo</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => onDownload(fileObj)}
                className="h-8 w-8 text-muted-foreground transition-colors"
              >
                <Download size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Baixar arquivo</TooltipContent>
          </Tooltip>

          {!readOnly && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemove(fileObj.id)}
                  className="h-8 w-8 text-muted-foreground transition-colors"
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Remover arquivo</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export const FileUpload = ({
  onChange,
  initialFiles = [],
  readOnly = false,
  variant = "multiple",
  accept,
  className,
  error = false,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileObj[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FileObj | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageService = useStorageService();
  const { uploadTemporary, getDownloadUrl, download } = storageService;

  const getDownloadUrlMemo = useCallback(getDownloadUrl, []);

  const mapResponseToFileObj = useCallback(
    (res: StorageObjectResponse, localPreviewUrl?: string): FileObj => {
      return {
        id: res.id,
        name: res.originalName,
        size: res.size,
        contentType: res.contentType,
        type: getFileType(res.contentType, res.originalName),
        previewUrl: localPreviewUrl || getDownloadUrlMemo(res.id, true),
        status: "completed",
        progress: 100,
        response: res,
      };
    },
    [getDownloadUrlMemo],
  );

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0 && files.length === 0) {
      const mapped = initialFiles.map((res) => mapResponseToFileObj(res));
      setFiles(mapped);
      // Initialize lastEmittedValue to avoid immediate onChange trigger on mount
      lastEmittedValue.current = JSON.stringify(mapped.map((f) => f.response).filter(Boolean));
    }
  }, [initialFiles, mapResponseToFileObj, files.length]);

  const lastEmittedValue = useRef<string>("");
  const isFirstRender = useRef(true);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!onChangeRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const completedResponses = files
      .filter((f) => f.status === "completed" && f.response)
      .map((f) => f.response as NonNullable<typeof f.response>);

    const newValueString = JSON.stringify(completedResponses);

    if (newValueString !== lastEmittedValue.current) {
      lastEmittedValue.current = newValueString;
      if (variant === "single") {
        onChangeRef.current(completedResponses[0] || null);
      } else {
        onChangeRef.current(completedResponses);
      }
    }
  }, [files, variant]);

  const filesCleanupRef = useRef<FileObj[]>([]);

  useEffect(() => {
    filesCleanupRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesCleanupRef.current.forEach((f) => {
        if (f.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadTemporary(file),
    onError: (_, file) => {
      // Upload failed
      toast.error(`Falha ao enviar arquivo: ${file.name}`);
    },
  });

  const handleUpload = useCallback(
    async (tempId: string, file: File) => {
      try {
        const response = await uploadMutation.mutateAsync(file);
        setFiles((prev) =>
          prev.map((f) => (f.id === tempId ? mapResponseToFileObj(response, f.previewUrl) : f)),
        );
      } catch {
        setFiles((prev) => prev.filter((f) => f.id !== tempId));
      }
    },
    [uploadMutation, mapResponseToFileObj],
  );

  const handleFiles = useCallback(
    (incomingFiles: File[]) => {
      const newFilesObjs: FileObj[] = incomingFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        contentType: file.type,
        type: getFileType(file.type, file.name),
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
        progress: 50,
      }));

      setFiles((prev) => {
        if (variant === "single") {
          prev.forEach((f) => {
            if (f.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(f.previewUrl);
          });
          return [newFilesObjs[0]];
        }
        return [...prev, ...newFilesObjs];
      });

      for (const f of newFilesObjs) {
        if (f.file) handleUpload(f.id, f.file);
      }
    },
    [variant, handleUpload],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!readOnly) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!readOnly && e.dataTransfer.files?.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const downloadFile = async (fileObj: FileObj) => {
    if (!fileObj.id || fileObj.status !== "completed") return;
    try {
      const blob = await download(fileObj.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileObj.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Falha ao baixar arquivo");
    }
  };

  const openInNewTab = async (fileObj: FileObj) => {
    if (!fileObj.id || fileObj.status !== "completed") return;
    try {
      const result = await download(fileObj.id, true);
      const viewableBlob = new Blob([result], { type: fileObj.contentType });
      const url = URL.createObjectURL(viewableBlob);
      window.open(url, "_blank");
    } catch {
      toast.error("Falha ao abrir arquivo");
    }
  };

  const hasFileInSingleMode =
    variant === "single" && files.length > 0 && files[0].status === "completed";

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("w-full font-sans", className)}>
        <div className="space-y-4">
          {!readOnly && !hasFileInSingleMode && (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative group cursor-pointer flex flex-col items-center justify-center rounded-input border-2 border-dashed transition-all duration-300 ease-out h-40",
                error
                  ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                  : isDragging
                    ? "border-primary bg-primary-light/10"
                    : "border-border hover:border-primary hover:bg-muted",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={variant === "multiple"}
                accept={accept}
                className="hidden"
                onChange={handleInputChange}
              />

              <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                <div
                  className={cn(
                    "p-3 rounded-full bg-card transition-transform duration-300",
                    isDragging
                      ? "scale-110 text-primary"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                >
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {variant === "single" ? "Selecione o arquivo" : "Arraste os arquivos aqui"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {accept ? `Permitidos: ${accept}` : "PDF, Documentos ou Imagens"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div
              className={cn(
                "grid grid-cols-1 gap-3",
                variant === "multiple" ? "md:grid-cols-2 lg:grid-cols-3" : "",
              )}
            >
              {files.map((fileObj) => (
                <FileCard
                  key={fileObj.id}
                  fileObj={fileObj}
                  readOnly={readOnly}
                  onRemove={removeFile}
                  onPreview={setSelectedImage}
                  onDownload={downloadFile}
                  onOpenNewTab={openInNewTab}
                />
              ))}

              {!readOnly && hasFileInSingleMode && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-12 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={16} /> Substituir arquivo
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                </Button>
              )}
            </div>
          )}

          {files.length === 0 && readOnly && (
            <div className="text-center py-8 text-muted-foreground bg-muted rounded-input border border-dashed border-border flex flex-col items-center gap-2">
              <AlertCircle size={24} className="opacity-50" />
              <span className="text-sm">Nenhum arquivo anexado.</span>
            </div>
          )}
        </div>

        {selectedImage && (
          <ImageModal
            fileObj={selectedImage}
            onClose={() => setSelectedImage(null)}
            onDownload={() => downloadFile(selectedImage)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
