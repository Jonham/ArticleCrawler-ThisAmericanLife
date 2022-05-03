import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3.2.33/dist/vue.esm-browser.js";

function calcStartPoint(rect, outRect) {
  const startX = (outRect.width - rect.width) / 2;
  const startY = (outRect.height - rect.height) / 2;
  return {
    start: [startX, startY],
    size: {
      ...rect,
    },
    outRect,
  };
}

function getRowColor(ctx, size, rowNumber = 0) {
  const { width, height } = size;
  const imgData = ctx.getImageData(0, 0, width, height);
  console.log({ rowNumber });

  // get first row
  let startIndex = rowNumber * width * 4;
  const endIndex = (rowNumber + 1) * width * 4;
  const result = [];
  while (startIndex < endIndex) {
    const [x, y, z, a] = imgData.data.slice(startIndex, startIndex + 4);
    result.push({ x, y, z, a });
    startIndex += 4;
  }
  return { row: result, imgData };
}

class Color {
  constructor(value) {
    this.value = value;
  }
  equal(c) {
    const {
      value: { x, y, z, a },
    } = this;
    const { value } = c;
    return x === value.x && y === value.y && z === value.z && a === value.a;
  }
  toRGBA() {
    const {
      value: { x, y, z, a },
    } = this;
    return `rgba(${[x, y, z, a].join(",")})`;
  }
}

function getUniqueColor(row) {
  let color = new Color(row[0]);
  for (let i = 1; i < row.length; i++) {
    const item = new Color(row[i]);
    if (!item.equal(color)) {
      return {
        unique: false,
      };
    }
  }
  return {
    unique: true,
    color,
  };
}

const app = createApp({
  setup() {
    const coverCanvas = ref();
    const colorPreview = ref();

    let isPicking = false;
    const pickColor = () => {
      if (!img) return;

      isPicking = true;
      coverCanvas.value.style.cursor = "crosshair";
    };

    let img;
    let tempImageData;
    let ctx;
    let drawCtx;
    let previewColor;

    const getColorOfPoint = ({ x: indexX, y: indexY }) => {
      if (!tempImageData) return null;
      if (indexX >= tempImageData.width || indexY >= tempImageData.height) {
        return null;
      }
      const startIndex = (indexY * tempImageData.width + indexX) * 4;
      const [x, y, z, a] = tempImageData.data.slice(startIndex, startIndex + 4);
      return new Color({ x, y, z, a });
    };

    const drawBg = (ctx, bgColor, img, drawCtx) => {
      // fill all bg with this color
      ctx.save();
      ctx.fillStyle = bgColor.toRGBA();
      ctx.fillRect(0, 0, drawCtx.outRect.width, drawCtx.outRect.height);
      ctx.drawImage(img, ...drawCtx.start);
      ctx.restore();
    };

    const drawImage = (src) => {
      img = new Image();
      img.src = src;

      img.onload = () => {
        const canvas = coverCanvas.value;
        const { naturalHeight: height, naturalWidth: width } = img;
        const max = Math.max(height, width);

        canvas.width = max;
        canvas.height = max;
        if (!ctx) ctx = canvas.getContext("2d");

        drawCtx = calcStartPoint(
          { width, height },
          { width: max, height: max }
        );
        // center
        ctx.drawImage(img, ...drawCtx.start);

        const { row, imgData } = getRowColor(ctx, canvas, drawCtx.start[1]);
        console.log(imgData, row[0]);

        tempImageData = imgData;

        const { color, unique } = getUniqueColor(row);
        if (unique) {
          drawBg(ctx, color, img, drawCtx);
        } else {
          console.error("no unique color");
        }
      };
    };

    onMounted(() => {
      coverCanvas.value.addEventListener("click", () => {
        if (!isPicking) return;

        isPicking = false;
        console.log("draw", previewColor.toRGBA());
        drawBg(ctx, previewColor, img, drawCtx);
      });
      coverCanvas.value.addEventListener("contextmenu", () => {
        if (!isPicking) return;
        isPicking = false;
        console.log("cancel");
        colorPreview.value.style.display = "none";
      });

      coverCanvas.value.addEventListener("mousemove", (ev) => {
        if (!isPicking) {
          colorPreview.value.style.display = "none";
          return;
        }

        colorPreview.value.style.display = "block";

        const { clientX, clientY, offsetX, offsetY } = ev;
        previewColor = getColorOfPoint({ x: offsetX, y: offsetY });
        // preview color
        colorPreview.value.style.backgroundColor = previewColor.toRGBA();
        colorPreview.value.style.left = clientX + "px";
        colorPreview.value.style.top = clientY + "px";
      });
      document.addEventListener("drop", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const files = ev.dataTransfer.files;
        const url = URL.createObjectURL(files[0]);
        drawImage(url);
      });
      document.addEventListener("dragover", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      });
    });
    return {
      coverCanvas,
      colorPreview,
      pickColor,
    };
  },
}).mount("#app");
