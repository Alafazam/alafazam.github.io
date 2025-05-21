export interface Basics {
  name: string;
  titles: string[];
  email: string;
  phone: string;
  linkedin: string;
  linkedinDescription: string;
  avatarUrl: string;
  resumePdfUrl: string;
}

export interface CoreAchievement {
  icon: string;
  title: string;
  description: string;
}

export interface ModalDetails {
  roleOverview: string;
  keyAchievements: string[];
  technicalLeadership: string[];
  teamScope: string[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  teamInfo: string;
  scope?: string;
  environment?: string;
  description?: string;
  techStack?: string[];
  productTools?: string[];
  achievements: string[];
  isCollapsible?: boolean;
  modalDetails?: ModalDetails;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
}

export interface CertificationItem {
  title: string;
  issueDate: string;
  credentialId: string;
  url: string;
}

export interface Certification {
  platform: string;
  title?: string;
  issueDate?: string;
  credentialId?: string;
  url?: string;
  group?: string;
  items?: CertificationItem[];
}

export interface ResumeData {
  basics: Basics;
  summary: string;
  coreAchievements: CoreAchievement[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
} 