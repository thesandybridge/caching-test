import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// This simulates a Redis cache lookup by ID
// In a real app, this would be Redis GET by key

let cachedUsers: any[] | null = null;

function getUsersFromCache() {
  if (!cachedUsers) {
    const filePath = join(process.cwd(), 'data', 'users.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    cachedUsers = JSON.parse(fileContent);
    console.log('📦 Loaded users into "Redis" cache');
  }
  return cachedUsers;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`🟢 API: Fetching user ${id} from cache`);
  const startTime = Date.now();

  // Simulate network delay (much smaller since we're only fetching one user)
  await new Promise(resolve => setTimeout(resolve, 50));

  const users = getUsersFromCache();
  const user = users.find(u => u.id === parseInt(id));

  const endTime = Date.now();

  if (!user) {
    console.log(`❌ API: User ${id} not found`);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  console.log(`✅ API: Returned user ${id} in ${endTime - startTime}ms`);

  return NextResponse.json({
    user,
    meta: {
      fetchTime: endTime - startTime
    }
  });
}
