import { useEffect } from 'react';

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? 'ca-pub-XXXXXXXXXXXXXXXX';
const ADSENSE_SCRIPT_ID = 'adsbygoogle-script';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdBannerProps = {
  adSlot: string;
  className?: string;
  height?: number;
};

export const AdBanner = ({ adSlot, className, height = 250 }: AdBannerProps) => {
  const isConfigured = ADSENSE_CLIENT && !ADSENSE_CLIENT.includes('XXXXXXXXXXXXXX');

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const initializeAds = () => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.warn('No se pudo inicializar adsbygoogle', error);
      }
    };

    if (!document.getElementById(ADSENSE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.crossOrigin = 'anonymous';
      script.addEventListener('load', initializeAds);
      document.head.appendChild(script);
      return () => {
        script.removeEventListener('load', initializeAds);
      };
    }

    initializeAds();

    return undefined;
  }, [isConfigured]);

  const containerClasses = ['overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-2', className]
    .filter(Boolean)
    .join(' ');

  if (!isConfigured) {
    return (
      <div className={containerClasses} style={{ minHeight: height + 16 }}>
        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
          Próximamente verás contenido relevante para tu comunidad aquí.
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} style={{ minHeight: height + 16 }}>
      <ins
        className="adsbygoogle block h-full w-full"
        style={{ display: 'block', width: '100%', height }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="false"
      />
    </div>
  );
};
