import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { User } from '@/types/user';

// This simulates a Redis cache containing all users
// In a real app, this would be Redis or another cache layer

let cachedUsers: User[] | null = null;

function getUsersFromCache(): User[] {
  if (!cachedUsers) {
    const filePath = join(process.cwd(), 'data', 'users.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    cachedUsers = JSON.parse(fileContent);
    console.log('📦 Loaded users into "Redis" cache');
  }
  return cachedUsers;
}

export async function GET() {
  console.log('🔵 API: Fetching ALL users from cache');
  const startTime = Date.now();

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const users = getUsersFromCache();
  const endTime = Date.now();

  console.log(`✅ API: Returned ${users.length} users in ${endTime - startTime}ms`);

  return NextResponse.json({
    users,
    meta: {
      count: users.length,
      fetchTime: endTime - startTime
    }
  });
}
