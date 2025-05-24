// Canvas.jsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const Canvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getContext: () => canvasRef.current?.getContext('2d'),

        clear: () => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        },

        drawCircle: (x, y, radius, color) => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        },

        drawRect: (x, y, w, h, color) => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        },

        drawLine: (x1, y1, x2, y2, color = 'black', width = 4, debug = false) => {
            if (debug) {
                console.log("drawing line", x1, y1, x2, y2, color, width);
            }
            const ctx = canvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
        }
    }));

    return (
        <canvas
            ref={canvasRef}
            width={props.width}
            height={props.height}
            className="border border-black"
        />
    );
});

export default Canvas;
