# Browser Image Resizer

A small browser-based image resizer for JPG, PNG, and WebP files.

Try the hosted version at https://www.firmbeacon.co.uk/tools/image-resizer.

All processing happens locally in your browser. Images are not uploaded, and no account is required.

## Features

- Accepts JPG, PNG, and WebP files
- Fits an image inside optional maximum width and height limits
- Preserves the original aspect ratio
- Never enlarges an image
- Exports JPEG, PNG, or WebP

## Usage

Open `index.html` in a modern browser, choose an image, enter optional maximum dimensions, select an output format, and download the result.

If both limits are set, the image is scaled down until it fits inside both. An image that already fits is not enlarged.

## Limitations

- Input files must be JPG, PNG, or WebP and no larger than 20 MiB.
- The output keeps the original proportions, so it cannot force arbitrary exact dimensions without cropping or stretching.
- JPEG output replaces transparent areas with white.
- The browser Canvas conversion produces a still image and does not preserve animation or original camera metadata.

## License

MIT
