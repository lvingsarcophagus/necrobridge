'use client';

import { useEffect, useState } from 'react';
import { Activity, subscribeToUserActivity, subscribeToGlobalActivity, formatActivityTime, ActivityType } from '@/lib/activity';
import { Vote, Gem, FileText, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveActivityFeedProps {
  userId?: string;
  maxItems?: number;
  showGlobal?: boolean;
}

const activityConfig: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
  vote: { icon: Vote, color: 'text-purple-400', label: 'Voted' },
  claim: { icon: Gem, color: 'text-green-400', label: 'Claimed' },
  nomination: { icon: FileText, color: 'text-blue-400', label: 'Nominated' },
  migration: { icon: Rocket, color: 'text-yellow-400', label: 'Migrated' },
};

function ActivityItem({ activity }: { activity: Activity }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;
  const time = formatActivityTime(activity.timestamp);

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center", config.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm text-text-primary font-medium">
            {activity.projectName}
            <span className="text-text-muted text-xs ml-2">${activity.projectTicker}</span>
          </p>
          <p className="text-xs text-text-muted">{time}</p>
        </div>
      </div>
      <span className={cn("text-xs font-medium", config.color)}>
        {activity.value}
      </span>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white/10 rounded", className)} />
  );
}

export function LiveActivityFeed({ 
  userId, 
  maxItems = 10, 
  showGlobal = false
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    let unsubscribe: (() => void) | undefined;

    if (showGlobal) {
      // Subscribe to global activity
      unsubscribe = subscribeToGlobalActivity((newActivities) => {
        setActivities(newActivities);
        setLoading(false);
      }, maxItems);
    } else if (userId) {
      // Subscribe to user's activity
      unsubscribe = subscribeToUserActivity(userId, (newActivities) => {
        setActivities(newActivities);
        setLoading(false);
      }, maxItems);
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, showGlobal, maxItems]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-14" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-sm">No activity yet</p>
        <p className="text-xs mt-1">
          {showGlobal ? "New votes and claims will appear here" : "Your votes, claims, and nominations will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
