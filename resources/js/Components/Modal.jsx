export default function Modal({ open, onClose, title, size = 'md', children }) {
    if (!open) return null;

    const widths = {
        md: 'max-w-lg',
        lg: 'max-w-3xl',
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-deep/50 px-4 py-8" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`max-h-[90vh] w-full ${widths[size]} overflow-y-auto rounded-xl bg-white shadow-xl`}
            >
                <div className="sticky top-0 flex items-center justify-between border-b border-mist-300 bg-white px-6 py-4">
                    <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
                    <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-navy-500 hover:bg-mist-100">✕</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
