import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WebSocketStatus } from "@/components/shared/websocket-status";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import { useStorageService } from "@/services/storage-service";
import { Avatar, type AvatarProps } from "./avatar";

interface AppAvatarProps extends Omit<AvatarProps, "src"> {
  fallbackName?: string;
  showStatus?: boolean;
}

interface ClientAvatarProps extends AppAvatarProps {
  logoId?: string | null;
}

export function ClientAvatar({
  logoId,
  fallbackName,
  showStatus,
  className,
  ...props
}: ClientAvatarProps) {
  const { download } = useStorageService();
  const [url, setUrl] = useState<string>();

  const { data: blob } = useQuery({
    queryKey: ["client-avatar", logoId],
    queryFn: () => download(logoId ?? "", true),
    enabled: !!logoId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (blob && blob.size > 0) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setUrl(undefined);
  }, [blob]);

  const avatar = <Avatar src={url} name={fallbackName} className={className} {...props} />;

  if (!showStatus) {
    return avatar;
  }

  return (
    <div className="relative inline-flex">
      {avatar}
      <div className="absolute -bottom-0.5 -right-0.5 rounded-full z-10">
        <WebSocketStatus showTooltip={false} size="xs" />
      </div>
    </div>
  );
}

interface UserAvatarProps extends AppAvatarProps {
  identifier?: string | null; // email or login
}

export function UserAvatar({
  identifier,
  fallbackName,
  showStatus,
  className,
  ...props
}: UserAvatarProps) {
  const fetchClient = useFetch();
  const [url, setUrl] = useState<string>();

  const { data: blob } = useQuery({
    queryKey: ["user-avatar", identifier],
    queryFn: async () => {
      if (!identifier) return null;
      try {
        const response = await fetchClient.get<Blob>(
          `/v1/avatar/${encodeURIComponent(identifier)}`,
          undefined,
          { headers: { Accept: "application/octet-stream" } },
        );
        return response;
      } catch (_error) {
        return null;
      }
    },
    enabled: !!identifier,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (blob && blob.size > 0) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setUrl(undefined);
  }, [blob]);

  const avatar = <Avatar src={url} name={fallbackName} className={className} {...props} />;

  if (!showStatus) {
    return avatar;
  }

  return (
    <div className={cn("relative inline-flex shrink-0")}>
      {avatar}
      <div className="absolute -bottom-0.5 -right-0.5 rounded-full z-10">
        <WebSocketStatus showTooltip={true} size="xs" />
      </div>
    </div>
  );
}
