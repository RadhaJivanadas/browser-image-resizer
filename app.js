(function () {
  const form = document.querySelector("#resizer-form");
  const fileInput = document.querySelector("#file");
  const widthInput = document.querySelector("#width");
  const heightInput = document.querySelector("#height");
  const formatInput = document.querySelector("#format");
  const qualityInput = document.querySelector("#quality");
  const qualityValue = document.querySelector("#quality-value");
  const status = document.querySelector("#status");
  const result = document.querySelector("#result");
  const preview = document.querySelector("#preview");
  const download = document.querySelector("#download");
  let downloadUrl;

  qualityInput.addEventListener("input", () => { qualityValue.value = qualityInput.value; });

  function limit(input) {
    if (!input.value) return null;
    const value = Number(input.value);
    if (!Number.isInteger(value) || value < 1 || value > 20000) throw new Error("Dimensions must be from 1 to 20,000 pixels.");
    return value;
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("The image could not be read."));
      image.src = URL.createObjectURL(file);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    result.hidden = true;
    status.textContent = "";
    const file = fileInput.files[0];
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { status.textContent = "Choose a JPG, PNG, or WebP image."; return; }
    if (file.size > 20 * 1024 * 1024) { status.textContent = "Choose an image no larger than 20 MiB."; return; }
    let image;
    try {
      const maxWidth = limit(widthInput);
      const maxHeight = limit(heightInput);
      image = await readImage(file);
      if (!image.width || !image.height || image.width > 8192 || image.height > 8192 || image.width * image.height > 24000000) throw new Error("Choose an image up to 24 million pixels, with neither side above 8,192 pixels.");
      const scale = Math.min(maxWidth ? maxWidth / image.width : 1, maxHeight ? maxHeight / image.height : 1, 1);
      const width = Math.max(1, Math.floor(image.width * scale));
      const height = Math.max(1, Math.floor(image.height * scale));
      preview.width = width;
      preview.height = height;
      const context = preview.getContext("2d");
      if (!context) throw new Error("Your browser could not create an image canvas.");
      if (formatInput.value === "image/jpeg") { context.fillStyle = "#fff"; context.fillRect(0, 0, width, height); }
      context.drawImage(image, 0, 0, width, height);
      const blob = await new Promise(resolve => preview.toBlob(resolve, formatInput.value, Number(qualityInput.value) / 100));
      if (!blob) throw new Error("This browser could not create the selected format.");
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = URL.createObjectURL(blob);
      download.href = downloadUrl;
      download.download = file.name.replace(/\.[^.]*$/, "") + "." + formatInput.value.split("/")[1].replace("jpeg", "jpg");
      result.hidden = false;
      status.textContent = "The resized image is ready.";
    } catch (error) {
      status.textContent = error.message || "The image could not be resized.";
    } finally {
      if (image) URL.revokeObjectURL(image.src);
    }
  });
})();
