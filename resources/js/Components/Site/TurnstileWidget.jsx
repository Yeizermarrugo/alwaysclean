import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Widget de Cloudflare Turnstile. `onToken('')` cuando expira.
 * El token es de un solo uso: llamar `ref.current.reset()` después de cada envío.
 */
const TurnstileWidget = forwardRef(function TurnstileWidget({ siteKey, onToken }, ref) {
    const contenedor = useRef(null);
    const widgetId = useRef(null);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useImperativeHandle(ref, () => ({
        reset: () => {
            if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
            onTokenRef.current('');
        },
    }));

    useEffect(() => {
        if (!siteKey) return;

        const render = () => {
            if (!contenedor.current || widgetId.current !== null) return;
            widgetId.current = window.turnstile.render(contenedor.current, {
                sitekey: siteKey,
                language: 'es',
                theme: 'light',
                callback: (token) => onTokenRef.current(token),
                'expired-callback': () => onTokenRef.current(''),
            });
        };

        if (window.turnstile) {
            render();
        } else {
            let script = document.querySelector('script[data-turnstile]');
            if (!script) {
                script = document.createElement('script');
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.dataset.turnstile = '';
                document.head.appendChild(script);
            }
            script.addEventListener('load', render);
        }

        return () => {
            if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
            widgetId.current = null;
        };
    }, [siteKey]);

    return <div ref={contenedor} />;
});

export default TurnstileWidget;
