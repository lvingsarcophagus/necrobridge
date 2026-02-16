interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
}

export function StatsCard({ label, value, subtext, icon }: StatsCardProps) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold text-text-primary">{value}</p>
      {subtext && <p className="text-xs text-text-muted mt-1">{subtext}</p>}
    </div>
  );
}
