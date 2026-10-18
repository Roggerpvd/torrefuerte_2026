import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-fg/8 bg-[rgb(var(--tf-glass-rgb)/0.1)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-screen-2xl px-6 py-10 md:px-12">
        <div className="flex flex-col gap-6 text-sm text-muted md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-headline text-base font-bold uppercase tracking-tight text-fg">
              {site.name}
            </p>
            <p className="mt-1 max-w-sm">{site.tagline}</p>
          </div>

          <div className="space-y-1">
            <p>{site.address}</p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                {site.email}
              </a>
            </p>
            <p>{site.phones.join(" / ")}</p>
          </div>
        </div>

        <p className="mt-8 border-t border-line/60 pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {site.name} {site.descriptor}. RUC {site.ruc}.
        </p>
      </div>
    </footer>
  );
}
