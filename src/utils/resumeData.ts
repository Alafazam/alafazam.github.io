import { ResumeData } from '../types/resume';
import resumeData from '../resumeData.json';

export const getResumeData = (): ResumeData => {
  // This allows us to potentially fetch the data from an API in the future
  return resumeData as ResumeData;
};

export default getResumeData; 