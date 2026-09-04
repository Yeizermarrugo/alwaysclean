import { useEffect } from 'react';

export default function Lightbox({ imagenes, index, onClose, onChange }) {
    useEffect(() => {
        if (index === null) return;

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onChange((index + 1) % imagenes.length);
            if (e.key === 'ArrowLeft') onChange((index - 1 + imagenes.length) % imagenes.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [index, imagenes.length, onClose, onChange]);

    if (index === null) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy-deep/95 px-4 py-6" onClick={onClose}>
            <div className="flex items-center justify-between text-white">
                <span className="font-display text-sm font-semibold">{index + 1} / {imagenes.length}</span>
                <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-xl hover:bg-white/10">✕</button>
            </div>

            <div className="relative flex flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {imagenes.length > 1 && (
                    <button
                        onClick={() => onChange((index - 1 + imagenes.length) % imagenes.length)}
                        className="absolute left-0 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
                    >
                        ‹
                    </button>
                )}
                <img src={imagenes[index].imagen_url} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
                {imagenes.length > 1 && (
                    <button
                        onClick={() => onChange((index + 1) % imagenes.length)}
                        className="absolute right-0 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
                    >
                        ›
                    </button>
                )}
            </div>

            {imagenes.length > 1 && (
                <div className="flex justify-center gap-2 overflow-x-auto pt-3" onClick={(e) => e.stopPropagation()}>
                    {imagenes.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => onChange(i)}
                            className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? 'border-green' : 'border-transparent opacity-60'}`}
                        >
                            <img src={img.imagen_url} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
