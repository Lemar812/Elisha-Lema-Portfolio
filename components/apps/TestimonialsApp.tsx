import { testimonials } from "@/data/testimonials";
import { IndexDetailList } from "@/components/shared/IndexDetailList";

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

export function TestimonialsApp() {
  return (
    <IndexDetailList<Testimonial>
      items={testimonials}
      getId={(t) => t.name}
      getTitle={(t) => t.name}
      getSubtitle={(t) => t.role}
      renderDetail={(t) => (
        <div className="space-y-4">
          <blockquote className="font-sans font-semibold text-xl leading-snug text-heading">“{t.text}”</blockquote>
          <div>
            <p className="text-sm font-medium text-ink">{t.name}</p>
            <p className="text-xs text-muted">{t.role}</p>
          </div>
        </div>
      )}
    />
  );
}
