export type ApplicationFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  resume: string;
  linkedinprofile?: string;
  experience: string;
  currentCompensation: string;
  gender: string;
  expectedCTC: string;
  type: string;
  country: string;
  hiddenField?: string;
};

export type JobResponse = {
  _id: string;
  jobtitle: string;
  location: string;
  level: string;
  experience: string;
  country: string;
};

export type JobsResponseType = {
  result: JobResponse[];
  status: string;
  statusCode: number;
};

type JobSection = {
  title: string;
  points: string[];
};

export type JobDetailsResponse = {
  _id: string;
  jobtitle: string;
  jobdescription: string;
  aboutCompany: string;
  location: string;
  level: string;
  experience: string;
  date: string;
  sections: JobSection[];
  country: string;
};

export type JobDetailsResponseType = {
  result: JobDetailsResponse;
  status: string;
  statusCode: number;
};
