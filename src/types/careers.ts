export type ApplicationFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  resume: File | null;
  linkedinprofile?: string;
  experience: string;
  currentCompensation: string;
  gender: string;
  expectedCTC: string;
  type: string;
};
