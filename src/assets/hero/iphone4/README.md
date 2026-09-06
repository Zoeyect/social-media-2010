# Production iPhone 4 model

Place the approved production model at:

`src/assets/hero/iphone4/iphone4.glb`

The Hero loader discovers this exact path at build time. Imported mesh names may
differ, but they must resolve through `src/hero/iphone4ModelContract.ts`.

Critical semantic roles are `PhoneBody`, `Screen`, and `PowerButton`. If any of
these cannot be resolved to a mesh, the isolated Hero sandbox reports the exact
missing role and uses its explicitly reconstructed DEV placeholder.

The model is not considered historically exact merely because it satisfies the
technical contract. Its geometry and materials still require reference-based
iPhone 4 visual QA.
