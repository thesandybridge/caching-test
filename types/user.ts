export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  company: string;
  position: string;
  location: string;
  skills: string[];
  projects: Array<{ name: string; description: string; year: number }>;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  stats: {
    followers: number;
    following: number;
    posts: number;
    likes: number;
  };
}
