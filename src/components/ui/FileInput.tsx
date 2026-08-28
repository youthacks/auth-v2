import { Field } from "@base-ui/react/field";
import { usePrevious } from "@mantine/hooks";
import clsx from "clsx";
import {
  type ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "./Button";

function bytesToReadable(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1000;
  if (kb < 1000) return `${kb.toFixed(1)} KB`;

  const mb = kb / 1000;
  if (mb < 1000) return `${mb.toFixed(1)} MB`;

  const gb = mb / 1000;
  return `${gb.toFixed(1)} GB`;
}

type AvatarInputProps = Omit<ComponentProps<"div">, "value" | "onChange"> & {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
  placeholder?: string;
};

export function AvatarInput({
  value,
  onChange,
  placeholder,
  ...props
}: AvatarInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const previousFileUrl = usePrevious(fileUrl);

  const previewFileUrl = useMemo(
    () => fileUrl || previousFileUrl,
    [fileUrl, previousFileUrl],
  );

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(null);
    }
  }, [value]);

  return (
    <div {...props}>
      <div
        className={clsx(
          "-mb-2 overflow-clip rounded-t-lg border border-neutral-200 bg-neutral-100 transition-[height] duration-500 ease-in-out-expo",
          value ? "h-24" : "h-2",
        )}
      >
        <div className="flex h-full min-h-24 items-center justify-center pb-2">
          <div className="size-16 flex-none overflow-clip rounded-full border border-neutral-200 bg-neutral-100">
            {previewFileUrl && (
              <img
                src={previewFileUrl}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative flex h-14 items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 shadow-xs">
        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="text-sm leading-snug">{value.name || "unnamed"}</p>
              <p className="text-xs leading-snug text-neutral-600">
                {bytesToReadable(value.size)}
              </p>
            </>
          ) : (
            <p className="text-sm">No file selected</p>
          )}
        </div>
        <Button onClick={() => inputRef.current?.click()} size="sm">
          Upload
        </Button>
        {value !== null && (
          <Button onClick={() => onChange(null)} color="danger" size="sm">
            Remove
          </Button>
        )}
      </div>
      <Field.Control
        ref={inputRef}
        type="file"
        onChange={(ev) => onChange(ev.target.files?.[0] ?? null)}
        className="pointer-events-none absolute size-0! flex-none"
      />
    </div>
  );
}
