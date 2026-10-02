export function ResumeApp() {
  return <div className="resume-view">
    <div className="resume-toolbar"><div><h2 className="font-semibold text-heading">Elisha Lema</h2><p className="text-xs text-muted">Designer & developer · CV</p></div><div className="flex flex-wrap gap-2"><a href="/works/cv.pdf" target="_blank" rel="noopener noreferrer" className="button-secondary">Open PDF ↗</a><a href="/works/cv.pdf" download className="button-primary">Download</a></div></div>
    <p className="px-5 py-3 text-xs text-muted">If the preview is unavailable on your device, open or download the PDF above.</p>
    <object data="/works/cv.pdf" type="application/pdf" className="min-h-64 flex-1 w-full" aria-label="Elisha Lema CV"><p className="p-6">Your browser cannot preview this PDF. <a className="underline" href="/works/cv.pdf">Open the CV</a>.</p></object>
  </div>;
}
