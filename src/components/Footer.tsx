import { Mail, Wrench } from "lucide-react";

type Props = {
  contactEmail?: string;
};

export function Footer({ contactEmail = "marinerdk001@gmail.com" }: Props) {
  return (
    <footer className="border-t border-marine-border bg-marine-dark/40 py-8 px-6 lg:px-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <span className="text-marine-accent text-xl">⚓</span>
          <span className="font-bold text-marine-text tracking-wide">MARINE FIX</span>
          <span className="text-xs text-marine-muted ml-2">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-marine-muted">
          <div className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-marine-accent" />
            <span>Built for ETOs &amp; Marine Engineers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-marine-muted">Contact:</span>
            <a
              href={`mailto:${contactEmail}?subject=Marine%20Fix%20Support%20/%20Feedback`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-marine-card border border-marine-border text-marine-accent hover:border-marine-accent/60 transition font-medium"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{contactEmail}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}