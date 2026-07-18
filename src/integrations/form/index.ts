import { createFormHook } from "@tanstack/react-form";

import { CheckboxField, OTPField, SubmitButton, TextField } from "./components";
import { fieldContext, formContext } from "./context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    OTPField,
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
