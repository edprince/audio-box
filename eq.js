export const renderAxes = (canvas) => {
    let { width, height } = canvas.getBoundingClientRect();
    width *= window.devicePixelRatio;
    height *= window.devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const grid_size = 10;
    const yGridSize = 50;
    const xGridSize = 50;
    const y_axis_distance_grid_lines = 0;
    const x_axis_distance_grid_lines = 0;

    const xUpper = 6000;
    const xKeys = [60, 100, 300, 600, 1000, 3000, 6000];

    const yUpper = 10;


    const num_lines_x = Math.floor(height / grid_size);
    const num_lines_y = Math.floor(width / yGridSize);

    const x_axis_starting_point = { number: 1, suffix: '' };
    const y_axis_starting_point = { number: -10, suffix: 'dB' };


    // Draw grid lines along X-axis
    for (var i = 0; i <= yUpper; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if (i == x_axis_distance_grid_lines)
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        else
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";

        if (i == num_lines_x) {
            ctx.moveTo(0, xGridSize * i);
            ctx.lineTo(width, xGridSize * i);
        }
        else {
            ctx.moveTo(0, xGridSize * i + 0.5);
            ctx.lineTo(width, xGridSize * i + 0.5);
        }
        ctx.stroke();
    }
    // Draw grid lines along Y-axis
    for (i = 0; i <= xUpper; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents Y-axis draw in different color
        if (i == y_axis_distance_grid_lines)
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        else
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";

        if (i == num_lines_y) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
        }
        else {
            if (xKeys.includes(i * 10)) {
                ctx.moveTo(i + 0.5, 0);
                ctx.lineTo(i + 0.5, height);
            }
        }
        ctx.stroke();
    }

    // Ticks marks along the positive X-axis
    for (i = 1; i < (xUpper); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(i + 0.5, 3);
        ctx.lineTo(i + 0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '12px Arial';
        ctx.textAlign = 'start';
        ctx.fillStyle = 'rgba(255, 255, 255, .4)';
        if (xKeys.includes(i)) {
            ctx.fillText(x_axis_starting_point.number * i * 10 + x_axis_starting_point.suffix, i - 8, 15);
            ctx.fillText(x_axis_starting_point.number * i * 10 + x_axis_starting_point.suffix, i - 8, height - 15);
        }

    }

    // Ticks marks along the positive Y-axis
    // Positive Y-axis of graph is negative Y-axis of the canvas
    for (i = 1; i < (yUpper); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, yGridSize * i + 0.5);
        ctx.lineTo(3, yGridSize * i + 0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '12px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(-y_axis_starting_point.number * i + y_axis_starting_point.suffix, 8, yGridSize * i + 3);
    }

    // Ticks marks along the negative Y-axis
    // Negative Y-axis of graph is positive Y-axis of the canvas
    for (i = 1; i < xUpper; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, -grid_size * i + 0.5);
        ctx.lineTo(3, -grid_size * i + 0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number * i + y_axis_starting_point.suffix, height - 8, -grid_size * i + 3);
    }
    ctx.translate(y_axis_distance_grid_lines * grid_size, x_axis_distance_grid_lines * grid_size);

}

export const generateCanvas = (id) => {
    return document.getElementById(id);
}