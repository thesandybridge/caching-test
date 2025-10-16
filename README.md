# React Query Caching Strategies Demo

A performance comparison demo showing two different caching strategies with React Query and their real-world impact on memory usage and API calls.

## 🎯 What This Demonstrates

This project compares two caching strategies:

**Strategy 1: Fetch All Upfront**
- Single API call fetches entire dataset (~46 MB with 50k users)
- All data cached under one key
- Heavy initial load, but instant subsequent access
- High memory footprint

**Strategy 2: Fetch Individually by ID**
- Multiple small API calls (one per user)
- Each user cached separately
- Lighter initial load, gradual memory usage
- More network requests but smaller payloads

## 🚀 Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Generate user data (locally):
```bash
npm run generate 50000  # Generates 50,000 users (~46 MB)
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Generate Different Dataset Sizes

```bash
npm run generate 10000   # Small dataset (~9 MB)
npm run generate 50000   # Medium dataset (~46 MB)
npm run generate 100000  # Large dataset (~92 MB)
npm run generate 500000  # Extreme dataset (~460 MB)
```

## 📊 Features

- **Real-time Memory Charts**: See cache size grow over time
- **Performance Metrics**: API calls, data transferred, load times, render counts
- **Interactive Controls**: Adjust number of displayed users to see performance impact
- **Visual Comparison**: Side-by-side comparison of both strategies

## 🌐 Deploy on Vercel

When deploying to Vercel, the user data is **automatically generated during build** via the `prebuild` script.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

The build process will:
1. Run `prebuild` script which generates 50,000 users
2. Build the Next.js app with the generated data
3. Deploy to Vercel

**Note**: The `data/` directory is gitignored, so the 46 MB user file won't bloat your repository. It's generated fresh on every deployment.

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **React Query** (TanStack Query)
- **Recharts** for visualization
- **Tailwind CSS** for styling
- **TypeScript** for type safety
