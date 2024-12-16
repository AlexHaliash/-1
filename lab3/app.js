const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const contrastBtn = document.getElementById("contrast");
const histogramBtn = document.getElementById("histogram");
const downloadBtn = document.getElementById("download");

let img = new Image();

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

// Apply Linear Contrast
contrastBtn.addEventListener("click", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const contrastFactor = 1.5; // Adjust contrast factor
  const brightnessOffset = 20; // Optional brightness adjustment

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128 + brightnessOffset)); // Red
    data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128 + brightnessOffset)); // Green
    data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128 + brightnessOffset)); // Blue
  }

  ctx.putImageData(imageData, 0, 0);
});

// Equalize Histogram
histogramBtn.addEventListener("click", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Calculate histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    histogram[data[i]]++;
  }

  // Calculate cumulative distribution
  const cdf = [...histogram];
  for (let i = 1; i < cdf.length; i++) {
    cdf[i] += cdf[i - 1];
  }

  // Normalize
  const totalPixels = (canvas.width * canvas.height);
  const cdfMin = cdf.find(value => value > 0);
  const scale = 255 / (totalPixels - cdfMin);

  const equalized = new Uint8Array(256);
  for (let i = 0; i < equalized.length; i++) {
    equalized[i] = Math.round((cdf[i] - cdfMin) * scale);
  }

  // Apply equalization
  for (let i = 0; i < data.length; i += 4) {
    data[i] = equalized[data[i]]; // Red
    data[i + 1] = equalized[data[i + 1]]; // Green
    data[i + 2] = equalized[data[i + 2]]; // Blue
  }

  ctx.putImageData(imageData, 0, 0);
});

// Download the result
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "processed-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
