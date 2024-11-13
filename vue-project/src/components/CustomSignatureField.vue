<template>
    <div class="signature-container">
      <canvas
        id="signature-pad"
        ref="signaturePad"
        width="500"
        height="150"
        style="width: 100%;"
        @mousedown="startDrawing"
        @mouseup="stopDrawing"
        @mousemove="draw"
        @touchstart="startDrawing"
        @touchend="stopDrawing"
        @touchmove="draw"
      ></canvas>
      <button class="clear-button" @click="clearSignature">Clear</button>
      <!-- <div class="signature-actions">
        <button @click="saveSignature">Save</button>
      </div> -->
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        ctx: null,
        drawing: false,
        lastX: 0,
        lastY: 0,
      };
    },
    mounted() {
      const canvas = this.$refs.signaturePad;
      this.ctx = canvas.getContext('2d');
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = '#000000';

      // Fix: Stop drawing if mouseup happens outside the canvas
      window.addEventListener('mouseup', this.stopDrawing);
    },
    beforeDestroy() {
      window.removeEventListener('mouseup', this.stopDrawing);
    },
    methods: {
      startDrawing(event) {
        event.preventDefault();
        this.drawing = true;
        const { x, y } = this.getMousePos(event);
        this.lastX = x;
        this.lastY = y;
      },
      stopDrawing(event) {
        event.preventDefault();
        this.drawing = false;
      },
      draw(event) {
        event.preventDefault();
        if (!this.drawing) return;

        const { x, y } = this.getMousePos(event);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;
      },
      getMousePos(event) {
        const canvas = this.$refs.signaturePad;
        const rect = canvas.getBoundingClientRect();
        let x, y;

        if (event.touches && event.touches.length > 0) {
          x = event.touches[0].clientX - rect.left;
          y = event.touches[0].clientY - rect.top;
        } else {
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
        }

        return { x, y };
      },
      clearSignature() {
        const canvas = this.$refs.signaturePad;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
      saveSignature() {
        const canvas = this.$refs.signaturePad;
        const dataURL = canvas.toDataURL('image/png');
        console.log(dataURL);
        // Use this dataURL to send the signature to your backend or trigger a download
      },
    },
  };
  </script>

  <style scoped>
  .signature-container {
    position: relative;
    display: inline-block;
  }

  #signature-pad {
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: crosshair;
  }

  .clear-button {
    position: absolute;
    top: 10px;
    right: 10px;
    /* background-color: #ff6b6b; */
    color: #ff6b6b;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    z-index: 10; /* Ensure it is above the canvas */
    font-size: 10px;
  }

  .clear-button:hover {
    /* background-color: #ff4c4c; */
    color: #ff0000;
  }

  .signature-actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }

  .signature-actions button {
    background-color: #009879;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .signature-actions button:hover {
    background-color: #007f68;
  }
  </style>
