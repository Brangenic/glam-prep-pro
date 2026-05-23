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
          { name: "Tuesday Makeup Only", price: "$185 USD", image: `${IMG}/8fc65c53-8edb-47bd-a79c-f1f628fcad2b/462x578` },
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
  trinidad: {
    eventTitle: "Trinidad - Carnival Glam Hub 2027",
    eventDate: "8-9 February 2027",
    bookingUrl: "https://carnivalglamhub.masos.app/events/cef3860d-c2e6-4753-a065-4ea39c0eb8cb",
    sections: [
      {
        title: "Monday 8 February 2027",
        packages: [
          { name: "Gabby Glam Team Monday Makeup Only", price: "$250 USD", image: `${IMG}/ec4fe656-22ef-4f5d-94ac-88caad314d98/462x578` },
          { name: "Gabby Glam Team Monday Makeup & Photoshoot", price: "$370 USD", image: `${IMG}/e67cf4d5-6cb6-415e-bb85-a63772402f1e/462x578` },
          { name: "Trinidad Monday Makeup Only", price: "$180 USD", image: `${IMG}/7cc50573-b1af-423a-b00f-da2abaf1896e/462x578` },
          { name: "Trinidad Monday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/b6e9cb02-ea71-4bd4-8a3f-fd31e30a483e/462x578` },
          { name: "Trinidad Monday Full Glam", price: "$440 USD", image: `${IMG}/c5dba60c-4280-4504-8fdb-ec201a3a55fb/462x578` },
          { name: "Trinidad Monday Makeup & Photoshoot + Bronzing", price: "$480 USD", image: `${IMG}/4f28b357-f347-4909-8636-d44ed0fd3fa5/462x578` },
          { name: "Trinidad Monday Photoshoot Only", price: "$160 USD", image: `${IMG}/66c1579a-5d62-4803-be13-f57bd7fea92d/462x578` },
          { name: "Trinidad Monday Hair Only", price: "$120 USD", image: `${IMG}/f008bb25-80bc-4733-b1a2-3ea0e4ca5650/462x578` },
          { name: "Monday Front Braided Ponytail", price: "$185 USD", image: `${IMG}/a39e49a4-c984-4d09-afec-0e4ae2fa9d5d/462x578` },
          { name: "Monday Half Up Half Down Ponytail", price: "$220 USD", image: `${IMG}/b479d4d8-d245-4a2f-8029-754fea039020/462x578` },
          { name: "Trinidad Monday His Glam", price: "$35 USD", image: `${IMG}/456ab071-0f85-4fe0-8541-d7410dd465de/462x578` },
          { name: "Monday Chontelle Sewett MUA", price: "$350 USD", image: `${IMG}/9895722c-f90f-4709-951d-82da224f1e45/462x578` },
        ],
      },
      {
        title: "Tuesday 9 February 2027",
        packages: [
          { name: "Gabby Glam Team Tuesday Makeup Only", price: "$250 USD", image: `${IMG}/cd5ca635-209b-4185-82c3-580be33fddac/462x578` },
          { name: "Gabby Glam Team Tuesday Makeup & Photoshoot", price: "$370 USD", image: `${IMG}/1acf94cd-ca39-4200-b409-62428403d5b9/462x578` },
          { name: "Trinidad Tuesday Makeup Only", price: "$200 USD", image: `${IMG}/80ed37c5-125b-4c29-832f-9c4016feb014/462x578` },
          { name: "Trinidad Tuesday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/79ce4fac-414f-4cfe-95fa-e31ad5de18fc/462x578` },
          { name: "Trinidad Tuesday Full Glam", price: "$440 USD", image: `${IMG}/8255cfa7-1c9c-415d-a4c6-ae0628625a36/462x578` },
          { name: "Trinidad Tuesday Makeup & Photoshoot + Bronzing", price: "$480 USD", image: `${IMG}/f832281b-cd40-442e-8d7d-a8075c52bd56/462x578` },
          { name: "Tuesday Chontelle Sewett MUA", price: "$350 USD", image: `${IMG}/9895722c-f90f-4709-951d-82da224f1e45/462x578` },
          { name: "Tuesday Chontelle Sewett MUA Team", price: "$250 USD", image: `${IMG}/9895722c-f90f-4709-951d-82da224f1e45/462x578` },
          { name: "Trinidad Tuesday Photoshoot Only", price: "$160 USD", image: `${IMG}/d60f1246-a372-4bc4-aec7-9cfe760d01b6/462x578` },
          { name: "Tuesday Bronzing", price: "$160 USD", image: `${IMG}/dc8c705a-26fe-4373-b869-5d738180b664/462x578` },
          { name: "Trinidad Tuesday Hair Only", price: "$120 USD", image: `${IMG}/dcfa0d3f-e8a0-4c3a-a5cc-90b5dd4a61e5/462x578` },
          { name: "Tuesday Front Braided Ponytail", price: "$185 USD", image: `${IMG}/cd724402-a680-4460-9948-937110ea08e8/462x578` },
        ],
      },
      {
        title: "Both Days",
        packages: [
          { name: "BOTH DAYS Gabby Glam Team Makeup Only", price: "$480 USD", image: `${IMG}/cf93d4d6-cb97-4375-9cb7-7559e615ee56/462x578` },
          { name: "BOTH DAYS Gabby Glam Team Makeup & Photoshoot", price: "$580 USD", image: `${IMG}/d430f4e7-f1f8-4ec7-894c-22078daed4bc/462x578` },
          { name: "BOTH DAYS Makeup Only", price: "$380 USD", image: `${IMG}/8452bcff-aec4-41d3-ad52-925d1778ed55/462x578` },
          { name: "BOTH DAYS Makeup & Photoshoot", price: "$480 USD", image: `${IMG}/6554cb14-b736-4986-89b8-cf0c426fd985/462x578` },
          { name: "BOTH DAYS Full Glam", price: "$680 USD", image: `${IMG}/2b4a26fe-7f26-4c9d-a94f-14ab16125f7b/462x578` },
        ],
      },
    ],
  },
  "epic-cruise": {
    eventTitle: "EPIC Carnival Experience x Carnival Glam Hub Trinidad 2027",
    eventDate: "8–9 February 2027",
    bookingUrl: "https://carnivalglamhub.masos.app/events/ce2934a4-386a-4dea-8d3f-180daca7b244",
    sections: [
      {
        title: "Carnival Monday — 8 February 2027",
        packages: [
          { name: "Epic Monday Makeup Only", price: "$200 USD", image: `${IMG}/1be30ffc-a933-4584-95a6-5c3a53dae31b/462x578` },
          { name: "Epic Monday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/c612f252-aa7e-4948-aa4d-74fd19b0fcff/462x578` },
          { name: "Epic Monday Full Glam", price: "$440 USD", image: `${IMG}/ae62a7f1-1792-4bdb-a08b-07bd0485610f/462x578` },
          { name: "Epic Monday Hair Only", price: "$120 USD", image: `${IMG}/ad03a043-b7e5-4a21-ba02-8f7f7813c5fd/462x578` },
          { name: "Epic Monday Photoshoot Only", price: "$140 USD", image: `${IMG}/bf778c82-79c6-48ec-872e-429d12597a64/462x578` },
          { name: "Get Dressed Monday", price: "$35 USD", image: `${IMG}/fd35ec54-3395-4541-a3fe-4aee45752d54/462x578` },
        ],
      },
      {
        title: "Carnival Tuesday — 9 February 2027",
        packages: [
          { name: "Epic Tuesday Makeup Only", price: "$200 USD", image: `${IMG}/421b5290-2aa0-46fb-9333-f5a49c4bd625/462x578` },
          { name: "Epic Tuesday Makeup & Photoshoot", price: "$320 USD", image: `${IMG}/07b521e4-d70b-49ed-8323-20ab10c4a750/462x578` },
          { name: "Epic Tuesday Full Glam", price: "$440 USD", image: `${IMG}/ad16985b-bbbb-4ca7-a780-5dcb901d0fce/462x578` },
          { name: "Epic Tuesday Hair Only", price: "$120 USD", image: `${IMG}/6ce6d73f-f5ef-41b5-9c38-5cdcaa1f7a82/462x578` },
          { name: "Epic Tuesday Photoshoot Only", price: "$160 USD", image: `${IMG}/9ab12d2f-a488-4926-802e-66bdc4f7aff7/462x578` },
          { name: "Get Dressed Tuesday", price: "$35 USD", image: `${IMG}/fd35ec54-3395-4541-a3fe-4aee45752d54/462x578` },
        ],
      },
    ],
  },
};

export const getDestinationPackages = (slug: string) => destinationPackages[slug];
