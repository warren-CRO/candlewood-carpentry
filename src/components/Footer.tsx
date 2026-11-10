import { PHONE, PHONE_HREF, EMAIL, SERVICE_AREAS, COMPANY, OWNER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#081522] text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center text-xs text-white/60">
          <div>
            <strong className="text-white font-extrabold">{COMPANY}</strong>
            <br />
            {OWNER} &bull; Candlewood Lake area
          </div>
          <div>
            <a href={`mailto:${EMAIL}`} className="text-white font-extrabold hover:underline">
              {EMAIL}
            </a>
          </div>
          <div>
            <a href={PHONE_HREF} className="text-white font-extrabold hover:underline">
              {PHONE}
            </a>
          </div>
          <div className="text-right">
            &copy; {new Date().getFullYear()} {COMPANY}
          </div>
        </div>
      </div>
    </footer>
  );
}
