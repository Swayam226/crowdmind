import { NextRequest, NextResponse } from 'next/server';
import Snoowrap from 'snoowrap';
import Sentiment from 'sentiment';

const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || 'comsoc-hackathon-demo',
  clientId: process.env.REDDIT_CLIENT_ID || '',
  clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  refreshToken: process.env.REDDIT_REFRESH_TOKEN || '',
});

const sentiment = new Sentiment();

function getSentimentLabel(score: number) {
  if (score > 1) return 'POSITIVE';
  if (score < -1) return 'NEGATIVE';
  return 'NEUTRAL';
}

function extractKeywords(posts: any[], topN = 15) {
  const freq: Record<string, { value: number; sentiment: string }> = {};
  posts.forEach((post) => {
    const words = (post.title + ' ' + post.selftext)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['karnataka', 'bike', 'taxi', 'ban', 'https', 'reddit', 'com'].includes(w));
    words.forEach((word) => {
      if (!freq[word]) freq[word] = { value: 0, sentiment: post.sentiment.toLowerCase() };
      freq[word].value++;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, topN)
    .map(([text, { value, sentiment }]) => ({ text, value, sentiment }));
}

function getWeeklyTrend(posts: any[]) {
  const trend: Record<string, { date: string; positive: number; negative: number; neutral: number; total: number }> = {};
  posts.forEach((post) => {
    const date = post.timestamp.slice(0, 10); // YYYY-MM-DD
    if (!trend[date]) trend[date] = { date, positive: 0, negative: 0, neutral: 0, total: 0 };
    const key = post.sentiment.toLowerCase() as 'positive' | 'negative' | 'neutral';
    trend[date][key]++;
    trend[date].total++;
  });
  return Object.values(trend).sort((a, b) => a.date.localeCompare(b.date));
}

function getHourlyActivity(posts: any[]) {
  const hours: Record<string, { hour: string; posts: number }> = {};
  for (let i = 0; i < 24; i++) hours[i] = { hour: `${i}:00`, posts: 0 };
  posts.forEach((post) => {
    const hour = new Date(post.timestamp).getHours();
    hours[hour].posts++;
  });
  return Object.values(hours);
}

function getTopSubreddits(posts: any[], topN = 5) {
  const subMap: Record<string, { name: string; posts: number; sentimentSum: number }> = {};
  posts.forEach((post) => {
    if (!subMap[post.subreddit]) subMap[post.subreddit] = { name: post.subreddit, posts: 0, sentimentSum: 0 };
    subMap[post.subreddit].posts++;
    // Sentiment: POSITIVE=1, NEGATIVE=0, NEUTRAL=0.5
    let s = 0.5;
    if (post.sentiment === 'POSITIVE') s = 1;
    else if (post.sentiment === 'NEGATIVE') s = 0;
    subMap[post.subreddit].sentimentSum += s;
  });
  return Object.values(subMap)
    .sort((a, b) => b.posts - a.posts)
    .slice(0, topN)
    .map((s) => ({ name: s.name, posts: s.posts, sentiment: s.posts ? s.sentimentSum / s.posts : 0.5 }));
}

async function fetchBikeTaxiBanPosts() {
  const subreddits = ['india', 'bangalore'];
  const query = 'bike taxi ban karnataka';
  let results: any[] = [];

  for (const sub of subreddits) {
    const posts = await reddit.getSubreddit(sub).search({
      query,
      sort: 'new',
      time: 'week',
    });
    results = results.concat(posts.slice(0, 20).map((p: any) => ({
      id: p.id,
      title: p.title,
      selftext: p.selftext,
      url: p.url,
      created_utc: p.created_utc,
      subreddit: p.subreddit.display_name,
      author: p.author.name,
      score: p.score,
      num_comments: p.num_comments,
    })));
  }
  return results;
}

export async function GET(req: NextRequest) {
  try {
    const posts = await fetchBikeTaxiBanPosts();
    let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let sentimentScoreSum = 0;
    const processedPosts = posts.map((post, idx) => {
      const s = sentiment.analyze(post.title + ' ' + post.selftext);
      const label = getSentimentLabel(s.score);
      sentimentCounts[label.toLowerCase() as 'positive' | 'negative' | 'neutral']++;
      sentimentScoreSum += s.score;
      return {
        id: idx + 1,
        title: post.title,
        content: post.selftext,
        sentiment: label,
        score: Math.abs(s.score) / 5 > 1 ? 1 : Math.abs(s.score) / 5, // normalize for UI
        subreddit: 'r/' + post.subreddit,
        timestamp: new Date(post.created_utc * 1000).toISOString(),
        upvotes: post.score,
        comments: post.num_comments,
        author: 'u/' + post.author,
        url: post.url,
      };
    });
    const topKeywords = extractKeywords(processedPosts);
    const weeklyTrend = getWeeklyTrend(processedPosts);
    const hourlyActivity = getHourlyActivity(processedPosts);
    const topSubreddits = getTopSubreddits(processedPosts);
    const dashboardData = {
      id: 'bike-taxi-ban-karnataka',
      policy: 'Bike Taxi Ban',
      location: 'Karnataka',
      totalPosts: processedPosts.length,
      totalComments: processedPosts.reduce((sum, p) => sum + p.comments, 0),
      totalEngagement: processedPosts.reduce((sum, p) => sum + p.upvotes + p.comments, 0),
      analysisDate: new Date().toISOString(),
      sentimentDistribution: sentimentCounts,
      sentimentScore: processedPosts.length ? sentimentScoreSum / processedPosts.length : 0,
      topKeywords,
      weeklyTrend,
      hourlyActivity,
      topSubreddits,
      recentPosts: processedPosts,
      demographicBreakdown: { ageGroups: [], regions: [] }, // not available from Reddit
    };
    return NextResponse.json(dashboardData);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
