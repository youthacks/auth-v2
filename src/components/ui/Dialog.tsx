import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";

const Root = BaseDialog.Root;
const Trigger = BaseDialog.Trigger;
const Portal = BaseDialog.Portal;

function Backdrop({ className, ...props }: BaseDialog.Backdrop.Props) {
  return (
    <BaseDialog.Backdrop
      {...props}
      className={clsx(
        "fixed inset-0 z-20 bg-black opacity-40",
        "transition data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
    />
  );
}
function Viewport({ className, ...props }: BaseDialog.Viewport.Props) {
  return (
    <BaseDialog.Viewport
      {...props}
      className={clsx(
        "fixed inset-0 z-20 flex items-center justify-center p-8",
        className,
      )}
    />
  );
}
function Popup({ className, ...props }: BaseDialog.Popup.Props) {
  return (
    <BaseDialog.Popup
      {...props}
      className={clsx(
        "relative w-full max-w-lg rounded-xl border border-neutral-300 bg-white p-6 shadow-lg",
        "transition data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0",
        className,
      )}
    />
  );
}

const Close = BaseDialog.Close;
function CloseButton() {
  return (
    <BaseDialog.Close className="absolute top-2 right-2 grid size-8 place-items-center rounded-md text-neutral-600 transition hover:bg-neutral-200">
      <span className="sr-only">Close</span>
      <XIcon strokeWidth={2.5} className="size-4" />
    </BaseDialog.Close>
  );
}

function Title({ className, ...props }: BaseDialog.Title.Props) {
  return (
    <BaseDialog.Title
      {...props}
      className={clsx("font-heading text-2xl font-bold", className)}
    />
  );
}
const Description = BaseDialog.Description;

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Viewport,
  Popup,
  Close,
  CloseButton,
  Title,
  Description,

  createHandle: BaseDialog.createHandle,
};

export type DialogHandle<Payload> = BaseDialog.Handle<Payload>;
