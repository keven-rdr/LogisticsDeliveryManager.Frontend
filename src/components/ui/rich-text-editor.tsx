import { Editor } from "@tinymce/tinymce-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  height = 400,
  placeholder,
  disabled,
  className,
  "aria-invalid": isInvalid,
}: RichTextEditorProps) {
  const mode = useThemeStore((state) => state.config.mode);
  const isDark = mode === "dark";

  return (
    <div
      className={cn(
        "min-h-75 w-full",
        isInvalid ? "border-rose-500" : "",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <Editor
        key={mode}
        licenseKey="gpl"
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        value={value}
        onEditorChange={onChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: false,
          placeholder: placeholder,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; background-color: transparent !important; color: inherit !important; }",
          skin: isDark ? "oxide-dark" : "oxide",
          content_css: isDark ? "dark" : "default",
          promotion: false,
          branding: false,
          base_url: "/tinymce",
          suffix: ".min",
        }}
      />
    </div>
  );
}
