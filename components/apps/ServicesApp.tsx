import { services } from "@/data/services";
import { IndexDetailList } from "@/components/shared/IndexDetailList";

interface Service {
  title: string;
  description: string;
}

export function ServicesApp() {
  return (
    <IndexDetailList<Service>
      items={services}
      getId={(s) => s.title}
      getTitle={(s) => s.title}
      renderDetail={(service) => (
        <div className="space-y-3">
          <h3 className="font-sans font-semibold text-2xl text-heading">{service.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{service.description}</p>
        </div>
      )}
    />
  );
}
