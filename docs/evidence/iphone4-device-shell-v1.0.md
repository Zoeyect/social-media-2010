# iPhone 4 Device Shell v1.0

## Canonical target and evidence

The physical target is the black GSM iPhone 4 (`iPhone3,1`) in portrait orientation. Apple publishes the body as 115.2 × 58.6 × 9.3 mm and the display as a 3.5-inch 640 × 960 Retina panel. Apple also identifies separate Ring/Silent, Volume Up, Volume Down, Sleep/Wake, and Home controls. Apple's June 2010 announcement identifies the enclosure as glass and stainless steel. These characteristics are **CONFIRMED**.

The project retains its canonical 320 × 480 logical viewport as **PROJECT IMPLEMENTATION**. The screen rectangle is owned once by `.device` custom properties and is consumed by both the LCD surface and its non-interactive glow layer; no boot, Lock Screen, SpringBoard, application, keyboard, or sleep state owns alternate screen dimensions.

The thin cool-gray band, restrained black-glass gradient, and active-screen light spill are **PHYSICAL RECONSTRUCTION / VISUAL FIDELITY**. The supplied DeviantArt iPhone 4/iOS 4.1 render is **VISUAL-CROSSCHECK ONLY / NON-ORIGINAL RECONSTRUCTION** and is not engineering evidence.

## Geometry audit

| Metric | Current | Historical target | Final |
| --- | ---: | ---: | ---: |
| Shell width | 380px | 58.6mm proportion | 380px |
| Shell height | 746px | 115.2mm proportion | 747px |
| Body width:height | 0.5094 | 0.5087 | 0.5087 |
| Screen width | 320px | 640px / 2:3 portrait | 320px |
| Screen height | 480px | 960px / 2:3 portrait | 480px |
| Top bezel | 133px | period front-view crosscheck | 133px |
| Bottom bezel | 133px | period front-view crosscheck | 134px |
| Side bezel | 30px | period front-view crosscheck | 30px |
| Home button diameter | 64px | period front-view crosscheck | 64px |
| Earpiece width | 58px | period front-view crosscheck | 58px |
| Visible steel-frame thickness | approximately 2px | narrow stainless-steel perimeter | 3px |
| Volume-button diameter/edge height | 30px capsule-like profile | separate round controls confirmed | 30px circular face, clipped to its edge projection |
| Volume-button visible projection | 10px wide; 6px painted over shell | narrow front-view edge projection | 6px wide; ends at shell boundary |
| Volume-button center spacing | 49px | separate controls, GSM position family | 66px |
| Mute-switch edge geometry | 9 × 42px capsule-like profile | separate Ring/Silent control confirmed | 6 × 20px compact toggle profile |
| Sleep/Wake visible geometry | 68 × 9px body; lower 2px painted over shell | elongated top control mounted into steel band | original body clipped to 68 × 7px visible projection |

The one-pixel shell-height correction derives from the confirmed Apple body ratio while leaving the screen and all iOS pixels 1:1. The Home button's bottom inset increases by the same one point, preserving its existing absolute vertical position. Exact front active-area offsets, button projection, and optical material values are not published by the cited consumer specifications; retained/constructed CSS values are therefore **VISUAL-CROSSCHECK / RECONSTRUCTED**, not claimed as Apple manufacturing geometry.

## Materials and controls

The parent shell renders the permanent narrow steel perimeter. An inset non-interactive layer renders the black front-glass plane. A second non-interactive layer shares the exact canonical screen rectangle and gains a low-opacity cool halo only when the existing session phase represents a lit display. Sleeping, powered-off, and shutdown phases leave this layer transparent; no sleep or power transition logic changed.

The left-side Ring/Silent switch and two separate Volume buttons are visual-only. The Ring/Silent switch keeps its 104px center with a distinct 6 × 20px toggle profile. Both volume controls use a 30px physical-face diameter at 151px/217px centers; each is constructed as a true 30 × 30px circle inside a 6px-wide occlusion viewport, so the front-facing shell exposes only its shallow curved edge. Each control ends at the shell boundary instead of painting across the permanent stainless-steel band. Their restrained gradients distinguish the toggle from the matching pair without introducing polished chrome. The viewing angle does not expose enough of the volume faces to support legible `+`/`−` markings. They introduce no sound, mute, camera, or volume state. The existing Power and Home buttons retain their original event handlers, hit targets, dimensions, positions, and material styling.

The Sleep/Wake control retains its 68 × 9px interactive box, `right: 56px` placement, `top: -7px` anchor, material, and interaction handlers. Its lower 2px previously crossed the shell boundary and painted above the parent steel background. The material body now lives on a localized pseudo-element whose visual clip removes only that overlap, leaving a 68 × 7px exposed projection while the unchanged parent frame remains visible through the mounting area and the full hit target remains intact. The physical integration is **CONFIRMED** from period hardware photography; the exact two-pixel front projection is **RECONSTRUCTED** from the existing shell boundary and control geometry.

The GSM seam treatment uses one subtle top break plus matched lower-side breaks visible in the front-facing reconstruction. The existence and GSM-vs-CDMA distinction are **PERIOD-EVIDENCE / CONFIRMED**; exact front-projection seam coordinates are **PROBABLE / VISUAL-CROSSCHECK** because an original target-date orthographic drawing was not recovered into the repository.

## Preserved boundaries

No Lock Screen, SpringBoard, status-bar, application, keyboard, wallpaper, notification, scheduler, battery, simulated-time, or interaction-state implementation changed. Shell controls use device-local coordinates and remain attached if the host scales the complete simulator.

## iPhone 4 Hardware Shell v1.0 — FROZEN

The black 2010 GSM-generation iPhone 4 hardware shell is the project baseline. Future work must preserve its outer body, bezel, steel perimeter, front hardware, physical controls, materials, and occlusion relationships; any change requires an explicit hardware-authenticity review. Screen, Lock Screen, status-bar, SpringBoard, notification, and application visual layers remain editable because they are not part of this hardware freeze. Focused source guards in `scripts/validate-seed-content.mjs` enforce the frozen geometry independently of device UI state.
