CursorTrails adds pointer trailing effect to your webpage.

DEMO Sandbox: 
https://codesandbox.io/s/cursor-trail-demo-fqsd4?file=/src/index.js

# Installation

`npm install cursor-trails`

# Usage

import and call 
```javascript
import CursorTrail from "cursor-trails";

CursorTrail({
  container: document.body,
  //images: [$PROVIDE_YOUR_IMAGE_URLS]
  rate: 0.5,
  size: 40,
  life: 1.5,
  speed: 1.2
});
```

# Configurations

### container
The container where trailing effect should be shown

### images
URL of images to be shown as trailing effect
### rate
0 ~ 1 number of probability a trailing image is generated upon pointer moving event

### size
size of generated trailing image

### life
duration of trailing image appearing on screen

### speed
moving speed of trailing image

# Thanks
This repo was forked from https://github.com/tholman/cursor-effects