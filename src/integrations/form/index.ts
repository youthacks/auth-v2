import { createFormHook } from "@tanstack/react-form";

import {
  CheckboxField,
  OTPField,
  StatusBar,
  SubmitButton,
  TextareaField,
  TextField,
} from "./components";
import { fieldContext, formContext } from "./context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    OTPField,
    TextField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
    StatusBar,
  },
  fieldContext,
  formContext,
});
