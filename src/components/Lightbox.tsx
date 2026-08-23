import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  urls: string[];
  captions: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ urls, captions, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-marine-card/80 text-marine-text hover:bg-marine-hover transition"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 p-3 rounded-full bg-marine-card/80 text-marine-text hover:bg-marine-hover transition"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 p-3 rounded-full bg-marine-card/80 text-marine-text hover:bg-marine-hover transition"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <figure
        className="max-w-5xl max-h-[90vh] flex flex-col items-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={urls[index]}
          alt={captions[index] || "Schematic"}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
        />
        {captions[index] && (
          <figcaption className="mt-3 text-sm text-marine-muted text-center">
            {captions[index]}{" "}
            <span className="text-marine-text/60">
              ({index + 1} / {urls.length})
            </span>
          </figcaption>
        )}
      </figure>
    </div>
  );
}
