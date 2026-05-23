export interface Destination {
  slug: string;
  label: string;
  masosUrl: string;
}

export const DESTINATIONS: Destination[] = [
  { slug: 'saint-lucia', label: 'Saint Lucia', masosUrl: 'https://carnivalglamhub.masos.app/events/060faa4a-949a-4b36-893e-dc6db75e3100' },
  { slug: 'toronto', label: 'Toronto', masosUrl: 'https://carnivalglamhub.masos.app/events/9d7627f9-f1ea-4e3d-a54b-1898f9a7a98f' },
  { slug: 'barbados', label: 'Barbados', masosUrl: 'https://carnivalglamhub.masos.app/events/d76deb6d-c816-4df6-9006-05a11a555c43' },
  { slug: 'antigua', label: 'Antigua', masosUrl: 'https://carnivalglamhub.masos.app/events/5ff02f96-f867-4e59-9ca8-f88a48eafb44' },
  { slug: 'grenada', label: 'Grenada', masosUrl: 'https://carnivalglamhub.masos.app/events/686e90eb-f3dc-4a83-ba43-86eada51ffe0' },
  { slug: 'miami', label: 'Miami', masosUrl: 'https://carnivalglamhub.masos.app/events/d6238a3f-73d0-4805-a3f2-91e8b4415047' },
  { slug: 'trinidad', label: 'Trinidad', masosUrl: 'https://carnivalglamhub.masos.app/events/cef3860d-c2e6-4753-a065-4ea39c0eb8cb' },
  { slug: 'epic', label: 'Epic Carnival Experience', masosUrl: 'https://carnivalglamhub.masos.app/events/ce2934a4-386a-4dea-8d3f-180daca7b244' },
  { slug: 'epic-cruise', label: 'Epic Cruise', masosUrl: 'https://carnivalglamhub.masos.app/events/ce2934a4-386a-4dea-8d3f-180daca7b244' },
  { slug: 'jamaica', label: 'Jamaica', masosUrl: 'https://carnivalglamhub.masos.app/events' },
  { slug: 'guyana', label: 'Guyana', masosUrl: 'https://carnivalglamhub.masos.app/events/a810f2b9-fce4-46be-9b33-5191863e1805' },
];

export function getDestination(slug: string) {
  return DESTINATIONS.find(d => d.slug === slug.toLowerCase());
}

export function buildDestinationUrl(slug: string, campaign = 'destination_selector'): string {
  const dest = getDestination(slug);
  const base = dest?.masosUrl ?? 'https://carnivalglamhub.masos.app/events';
  const params = new URLSearchParams({
    utm_source: 'carnivalglamhub',
    utm_medium: 'website',
    utm_campaign: campaign,
    utm_content: slug,
  });
  return `${base}?${params.toString()}`;
}
