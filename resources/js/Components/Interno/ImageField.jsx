import { useEffect, useState } from 'react';

export default function ImageField({ label, currentUrl, file, onFile, quitar, onQuitar }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file) { setPreview(null); return; }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const mostrar = preview || (!quitar ? currentUrl : null);

    return (
        <div>
            <div className="mb-1.5 text-xs font-medium text-navy-500">{label}</div>
            <div className="flex items-center gap-3">
                {mostrar ? (
                    <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-mist-100">
                        <img src={mostrar} alt="" className="h-full w-full object-contain" />
                    </div>
                ) : (
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-mist-100 text-[10px] text-ink-500">Sin foto</div>
                )}
                <div className="flex flex-col gap-1.5">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFile(e.target.files[0] ?? null)}
                        className="text-[12.5px] text-navy-600"
                    />
                    {currentUrl && !file && (
                        <label className="flex items-center gap-1.5 text-xs text-navy-500">
                            <input type="checkbox" checked={quitar} onChange={(e) => onQuitar(e.target.checked)} />
                            Quitar imagen actual
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}
