import { writeFileSync } from 'fs';
import { join } from 'path';

interface User {
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

// Generate a large array of users
function generateUsers(count: number): User[] {
  const users: User[] = [];
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const bioTemplates = [
    'Passionate developer who loves coding and building scalable applications',
    'Design enthusiast and creative thinker focused on user experience',
    'Tech lead with 10+ years of experience in distributed systems',
    'Full-stack developer and coffee lover specializing in web technologies',
    'Frontend specialist focused on UX and performance optimization',
    'Backend engineer who loves databases and system architecture',
    'DevOps expert automating everything with modern cloud infrastructure',
    'Mobile developer building native apps for iOS and Android platforms',
    'Data scientist exploring AI/ML and deep learning applications',
    'Product manager shipping features that users love and driving growth'
  ];
  const companies = ['TechCorp', 'StartupXYZ', 'MegaSoft', 'CloudNine', 'DataDynamics', 'InnovateLabs', 'DevForce', 'CodeCraft', 'SysOps Inc', 'WebWorks'];
  const positions = ['Senior Engineer', 'Lead Developer', 'Principal Architect', 'Staff Engineer', 'Engineering Manager', 'Tech Lead', 'Software Engineer', 'Developer Advocate', 'Solutions Architect', 'VP of Engineering'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Portland, OR', 'Chicago, IL', 'Los Angeles, CA', 'Miami, FL'];
  const skills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'Rust', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'CI/CD'];
  const projectNames = ['E-Commerce Platform', 'Real-time Chat App', 'Analytics Dashboard', 'Mobile Banking App', 'Social Media Platform', 'CRM System', 'Inventory Management', 'Video Streaming Service', 'AI Chatbot', 'Cloud Infrastructure'];
  const themes = ['light', 'dark', 'auto'];
  const languages = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const name = `${firstName} ${lastName} ${Math.floor(i / 100)}`;

    // Generate 3-7 random skills
    const numSkills = 3 + (i % 5);
    const userSkills = [];
    for (let j = 0; j < numSkills; j++) {
      userSkills.push(skills[(i + j) % skills.length]);
    }

    // Generate 2-4 projects
    const numProjects = 2 + (i % 3);
    const userProjects = [];
    for (let j = 0; j < numProjects; j++) {
      userProjects.push({
        name: projectNames[(i + j) % projectNames.length],
        description: `Led development of ${projectNames[(i + j) % projectNames.length]} using modern technologies and best practices`,
        year: 2018 + ((i + j) % 7)
      });
    }

    users.push({
      id: i,
      name,
      email: `user${i}@example.com`,
      avatar: `https://picsum.photos/seed/${i}/150/150`,
      bio: bioTemplates[i % bioTemplates.length],
      company: companies[i % companies.length],
      position: positions[i % positions.length],
      location: locations[i % locations.length],
      skills: userSkills,
      projects: userProjects,
      socialLinks: {
        twitter: i % 3 === 0 ? `@${firstName.toLowerCase()}${i}` : undefined,
        linkedin: i % 2 === 0 ? `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}` : undefined,
        github: i % 4 === 0 ? `github.com/${firstName.toLowerCase()}${i}` : undefined,
      },
      preferences: {
        theme: themes[i % themes.length],
        language: languages[i % languages.length],
        notifications: i % 2 === 0,
      },
      stats: {
        followers: 100 + (i * 7) % 5000,
        following: 50 + (i * 3) % 1000,
        posts: 10 + (i * 11) % 500,
        likes: 500 + (i * 13) % 10000,
      }
    });
  }

  return users;
}

// Get count from command line argument or use default
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 10_000;

if (isNaN(count) || count <= 0) {
  console.error('❌ Please provide a valid positive number of users');
  process.exit(1);
}

// Generate users
const users = generateUsers(count);

// Write to a JSON file
const outputPath = join(process.cwd(), 'data', 'users.json');
writeFileSync(outputPath, JSON.stringify(users, null, 2));

console.log(`✅ Generated ${users.length.toLocaleString()} users and saved to ${outputPath}`);
console.log(`📊 File size: ${(Buffer.byteLength(JSON.stringify(users)) / 1024 / 1024).toFixed(2)} MB`);
