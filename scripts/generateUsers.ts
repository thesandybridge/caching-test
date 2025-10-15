import { writeFileSync } from 'fs';
import { join } from 'path';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

// Generate a large array of users
function generateUsers(count: number): User[] {
  const users: User[] = [];
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const bioTemplates = [
    'Passionate developer who loves coding',
    'Design enthusiast and creative thinker',
    'Tech lead with 10+ years of experience',
    'Full-stack developer and coffee lover',
    'Frontend specialist focused on UX',
    'Backend engineer who loves databases',
    'DevOps expert automating everything',
    'Mobile developer building native apps',
    'Data scientist exploring AI/ML',
    'Product manager shipping features'
  ];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const name = `${firstName} ${lastName} ${Math.floor(i / 100)}`;

    users.push({
      id: i,
      name,
      email: `user${i}@example.com`,
      // Using picsum.photos for dynamic avatar images - each ID gets a unique image
      avatar: `https://picsum.photos/seed/${i}/150/150`,
      bio: bioTemplates[i % bioTemplates.length]
    });
  }

  return users;
}

// Generate 10,000 users
const users = generateUsers(10000);

// Write to a JSON file
const outputPath = join(process.cwd(), 'data', 'users.json');
writeFileSync(outputPath, JSON.stringify(users, null, 2));

console.log(`✅ Generated ${users.length} users and saved to ${outputPath}`);
console.log(`📊 File size: ${(Buffer.byteLength(JSON.stringify(users)) / 1024 / 1024).toFixed(2)} MB`);
