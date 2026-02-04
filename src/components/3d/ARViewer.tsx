"use client";
import { useEffect, useState } from "react";

/* Déclaration du web component Google Model Viewer pour TypeScript */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean | string;
          "ar-modes"?: string;
          "camera-controls"?: boolean | string;
          "shadow-intensity"?: string;
          poster?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface Props {
  modelUrl: string;
  modelArIosUrl?: string | null;
  dishName: string;
}

export default function ARViewer({ modelUrl, modelArIosUrl, dishName }: Props) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
  }, []);

  /* iOS : Quick Look via lien USDZ */
  if (isIOS && modelArIosUrl) {
    return (
      <div className="p-6 flex flex-col items-center gap-4 bg-gray-900 text-white">
        <p className="text-sm text-white/55 text-center">
          Appuyez ci-dessous pour placer <strong>{dishName}</strong> sur votre table en réalité augmentée.
        </p>
        <a
          href={modelArIosUrl}
          rel="ar quicklook"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 transition-colors"
        >
          📱 Ouvrir en AR (Quick Look)
        </a>
        <p className="text-xs text-white/30 text-center">
          Votre caméra s'activera automatiquement pour poser le plat sur une surface.
        </p>
      </div>
    );
  }

  /* Android / Desktop : Google Model Viewer avec bouton AR natif */
  return (
    <div className="w-full bg-gray-900 text-white relative">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <model-viewer
        src={modelUrl}
        alt={dishName}
        ar={true}
        ar-modes="webxr scene-viewer"
        camera-controls={true}
        shadow-intensity="1"
        style={{ width: "100%", height: "320px", display: "block" }}
      >
        {/* Bouton AR – rendu natif par Model Viewer */}
        <button
          slot="ar-button"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg transition-colors"
        >
          📱 Voir sur ma table
        </button>

        {/* Fallback si AR non supporté */}
        <div slot="fallback" className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-white/45 text-sm">
            La réalité augmentée n'est pas disponible sur cet appareil.
          </p>
          <p className="text-white/25 text-xs">
            Utilisez Chrome sur Android ou Safari sur iOS pour activer l'AR.
          </p>
        </div>
      </model-viewer>
    </div>
  );
}
