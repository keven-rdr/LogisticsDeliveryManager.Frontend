interface FormSectionHeaderProps {
  title: string;
}

export function FormSectionHeader({ title }: FormSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
      <div className="h-4 w-1 bg-theme-primary rounded-full" />
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}
