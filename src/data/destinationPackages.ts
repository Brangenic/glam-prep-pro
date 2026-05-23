export type Package = {
  name: string;
  price: string;
  image: string;
};

export type PackageSection = {
  title?: string;
  packages: Package[];
};

export type DestinationPackages = {
  eventTitle: string;
  eventDate: string;
  bookingUrl: string;
  sections: PackageSection[];
};

const IMG = "https://cdn.masos.app/image/public/4e18697d-59c0-432a-b1ae-5772fef28018";

export const destinationPackages: Record<string, DestinationPackages> = {
  miami: {
    eventTitle: "Miami - Carnival Glam Hub 2026",
    eventDate: "11 October 2026",
    bookingUrl: "https://carnivalglamhub.masos.app/events/d6238a3f-73d0-4805-a3f2-91e8b4415047",
    sections: [
      {
        packages: [
          { name: "Gabby Glam Team Makeup Only", price: "$240 USD", image: `${IMG}/886b1ff3-8a4d-4751-85e4-499826e16f4f/462x578` },
          { name: "Gabby Glam Team Makeup & Photoshoot", price: "$360 USD", image: `${IMG}/56e1ec62-cc5d-49b9-ba89-d4866e4c5025/462x578` },
          { name: "Makeup Only", price: "$190 USD", image: `${IMG}/95e3c95d-af8b-495d-958a-b99c5ecebe07/462x578` },
          { name: "Makeup and Photoshoot", price: "$310 USD", image: `${IMG}/4e231432-37bd-4ad0-88cc-c6fa3c1edaad/462x578` },
          { name: "Full Glam - Makeup, Hair, Photoshoot, Breakfast", price: "$430 USD", image: `${IMG}/28660f96-318f-413d-9775-c2af3a936725/462x578` },
          { name: "Hair Glam", price: "$130 USD", image: `${IMG}/9a89db39-7597-4c52-9cef-fc8d280dd84d/462x578` },
          { name: "Photoshoot Only", price: "$150 USD", image: `${IMG}/66112a52-fe25-4d93-afb8-f615be833d94/462x578` },
          { name: "His Glam", price: "$25 USD", image: `${IMG}/ca5d1e5a-5e06-4d17-80ad-b9698a2a06a8/462x578` },
          { name: "Get Dressed", price: "$25 USD", image: `${IMG}/1ca31c94-51b3-49e1-a711-45da60e5c8c4/462x578` },
          { name: "Bring A Friend", price: "$25 USD", image: `${IMG}/ff0a158d-37e6-4ad1-928e-c5eb2cc48ddf/462x578` },
        ],
      },
    ],
  },
  antigua: {
    eventTitle: "Antigua - Carnival Glam Hub 2026",
    eventDate: "4 August 2026",
    bookingUrl: "https://carnivalglamhub.masos.app/events/5ff02f96-f867-4e59-9ca8-f88a48eafb44",
    sections: [
      {
        title: "Antigua - Monday Carnival Glam Hub 2026",
        packages: [
          { name: "Monday & Tuesday Makeup Only", price: "$325 USD", image: `${IMG}/b846bf14-44e9-42b7-afad-a2c97fbbc948/462x578` },
          { name: "Monday Makeup Only", price: "$170 USD", image: `${IMG}/eea0e820-5518-41a5-b003-2068fbfaebbb/462x578` },
          { name: "Monday Hair Only", price: "$120 USD", image: `${IMG}/bfa10859-26fe-42c2-b1f5-d3a489aa10ef/462x578` },
          { name: "Monday Photoshoot Only", price: "$140 USD", image: `${IMG}/bb63ae4c-2159-4f7e-ab0e-e419073d71d9/462x578` },
          { name: "Monday Bronzing", price: "$160 USD", image: `${IMG}/dc8c705a-26fe-4373-b869-5d738180b664/462x578` },
          { name: "Monday Shuttle Services", price: "$35 USD", image: `${IMG}/033de542-1958-4817-b7b7-5eaeb5454e3f/462x578` },
          { name: "Monday Bring A Friend", price: "$35 USD", image: `${IMG}/63f3a780-f578-4644-ae9b-35866962460e/462x578` },
        ],
      },
      {
        title: "Antigua - Tuesday Carnival Glam Hub 2026",
        packages: [
          { name: "Tuesday Makeup Only", price: "$185 USD", image: `${IMG}/bfc2a7dc-c7a7-4804-8bf4-6f25c09c8ca5/462x578` },
          { name: "Tuesday Hair Only", price: "$120 USD", image: `${IMG}/7f6133be-419b-47f5-9687-a486a5013ce9/462x578` },
          { name: "Tuesday Photoshoot Only", price: "$140 USD", image: `${IMG}/09cafbeb-665d-498a-ae5b-8bf067528b3c/462x578` },
          { name: "Tuesday Bronzing", price: "$160 USD", image: `${IMG}/dc8c705a-26fe-4373-b869-5d738180b664/462x578` },
          { name: "Tuesday Shuttle Services", price: "$35 USD", image: `${IMG}/1c384903-2cfe-45f3-ac0e-ef8982fad08b/462x578` },
        ],
      },
    ],
  },
  "saint-lucia": {
    eventTitle: "St. Lucia - Carnival Glam Hub 2026",
    eventDate: "20-21 July 2026",
    bookingUrl: "https://carnivalglamhub.masos.app/events/060faa4a-949a-4b36-893e-dc6db75e3100",
    sections: [
      {
        packages: [
          { name: "Monday Makeup Only", price: "$200 USD", image: `${IMG}/7966cf66-49d7-477e-aaf8-7191894d28a6/462x578` },
          { name: "Monday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/ef8f7fd3-9a89-4621-adc8-426319de66a9/462x578` },
          { name: "Monday Makeup & Photoshoot + Bronzing", price: "$450 USD", image: `${IMG}/3979787b-0455-4b14-abee-a057919ffe78/462x578` },
          { name: "Tuesday Makeup ONLY", price: "$185 USD", image: `${IMG}/8fc65c53-8edb-47bd-a79c-f1f628fcad2b/462x578` },
          { name: "Monday Hair Only", price: "$120 USD", image: `${IMG}/5597720a-1b7f-4d41-83f5-23d53672a129/462x578` },
          { name: "Photoshoot Only", price: "$160 USD", image: `${IMG}/6314aa19-afb8-4d84-81e5-33981fd8cd07/462x578` },
          { name: "His Glam - Barber", price: "$35 USD", image: `${IMG}/2cb008bb-8cad-44dd-ac3f-9cca7da601cb/462x578` },
          { name: "Bring A Friend", price: "$25 USD", image: `${IMG}/903621bc-7894-4a31-aeb0-a667acde53e0/462x578` },
        ],
      },
    ],
  },
  toronto: {
    eventTitle: "Toronto - Carnival Glam Hub 2026",
    eventDate: "1 August 2026",
    bookingUrl: "https://carnivalglamhub.masos.app/events/9d7627f9-f1ea-4e3d-a54b-1898f9a7a98f",
    sections: [
      {
        packages: [
          { name: "Toronto Makeup Only", price: "$200 USD", image: `${IMG}/f53b2578-e4c5-4dc6-a513-f92de8bb9076/462x578` },
          { name: "Toronto Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/e8386507-f1ea-41f8-9759-865dd5201907/462x578` },
          { name: "Toronto Photoshoot Only", price: "$160 USD", image: `${IMG}/a598108c-1200-4a38-9066-f3ad49c2fce4/462x578` },
        ],
      },
    ],
  },
  barbados: {
    eventTitle: "Barbados - Carnival Glam Hub 2026",
    eventDate: "3 August 2026",
    bookingUrl: "https://carnivalglamhub.masos.app/events/d76deb6d-c816-4df6-9006-05a11a555c43",
    sections: [
      {
        packages: [
          { name: "Barbados Makeup Only", price: "$200 USD", image: `${IMG}/a39eac39-bc91-41bd-9678-b180a5d93bca/462x578` },
          { name: "Barbados Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/25d95f01-9a5e-4119-af83-6d24be3983ab/462x578` },
          { name: "Barbados Photoshoot Only", price: "$160 USD", image: `${IMG}/d7b4e4b8-f210-46e5-b0cb-9eeb1027e492/462x578` },
        ],
      },
    ],
  },
  grenada: {
    eventTitle: "Grenada - Carnival Glam Hub 2026",
    eventDate: "10-11 August 2026",
    bookingUrl: "https://carnivalglamhub.masos.app/events/686e90eb-f3dc-4a83-ba43-86eada51ffe0",
    sections: [
      {
        title: "Monday 10 August 2026",
        packages: [
          { name: "Monday Makeup Only", price: "$200 USD", image: `${IMG}/ec4469ec-f72b-4176-934c-f3c11325f1d3/462x578` },
          { name: "Monday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/8753e929-2f12-481b-a8f2-75d619ddbb2b/462x578` },
          { name: "Monday Photoshoot Only", price: "$160 USD", image: `${IMG}/09cafbeb-665d-498a-ae5b-8bf067528b3c/462x578` },
          { name: "Monday Get Dressed Only", price: "$25 USD", image: `${IMG}/4f1a1512-8dd1-4490-ba82-bf2820fee14e/462x578` },
        ],
      },
      {
        title: "Tuesday 11 August 2026",
        packages: [
          { name: "Tuesday Makeup Only", price: "$200 USD", image: `${IMG}/d859444f-a9d1-4c1e-9350-f0d49324bf5d/462x578` },
          { name: "Tuesday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/59439c7d-8c5b-4950-8c5f-7f4338e365d9/462x578` },
          { name: "Tuesday Photoshoot Only", price: "$160 USD", image: `${IMG}/09cafbeb-665d-498a-ae5b-8bf067528b3c/462x578` },
          { name: "Tuesday Get Dressed Only", price: "$25 USD", image: `${IMG}/4f1a1512-8dd1-4490-ba82-bf2820fee14e/462x578` },
        ],
      },
    ],
  },
};

export const getDestinationPackages = (slug: string) => destinationPackages[slug];
