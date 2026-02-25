import { FC } from 'react';

interface CryptoIconProps {
    ticker: string;
    className?: string;
    size?: number;
}

// Special emoji/text fallbacks for tokens without coin icons
const SPECIAL_FALLBACKS: Record<string, { label: string; color: string }> = {
    OHM: { label: 'Ω', color: '#a0a0a0' },
    TOMB: { label: '👻', color: '#60a5fa' },
    TIME: { label: '⌛', color: '#fdba74' },
    TITAN: { label: 'T', color: '#c084fc' },
    // Aliases
    POL: { label: '◆', color: '#8247e5' }, // Polygon rebrand
};

export const CryptoIcon: FC<CryptoIconProps> = ({ ticker, className = '', size = 24 }) => {
    const lower = ticker.toLowerCase();
    const upper = ticker.toUpperCase();

    const special = SPECIAL_FALLBACKS[upper];
    if (special) {
        return (
            <div
                className={`flex items-center justify-center rounded-full bg-white/5 border border-white/10 ${className}`}
                style={{ width: size, height: size }}
            >
                <span style={{ color: special.color, fontSize: size * 0.45, lineHeight: 1 }}>
                    {special.label}
                </span>
            </div>
        );
    }

    // Try to load from cryptocurrency-icons (served from /public/crypto-icons/)
    // The files are named by lowercase ticker, e.g. eth.svg, btc.svg
    const iconPath = `/crypto-icons/${lower}.svg`;

    return (
        <img
            src={iconPath}
            alt={ticker}
            width={size}
            height={size}
            className={className}
            style={{ objectFit: 'contain' }}
            onError={(e) => {
                // Graceful fallback: replace broken img with ticker initials
                const target = e.currentTarget;
                const parent = target.parentElement;
                if (!parent) return;

                // Create a fallback div
                const fallback = document.createElement('div');
                fallback.style.width = `${size}px`;
                fallback.style.height = `${size}px`;
                fallback.style.display = 'flex';
                fallback.style.alignItems = 'center';
                fallback.style.justifyContent = 'center';
                fallback.style.borderRadius = '50%';
                fallback.style.background = 'rgba(255,255,255,0.08)';
                fallback.style.border = '1px solid rgba(255,255,255,0.15)';
                fallback.style.fontSize = `${size * 0.32}px`;
                fallback.style.fontWeight = 'bold';
                fallback.style.color = 'rgba(255,255,255,0.6)';
                fallback.style.fontFamily = 'monospace';
                fallback.textContent = upper.slice(0, 3);
                fallback.className = target.className;
                parent.replaceChild(fallback, target);
            }}
        />
    );
};
