export function Footer() {
  return (
    <footer className="px-6 pb-12 pt-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-slate-200/80 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">maya</p>
          <p className="mt-1">AI-powered rehearsal for real-world communication.</p>
        </div>
        <div className="flex gap-6">
          <a href="#product" className="transition hover:text-slate-900">
            Product
          </a>
          <a href="#pricing" className="transition hover:text-slate-900">
            Pricing
          </a>
          <a href="#download" className="transition hover:text-slate-900">
            Download
          </a>
        </div>
      </div>
    </footer>
  );
}
