import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  limit
} from 'firebase/firestore';

export type ActivityType = 'vote' | 'claim' | 'nomination' | 'migration';

export interface Activity {
  id?: string;
  userId: string;
  type: ActivityType;
  projectId: string;
  projectName: string;
  projectTicker: string;
  value: string;
  timestamp: Timestamp;
  metadata?: {
    votePower?: number;
    claimAmount?: string;
    txHash?: string;
  };
}

// Track a new activity
export async function trackActivity(
  userId: string,
  type: ActivityType,
  projectId: string,
  projectName: string,
  projectTicker: string,
  value: string,
  metadata?: Activity['metadata']
): Promise<void> {
  try {
    const activityRef = collection(db, 'userActivity');
    await addDoc(activityRef, {
      userId,
      type,
      projectId,
      projectName,
      projectTicker,
      value,
      timestamp: Timestamp.now(),
      metadata: metadata || {},
    });
    console.log(`✅ Activity tracked: ${type} for ${projectName}`);
  } catch (error) {
    console.error('Error tracking activity:', error);
    // Don't throw - activity tracking should not break main functionality
  }
}

// Subscribe to user's activity feed
export function subscribeToUserActivity(
  userId: string,
  callback: (activities: Activity[]) => void,
  maxItems: number = 20
) {
  const activityRef = collection(db, 'userActivity');
  const q = query(
    activityRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(maxItems)
  );

  return onSnapshot(q, (snapshot) => {
    const activities: Activity[] = [];
    snapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() } as Activity);
    });
    callback(activities);
  }, (error) => {
    console.error('Error subscribing to activity:', error);
    callback([]);
  });
}

// Subscribe to global recent activity (for overview)
export function subscribeToGlobalActivity(
  callback: (activities: Activity[]) => void,
  maxItems: number = 10
) {
  const activityRef = collection(db, 'userActivity');
  const q = query(
    activityRef,
    orderBy('timestamp', 'desc'),
    limit(maxItems)
  );

  return onSnapshot(q, (snapshot) => {
    const activities: Activity[] = [];
    snapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() } as Activity);
    });
    callback(activities);
  }, (error) => {
    console.error('Error subscribing to global activity:', error);
    callback([]);
  });
}

// Format activity time for display
export function formatActivityTime(timestamp: Timestamp): string {
  const now = new Date();
  const activityTime = timestamp.toDate();
  const diffMs = now.getTime() - activityTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return activityTime.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

// Get activity icon based on type
export function getActivityIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    vote: '🗳️',
    claim: '💎',
    nomination: '📝',
    migration: '🚀',
  };
  return icons[type];
}
