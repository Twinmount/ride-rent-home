export type FormModalType = "success" | "error" | "";

export interface FormModalState {
  isOpen: boolean;
  type: FormModalType;
  title?: string;
  description?: string;
  buttonText?: string;
}
