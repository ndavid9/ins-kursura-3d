# INS Kursura (S20)

An explorable 3D reconstruction of the Kursura submarine museum on Ramakrishna Beach, Visakhapatnam. Kursura is a Soviet Project 641 (NATO Foxtrot) diesel-electric boat, commissioned in the Indian Navy in 1969, decommissioned in 2001, and opened as a museum in 2002.

The model is built in code with [Three.js](https://threejs.org/). It is not a scan of the boat. Length, beam, height, compartment order, and the machinery layout follow published figures and photographs of the ship and her sisters. The About panel in the site lists sources and the parts that are approximate.

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (the dev server in this project uses port **47321**).

```bash
npm run build
npm run preview
```

builds a static site into `dist/`.

## Walk the boat

- **Exterior.** Drag to orbit, scroll or pinch to zoom. The hull sits on concrete cradles between Beach Road and the Bay of Bengal, bow cut open the way the museum shows the six tubes.
- **Interior.** “Board at the bow”, or pick a compartment on the bar. WASD or the arrow keys walk; drag (or click to capture the mouse) to look. On a phone, the left side of the screen walks and the right side looks. Brass plaques open as you draw near, or press E. Keys 1–7 jump between compartments. The route runs bow to stern: torpedo room, officers and battery, control room, crew and galley, diesels, motors, stern tubes.

## Sources

The in-site About panel is the full list. The main ones are the Indian Armed Forces museum page for Kursura, the facts board on the plaza, Wikipedia’s pages for INS Kursura and the Foxtrot class, Russian Project 641 tables (compartment order, pressure-hull length, the 37D / PG-101 / PG-102 / PG-104 plant), and Wikimedia photographs of the boat on RK Beach and inside the compartments.
