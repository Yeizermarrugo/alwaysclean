export default function Tag({ children, tone = 'neutral', className = '' }) {
    const tones = {
        neutral: 'bg-mist-100 text-navy-700',
        green: 'bg-green-light text-green-dark',
        outline: 'border border-mist-border text-navy-700',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${tones[tone]} ${className}`}>
            {children}
        </span>
    );
}
