export default function PlaceholderPhoto({ hint, className = '', rounded = '' }) {
    return (
        <div
            className={`relative flex items-end bg-[repeating-linear-gradient(135deg,#DFE2EE_0_9px,#EDEFF6_9px_18px)] ${rounded} ${className}`}
        >
            {hint && (
                <span className="m-2 rounded bg-white px-1.5 py-1 font-mono text-[10px] text-navy-600">
                    {hint}
                </span>
            )}
        </div>
    );
}
