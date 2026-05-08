"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "./combobox";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showAllOption?: boolean;
}

export function StatusSelect({
  value,
  onChange,
  placeholder,
  className,
  showAllOption = true,
}: StatusSelectProps) {
  const { t } = useTranslation("common");

  const options = useMemo(() => {
    const opts = [
      { label: t("status.ACTIVE"), value: "ACTIVE" },
      { label: t("status.INACTIVE"), value: "INACTIVE" },
    ];

    if (showAllOption) {
      opts.unshift({ label: t("status.all"), value: "" });
    }

    return opts;
  }, [t, showAllOption]);

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? t("status.all")}
      className={className}
    />
  );
}
