import { Field } from "@base-ui/react/field";
import { usePrevious } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { type ComponentProps, useRef } from "react";
import {
  getAssetInfoQuery,
  uploadAvatarMutation,
} from "#/actions/assets/queries";
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

const fileNames = new Map<string, string>();

type AvatarInputProps = Omit<ComponentProps<"div">, "value" | "onChange"> & {
  value: string | null;
  onChange: (assetId: string | null) => void;
  placeholder?: string;
};

export function AvatarInput({
  value,
  onChange,
  placeholder,
  ...props
}: AvatarInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: asset } = useQuery({
    ...getAssetInfoQuery({ assetId: value || "" }),
    enabled: !!value,
  });
  const previousAsset = usePrevious(asset);

  const { mutate, isPending } = useMutation({
    ...uploadAvatarMutation(),
    onSuccess: (data, variables) => {
      const file = variables.get("file");
      if (file && file instanceof File) {
        fileNames.set(data.assetId, file.name);
      }

      onChange(data.assetId);
    },
  });

  return (
    <div {...props}>
      <div
        className={clsx(
          "-mb-2 overflow-clip rounded-t-lg border border-neutral-200 bg-neutral-100 transition-[height] duration-500 ease-in-out-expo",
          value ? "h-24" : "h-2",
        )}
      >
        <div className="flex h-full min-h-24 items-center justify-center pb-2">
          <div
            className={clsx(
              "size-16 flex-none overflow-clip rounded-full border border-neutral-200 bg-neutral-100 transition duration-500 ease-in-out-expo",
              value ? "" : "scale-50 opacity-0",
            )}
          >
            {(asset || previousAsset) && (
              <img
                src={asset?.url ?? previousAsset?.url}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative flex h-14 items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 shadow-xs">
        {isPending ? (
          <>
            <span className="mr-0.5 block size-3 animate-spin rounded-full border border-transparent border-r-neutral-500"></span>
            <p className="text-sm text-neutral-600">Uploading...</p>
          </>
        ) : value && !asset ? (
          <>
            <span className="mr-0.5 block size-3 animate-spin rounded-full border border-transparent border-r-neutral-500"></span>
            <p className="text-sm text-neutral-600">Finalising...</p>
          </>
        ) : asset ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">
                {fileNames.get(asset.id) || (
                  <span className="italic">Existing file</span>
                )}
              </p>
              <p className="text-xs leading-snug text-neutral-600">
                {bytesToReadable(asset.size)}
              </p>
            </div>
            <Button onClick={() => inputRef.current?.click()} size="sm">
              Replace
            </Button>
            <Button onClick={() => onChange(null)} color="danger" size="sm">
              Remove
            </Button>
          </>
        ) : (
          <>
            <p className="min-w-0 flex-1 text-sm">No file selected</p>
            <Button onClick={() => inputRef.current?.click()} size="sm">
              Upload
            </Button>
          </>
        )}
      </div>
      <Field.Control
        ref={inputRef}
        type="file"
        onChange={(ev) => {
          const [file] = ev.target.files || [];
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            mutate(formData);
          }
        }}
        className="pointer-events-none absolute size-0! flex-none"
      />
    </div>
  );
}
