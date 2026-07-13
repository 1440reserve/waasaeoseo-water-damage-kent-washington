import type { Area, Guide, Service } from "./content";

/**
 * Hub-and-spoke internal linking, resolved from frontmatter taxonomy.
 * Relationships are declared on either side (service lists areas, or
 * area lists services) and unioned, so a single edit creates the link.
 * The web: service <-> area, guide -> service/area, every edge declared
 * once and linked both ways. The homepage is the hub for the head topic
 * (water damage restoration); services and areas are its spokes.
 */

export function areasForService(service: Service, areas: Area[]): Area[] {
  return areas.filter(
    (a) => service.fm.areas.includes(a.fm.id) || a.fm.services.includes(service.fm.id)
  );
}

export function servicesForArea(area: Area, services: Service[]): Service[] {
  return services.filter(
    (s) => area.fm.services.includes(s.fm.id) || s.fm.areas.includes(area.fm.id)
  );
}

export function relatedServices(service: Service, services: Service[]): Service[] {
  const explicit = services.filter((s) => service.fm.related.includes(s.fm.id));
  if (explicit.length > 0) return explicit;
  return services.filter((s) => s.fm.id !== service.fm.id).slice(0, 3);
}

export function relatedAreas(area: Area, areas: Area[]): Area[] {
  const explicit = areas.filter((a) => area.fm.related.includes(a.fm.id));
  if (explicit.length > 0) return explicit;
  return areas.filter((a) => a.fm.id !== area.fm.id).slice(0, 3);
}

export function guidesForService(service: Service, guides: Guide[]): Guide[] {
  return guides.filter((g) => g.fm.service === service.fm.id);
}

export function guidesForArea(area: Area, guides: Guide[]): Guide[] {
  return guides.filter((g) => g.fm.area === area.fm.id);
}
