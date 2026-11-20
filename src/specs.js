/** Published figures for INS Kursura (S20) / Project 641 (NATO Foxtrot). */

export const LENGTH = 91.3;
export const MAX_DIAMETER = 8;
export const MAX_HEIGHT = 11.92;
export const DRAUGHT = 6;
export const Y0 = 0.55;

export const DECK_Y = 2.78;
export const EYE = 1.62;
export const PH_R = 2.38;
export const PH_C = DECK_Y + 0.78;

export const COMPARTMENTS = [
  {
    id: 'c1',
    n: 1,
    short: 'Bow tubes',
    name: 'Bow torpedo room',
    x0: 12.0,
    x1: 23.6,
    kicker: 'Compartment 1 of 7',
    body: 'Six 533 mm tubes and the reload racks. The museum route starts here, through a door cut in the forward hull.',
  },
  {
    id: 'c2',
    n: 2,
    short: 'Officers',
    name: "Officers' quarters & battery",
    x0: 23.6,
    x1: 33.8,
    kicker: 'Compartment 2 of 7',
    body: 'Commanding officer’s cabin, wardroom, and one of the two battery rooms under the deck.',
  },
  {
    id: 'c3',
    n: 3,
    short: 'Control',
    name: 'Control room',
    x0: 33.8,
    x1: 42.2,
    kicker: 'Compartment 3 of 7',
    body: 'The central post, under the sail: periscopes, helm, planes, and the dive panel.',
  },
  {
    id: 'c4',
    n: 4,
    short: 'Crew & galley',
    name: 'Crew, galley & battery',
    x0: 42.2,
    x1: 53.0,
    kicker: 'Compartment 4 of 7',
    body: 'Galley, sailor berths, the second battery well, and the air-conditioning plant visitors often remember.',
  },
  {
    id: 'c5',
    n: 5,
    short: 'Diesels',
    name: 'Diesel engine room',
    x0: 53.0,
    x1: 65.2,
    kicker: 'Compartment 5 of 7',
    body: 'Three 2,000 hp diesels, side by side, for surface running and for charging the batteries.',
  },
  {
    id: 'c6',
    n: 6,
    short: 'Motors',
    name: 'Electric motor room',
    x0: 65.2,
    x1: 73.2,
    kicker: 'Compartment 6 of 7',
    body: 'Three shafts. The centre motor is the large one; two wing motors and a creep motor share the room.',
  },
  {
    id: 'c7',
    n: 7,
    short: 'Stern tubes',
    name: 'Stern torpedo room',
    x0: 73.2,
    x1: 82.2,
    kicker: 'Compartment 7 of 7',
    body: 'Four stern tubes, more berths, and the stair back out onto the beach.',
  },
];

export const HATCH_X = COMPARTMENTS.slice(0, -1).map((c) => c.x1);

export const HOTSPOTS = [
  {
    id: 'bow-tubes',
    c: 'c1',
    x: 14.6,
    y: 1.35,
    z: 0,
    title: 'Six bow tubes',
    body: 'Project 641 carries ten 533 mm tubes: six in the bow, in two vertical rows of three, and four in the stern. A tube is about 8 m long; roughly two thirds lies in the outer hull and one third in this room. Kursura could ship 22 torpedoes, or mines in their place (Russian project data say 32, several Indian accounts say 44).',
  },
  {
    id: 'torpedo-rack',
    c: 'c1',
    x: 19.2,
    y: 1.15,
    z: -0.15,
    title: 'Reload torpedoes',
    body: 'Spare Type 53 torpedoes lay on racks beside the walkway — long 533 mm cylinders, two reloads for each bow tube in the original stow. The museum shows inert practice rounds. Quick-reload winches sat on the after bulkhead.',
  },
  {
    id: 'co-cabin',
    c: 'c2',
    x: 26.4,
    y: 1.2,
    z: -0.2,
    title: "Commanding officer's cabin",
    body: 'The largest cabin on board is still a bunk, a desk, and a curtain. Kursura’s first commanding officer was Commander Arun Auditto, who took her from Riga toward India in February 1970. The museum seats a mannequin in whites at the desk.',
  },
  {
    id: 'wardroom',
    c: 'c2',
    x: 30.2,
    y: 1.15,
    z: 0.35,
    title: 'Wardroom',
    body: 'Officers ate, wrote, and were briefed here. On a Project 641 the same table could become an operating table; appendectomies were done at sea. The floral paper, blue cloth, and Volna-K receiver are how the museum dresses this compartment for visitors.',
  },
  {
    id: 'battery',
    c: 'c2',
    x: 28.4,
    y: 0.55,
    z: 0,
    title: '448 battery cells',
    body: 'Four groups of 112 type 46SU cells — 448 in all — live under the decks of compartments 2 and 4. The plaza board weighs each cell at 652 kg. They gave a quiet submerged creep of a few days; class figures are about 380 nautical miles at 2 knots, not a high-speed dash.',
  },
  {
    id: 'periscopes',
    c: 'c3',
    x: 36.6,
    y: 1.7,
    z: 0.05,
    title: 'Attack and search periscopes',
    body: 'Two scopes rise through the sail: an attack periscope and a search / anti-aircraft periscope (Soviet sets of the family S-2 and PZNG-8). The plaza board lists periscope depth as 9 m. Snorkel depth on these boats was about 7–8 m.',
  },
  {
    id: 'helm',
    c: 'c3',
    x: 39.6,
    y: 1.2,
    z: -0.15,
    title: 'Helm and plane controls',
    body: 'From this post the boat was steered and the bow and stern planes were worked. Depth gauges, a gyro compass, and the engine-order telegraphs sit within arm’s reach. Diving the boat was a drill of vents, planes, and trim — urgent dive was timed at about 45–60 seconds.',
  },
  {
    id: 'sonar',
    c: 'c3',
    x: 40.8,
    y: 1.35,
    z: 0.15,
    title: 'Sonar, radar, and the plot',
    body: 'Indian boats of the class are credited with a Nakat (NATO “Snoop Tray”) surface radar, MG-200 Arktika-M, Tuloma, MG-10, and Svet-M sonar, plus a Nakat intercept set. The bow sonar and the passive array sat under faired domes outside the pressure hull.',
  },
  {
    id: 'galley',
    c: 'c4',
    x: 45.0,
    y: 1.25,
    z: -0.15,
    title: 'Galley, 4 ft by 6 ft',
    body: 'Two cooks worked a galley about 1.2 m by 1.8 m and fed the whole crew. The plaza board lists 36.6 tons of fresh water and 439 tons of fuel. Hot-bunking was normal: there were never berths for everyone at once.',
  },
  {
    id: 'bunks',
    c: 'c4',
    x: 49.2,
    y: 1.15,
    z: 0.2,
    title: 'Crew berths',
    body: 'The museum board says 72 people. Navy pages say 8 officers and 67 or 69 sailors, about 75–77 in all. Visitor accounts describe roughly 25 bunks stacked in the after compartment as well, with two washbasins and two heads for the boat.',
  },
  {
    id: 'ac',
    c: 'c4',
    x: 51.2,
    y: 1.2,
    z: -0.2,
    title: 'Air and cooling',
    body: 'A guided tour published by DNA India remembers the fourth compartment for its air-conditioning machinery, between the control room and the diesels. High-pressure air — the board says 54 bottles at 200 kg/cm² — blew tanks and started engines.',
  },
  {
    id: 'diesels',
    c: 'c5',
    x: 58.5,
    y: 1.35,
    z: 0.35,
    title: 'Three 2,000 hp diesels',
    body: 'Russian project data name three Kolomna 37D diesels, 2,000 hp each at 500 rpm. Visitor photographs inside Kursura have been captioned as type 2D42M. Each is drawn here as an inline six — the usual 37D arrangement — with rocker covers, an exhaust manifold and a gauge board, the shape taken from preserved Foxtrot engine rooms (B-413, B-427, B-39) rather than from a machinery drawing of S20.',
  },
  {
    id: 'motors',
    c: 'c6',
    x: 68.6,
    y: 1.2,
    z: 0,
    title: 'Three shafts, three motors',
    body: 'The centre shaft is turned by a PG-102 of 2,700 hp. Each wing shaft has a PG-101 of 1,350 hp. A PG-104 creep motor of about 140 hp (some Western lists say 180 hp) could walk the boat along almost silently. All three propellers are six-bladed.',
  },
  {
    id: 'stern-tubes',
    c: 'c7',
    x: 78.6,
    y: 1.3,
    z: 0,
    title: 'Four stern tubes',
    body: 'Tubes 7 to 10 face aft. With the bow salvo they gave a Foxtrot a weapon at either end of a convoy fight. The after room was also a living space: bunks line the hull, and an ISP-60 escape suit is displayed as it is in the museum.',
  },
  {
    id: 'hoist',
    c: 'c1',
    x: 17.4,
    y: 1.7,
    z: 0,
    title: 'Loading rail',
    body: 'A beam and chain hoist ran over the reload racks. On the Project 641 boats a veteran describes, six quick-loading motors with drums sat on the after bulkhead of this compartment, one for each tube. The museum path is the narrow gap between the racks.',
  },
  {
    id: 'manifold',
    c: 'c3',
    x: 35.0,
    y: 1.15,
    z: 0.55,
    title: 'Ballast and HP-air manifold',
    body: 'The central post is a bank of handwheels. High-pressure air — 54 bottles at 200 kg/cm² on the Kursura board — blows the main ballast tanks; urgent dive was timed at about 45–60 seconds. Red and green wheels follow the cream-and-red machinery in Kursura photographs and in preserved Foxtrots. This is not a valve-by-valve survey of S20.',
  },
  {
    id: 'switchboard',
    c: 'c6',
    x: 66.6,
    y: 1.2,
    z: 0.55,
    title: 'Propulsion switchboard',
    body: 'Knife switches and gauge clusters fed the PG-102 centre motor (2,700 hp) and the two PG-101 wing motors (1,350 hp each). The same cream cabinets, coloured bezels and cable looms show up in Foxtrot museum boats, including the motor controls photographed aboard preserved sisters.',
  },
  {
    id: 'escape',
    c: 'c7',
    x: 75.4,
    y: 1.35,
    z: 0.25,
    title: 'ISP-60 escape suit',
    body: 'The suit on display is labelled for leaving a sunken submarine. Compartments 1, 3, and 7, and the conning tower inside the sail, were the escape spaces: a crew could leave through a torpedo tube or the tower.',
  },
];

export const SOURCES = [
  {
    title: 'Indian Armed Forces Museums — INS Kursura',
    url: 'https://indianarmedforcesmuseums.gov.in/about/ins-kursura-submarine-museum',
    note: 'Commissioning, length 91.3 m, breadth 8 m, 1,945 / 2,469 tons, 15.5 kn, crew 8 + 69, 448 batteries, three diesels.',
  },
  {
    title: 'On-site board, “Interesting facts of the submarine Kursura”',
    url: 'https://commons.wikimedia.org/wiki/File:Interesting_facts_of_the_Submarine_Kursura.jpg',
    note: 'Class I 641, height 11.92 m, diameter 8 m, 7 compartments, 72 crew, 22 torpedoes, periscope depth 9 m, max depth 280 m, 10 ballast tanks, fuel 439 t, water 36.6 t, 54 HP-air bottles, anchor 1,000 kg and 176 m of chain, each battery cell 652 kg.',
  },
  {
    title: 'Wikipedia — INS Kursura (S20)',
    url: 'https://en.wikipedia.org/wiki/INS_Kursura_(S20)',
    note: 'Launched 25 February 1969, commissioned at Riga 18 December 1969, decommissioned 27 February 2001, 73,500 nautical miles, 1971 patrol, museum dedicated 9 August 2002 and opened 24 August 2002, 600 m tow.',
  },
  {
    title: 'Wikipedia — Foxtrot-class and Kalvari-class (1967)',
    url: 'https://en.wikipedia.org/wiki/Foxtrot-class_submarine',
    note: 'Three shafts, six-bladed propellers, 6 bow and 4 stern tubes, 22 torpedoes, diesel-electric plant.',
  },
  {
    title: 'Russian Wikipedia — Project 641',
    url: 'https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B4%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5_%D0%BB%D0%BE%D0%B4%D0%BA%D0%B8_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0_641',
    note: 'Seven compartments in order, 37D diesels, PG-102 / PG-101 / PG-104, 4 × 112 cells, pointed stem and midships sheer.',
  },
  {
    title: 'navy.su — Project 641',
    url: 'http://www.navy.su/navysub1945/641/index.htm',
    note: 'Overall length 91.3 m, waterline 89.7 m, pressure hull 70.1 m, beam 7.5 m, draught 5.09 m on normal fuel, tube and sensor fit.',
  },
  {
    title: 'kchf.ru — Project 641 specifications',
    url: 'https://www.kchf.ru/eng/ship/submarines/b41.htm',
    note: 'Speeds, ranges, motor horsepower, and the export I641K note on smaller stern tubes (not fitted to the Indian I641 boats).',
  },
  {
    title: 'GlobalSecurity — S20 Kalvari / Project 641',
    url: 'https://www.globalsecurity.org/military/world/india/s-kursura.htm',
    note: 'Beaching at RK Beach, draught 6 m, plant, and sensors as published in English.',
  },
  {
    title: 'Naval Encyclopedia — Foxtrot class',
    url: 'https://naval-encyclopedia.com/cold-war/ussr/foxtrot-class-submarines.php',
    note: 'Compartment list and the note that Kalvari-class (I641) boats match the original Foxtrot.',
  },
  {
    title: 'A. Komovsky — Project 641 compartment memoir (PDF)',
    url: 'https://komovsky.ru/wp-content/uploads/2021/10/bukashka-ot-nosa-do-kormy.pdf',
    note: 'First-hand layout: tube length, wardroom, central post, snorkel mast, and the after compartments.',
  },
  {
    title: 'DNA India — a visitor’s tour of the museum',
    url: 'https://www.dnaindia.com/lifestyle/report-life-on-a-submarine-a-tour-of-ins-kursura-2228697',
    note: 'Bow-to-stern order as walked by visitors, galley size, two heads, bunks in the last compartment.',
  },
  {
    title: 'Velu Travels — January 2026 visit',
    url: 'https://velutravels.blogspot.com/2026/02/kursura-submarine-museum.html',
    note: 'Entry ladder at the forward end, exit at the after end, and the centre diesel captioned 2D42M.',
  },
  {
    title: 'Wikimedia Commons — INS Kursura (S20)',
    url: 'https://commons.wikimedia.org/wiki/Category:INS_Kursura_(S20)',
    note: 'Exterior and interior photographs: cream machinery, red handwheels, cable runs, circular hatches, wardroom and bunks.',
  },
  {
    title: 'Wikipedia — Foxtrot-class interior photographs',
    url: 'https://en.wikipedia.org/wiki/Foxtrot-class_submarine',
    note: 'Aft torpedo room, opened tube, and electric-motor control cabinets on a preserved Foxtrot (photographs by Mario52).',
  },
  {
    title: 'Museum of the World Ocean — B-413, Kaliningrad',
    url: 'https://world-ocean.ru/voenno-morskoj-tsentr',
    note: 'Project 641 preserved with hull, machinery, instruments and weapons. Culture.ru’s note of the same boat confirms compartment 2 (CO cabin, wardroom), 4 (galley) and 7 (enlisted bunks and escape gear): https://www.culture.ru/institutes/12264/podvodnaya-lodka-b-413',
  },
  {
    title: 'USS Drum association — preserved Foxtrot notes',
    url: 'https://www.ussdrum.org/foxtrot-1.html',
    note: 'Class fit used for B-39 (San Diego) and the same three-shaft, six-blade, ten-tube layout.',
  },
];

export function aboutParagraphs() {
  return [
    'INS Kursura (S20) is a Soviet Project 641 diesel-electric submarine, NATO reporting name Foxtrot, built for India as one of the four Kalvari-class boats (project I641). She was built at Sudomekh, Admiralty Shipyard, Leningrad, launched on 25 February 1969, and commissioned at Riga on 18 December 1969. She was India’s fourth submarine. Commander Arun Auditto took her home between February and April 1970, calling at Gothenburg, A Coruña, Takoradi, and Mauritius.',
    'In the 1971 war she patrolled the Arabian Sea under two restrictions: stay out of marked shipping lanes, and attack only after a positive identification. She was paired with INS Karanj. A plan to lay mines was cancelled. Over 31 years she covered about 73,500 nautical miles, including a Soviet refit from 1980 to 1982 and exercises with Singapore in 1994. She was decommissioned on 27 February 2001.',
    'The Eastern Naval Command had her beached as a museum — the first submarine museum in South Asia. Moving her the last 600 metres onto a concrete foundation at Ramakrishna Beach took about 18 months. N. Chandrababu Naidu dedicated her on 9 August 2002; she opened to the public on 24 August 2002. She still receives the Navy’s dressing-ship honour. VMRDA (the old VUDA sign is still on the plaza wall) runs the site with the Navy. Visitors climb a stair at the forward end, walk the seven compartments through circular hatches, and leave by a stair at the stern.',
  ];
}

export function approximationNotes() {
  return [
    'Overall length 91.3 m, the museum board’s maximum diameter of 8 m and height of 11.92 m, and a 6 m draught are used as hard numbers. Published beam is 7.4–7.5 m at the waterline and 8 m as the board’s “maximum diameter”; the outer hull here is 8 m across.',
    'No full lines plan was available to trace. The sheer, the snowman bow (upper stem plus the sonar dome), the sail over the control room, folding-style bow planes shown extended as on the plaza, the cruciform stern, and three six-bladed propellers are reconstructed from photographs and from Project 641 descriptions. Station offsets are estimates.',
    'The pressure hull is the published 70.1 m. Compartment lengths are apportioned to that length in the standard 1-to-7 order. They are not measured off S20’s own general arrangement.',
    'Interiors are recognisable, not a surveyed fit. Tube count and arrangement, the two battery wells, two periscopes, three diesels, three motors, four stern tubes, the tiny galley, and the berths follow the sources. Pipe runs, valve banks and cable trays are dense on purpose: Kursura’s own photographs and preserved Foxtrots (B-413 in Kaliningrad, B-427, B-39, U-475) show machinery buried in pipes. Colours are a simplified code — red firemain and many handwheels, green seawater, yellow fuel, blue fresh water or air, cream ventilation — not a valve list from S20. Each diesel is an inline six with rocker covers and an exhaust manifold, the published 37D form, not a measured engine.',
    'The bow is shown as the museum displays it: outer plating cut away and the six muzzle doors removed, lower bow and upper nose painted light. At sea the hull was black and the underwater body was anti-fouled, not white.',
    'The plaza, wave wall, and sign follow the present landscaping. The hull’s compass heading on Beach Road is not surveyed here: sea on one side, Beach Road on the other, and a headland standing in for Dolphin’s Nose.',
  ];
}
