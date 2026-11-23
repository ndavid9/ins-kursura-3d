# INS Kursura (S20)

An explorable 3D reconstruction of the Kursura submarine museum on Ramakrishna Beach, Visakhapatnam. Kursura is a Soviet Project 641 diesel-electric submarine (NATO: Foxtrot), built for the Indian Navy as one of the Kalvari-class boats. She was commissioned on 18 December 1969, decommissioned on 27 February 2001, and opened as a museum on the beach in August 2002.

The hull, sail, and interiors are modelled in code with [Three.js](https://threejs.org/) and Vite. This is not a laser scan. Overall length is the published 91.3 m, and the outer beam follows the museum board’s maximum diameter of 8 m. The seven compartments follow the Project 641 order, bow to stern.

Screenshots are not stored in this repository. Open the app to walk the boat.

## Run

```bash
npm install
npm run dev
```

Vite serves the site on port **47321**. Open the URL it prints.

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. That folder is gitignored.

## Controls

- **Exterior.** Drag to orbit. Scroll or pinch to zoom. The boat sits on concrete cradles between Beach Road and the Bay of Bengal. A person on the tiles is about 1.7 m.
- **Interior.** Choose **Board at the bow**, or pick a compartment on the bar. WASD or the arrow keys walk. Drag to look, or click the view to capture the mouse. On a phone, the left side of the screen walks and the right side looks. Brass plaques open when you draw near them, or press **E**. Keys **1–7** jump between compartments. **I** opens About. **Back to the beach** returns outside.
- The museum route runs bow to stern: torpedo room, officers and battery, control room, crew and galley, diesels, motors, stern tubes.

## Sources

The in-app **About & sources** panel is the full list. The model uses:

- The Indian Armed Forces museum page for INS Kursura, and the facts board photographed on the plaza (length 91.3 m, height 11.92 m, seven compartments, 22 torpedoes, 448 battery cells).
- Wikipedia entries for [INS Kursura (S20)](https://en.wikipedia.org/wiki/INS_Kursura_(S20)) and the [Foxtrot class](https://en.wikipedia.org/wiki/Foxtrot-class_submarine).
- Russian Project 641 tables (compartment order, 70.1 m pressure hull, 37D diesels, PG-102 / PG-101 / PG-104 motors) from Russian Wikipedia, navy.su, and kchf.ru.
- Wikimedia photographs of Kursura on RK Beach and inside the compartments.
- Preserved sisters used where S20’s own machinery drawings are missing: [B-413 at the Museum of the World Ocean, Kaliningrad](https://world-ocean.ru/voenno-morskoj-tsentr), with the same compartment notes on [Culture.ru](https://www.culture.ru/institutes/12264/podvodnaya-lodka-b-413), plus published interior photographs of other Foxtrots.

## Approximations

No full lines plan was available to trace. The sheer, the bow with its sonar dome, the sail over the control room, and the stern gear are reconstructed from photographs and the published dimensions. Compartment lengths divide the 70.1 m pressure hull in the standard order. They are not measured off S20’s own general arrangement.

Interiors are recognisable rather than a surveyed fit. Tube counts, two periscopes, three diesels, three motors, four stern tubes, the galley, and the berths follow the sources. Pipe runs and valve banks are deliberately dense, matching photographs of Kursura and of preserved Foxtrots. Pipe colours are a simplified code (red firemain and many handwheels, green seawater, yellow fuel, blue water or air, cream ventilation), not a valve list from S20. Each diesel is drawn as an inline six, the usual published 37D form.

The white bow is the museum’s display paint. The hull’s compass heading on Beach Road is not surveyed: sea on one side, the road on the other.
