import { createFormHook } from "@tanstack/react-form";

import {
  AvatarInputField,
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
    AvatarInputField,
  },
  formComponents: {
    SubmitButton,
    StatusBar,
  },
  fieldContext,
  formContext,
});
