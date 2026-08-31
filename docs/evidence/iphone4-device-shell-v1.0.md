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
| Volume-button diameter/edge height | absent | separate round controls confirmed | 30px |
| Volume-button center spacing | absent | separate controls, GSM position family | 82px |
| Mute-switch edge geometry | absent | separate Ring/Silent control confirmed | 9 × 42px |

The one-pixel shell-height correction derives from the confirmed Apple body ratio while leaving the screen and all iOS pixels 1:1. The Home button's bottom inset increases by the same one point, preserving its existing absolute vertical position. Exact front active-area offsets, button projection, and optical material values are not published by the cited consumer specifications; retained/constructed CSS values are therefore **VISUAL-CROSSCHECK / RECONSTRUCTED**, not claimed as Apple manufacturing geometry.

## Materials and controls

The parent shell renders the permanent narrow steel perimeter. An inset non-interactive layer renders the black front-glass plane. A second non-interactive layer shares the exact canonical screen rectangle and gains a low-opacity cool halo only when the existing session phase represents a lit display. Sleeping, powered-off, and shutdown phases leave this layer transparent; no sleep or power transition logic changed.

The left-side Ring/Silent switch and two separate Volume buttons are visual-only. They introduce no sound, mute, camera, or volume state. The existing Power and Home buttons retain their original event handlers and hit targets; their dimensions and positions remain unchanged.

The GSM seam treatment uses one subtle top break plus matched lower-side breaks visible in the front-facing reconstruction. The existence and GSM-vs-CDMA distinction are **PERIOD-EVIDENCE / CONFIRMED**; exact front-projection seam coordinates are **PROBABLE / VISUAL-CROSSCHECK** because an original target-date orthographic drawing was not recovered into the repository.

## Preserved boundaries

No Lock Screen, SpringBoard, status-bar, application, keyboard, wallpaper, notification, scheduler, battery, simulated-time, or interaction-state implementation changed. Shell controls use device-local coordinates and remain attached if the host scales the complete simulator.
