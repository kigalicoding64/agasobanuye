import { ImigongoMark, ImigongoStrip } from "./ImigongoMotif";

const PAYMENT_METHODS = ["MTN Mobile Money", "Airtel Money", "Visa / Mastercard", "PayPal"];

export default function Footer() {
  return (
    <div className="border-t border-border mt-10">
      <ImigongoStrip height={6} />
      <div className="px-4 md:px-10 py-10 grid md:grid-cols-3 gap-8 bg-bgAlt">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ImigongoMark size={24} />
            <span className="font-display font-bold text-lg">Iwacu</span>
          </div>
          <p className="text-sm text-muted max-w-xs">
            Rwandan stories, told at home and watched everywhere. Streaming in Kinyarwanda, English, and French.
          </p>
        </div>
        <div>
          <p className="text-xs font-mono text-mutedDark mb-3">PAYMENT METHODS</p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="text-xs border border-border rounded px-2 py-1 text-muted">{m}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-mono text-mutedDark mb-3">CONTACT</p>
          <p className="text-sm text-muted">support@iwacumovies.com</p>
        </div>
      </div>
      <p className="text-center text-xs text-mutedDark py-3 border-t border-border">© 2026 Iwacu Movies</p>
    </div>
  );
}
