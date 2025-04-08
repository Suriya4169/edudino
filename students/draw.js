document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const canvas = document.getElementById("draw-area");
    const ctx = canvas.getContext("2d");
    const clearBtn = document.getElementById("clear-btn");
    const submitBtn = document.getElementById("submit-btn");
    const questionElement = document.getElementById("question");
    const userNameDisplay = document.getElementById("user-name");
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    const penBtn = document.getElementById("pen-btn");
    const eraserBtn = document.getElementById("eraser-btn");
    const sizeSlider = document.getElementById("size-slider");

    // Set up drawing state
    let isDrawing = false;
    let currentTool = "pen";
    let currentSize = 5;
    let lastX = 0;
    let lastY = 0;

    // Enhanced questions
    const questions = [
        "Draw an apple",
        "Draw a sun",
        "Draw a tree",
        "Draw a boat",
        "Draw a flower"
    ];

    // Load username
    const storedName = localStorage.getItem("username") || prompt("Please enter your name:", "Guest");
    localStorage.setItem("username", storedName || "Guest");
    userNameDisplay.textContent = `Hello, ${storedName || "Guest"}!`;

    // Set initial question
    let currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionElement.textContent = currentQuestion;

    // Initialize canvas with responsive sizing
    function initCanvas() {
        resizeCanvas();
        
        // Fill with white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set drawing properties
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        updateBrush();
        
        // Add window resize listener for responsive canvas
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Resize canvas to fit container while maintaining aspect ratio
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerStyle = getComputedStyle(container);
        const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
        const paddingY = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
        const toolsHeight = document.querySelector('.tools').offsetHeight;
        
        // Calculate available space
        const availableWidth = container.clientWidth - paddingX;
        const availableHeight = container.clientHeight - paddingY - toolsHeight - 10; // 10px extra margin
        
        // Set canvas size to largest possible square that fits
        const size = Math.min(availableWidth, availableHeight);
        
        // Set actual canvas dimensions (for drawing)
        canvas.width = size;
        canvas.height = size;
        
        // Set display size
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        
        // If there was existing content, redraw it at new size
        // This would be more complex and require saving/restoring the image
        // For simplicity, we'll just clear it when resizing
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Reset brush settings
        updateBrush();
    }

    // Update brush based on current settings
    function updateBrush() {
        ctx.lineWidth = currentSize;
        if (currentTool === "pen") {
            ctx.strokeStyle = "#000000"; // Always black for pen
            ctx.globalCompositeOperation = "source-over";
        } else {
            ctx.strokeStyle = "white";
            ctx.globalCompositeOperation = "destination-out";
        }
    }

    // Drawing events with touch support
    function startDrawing(e) {
        isDrawing = true;
        const { offsetX, offsetY } = getCoordinates(e);
        lastX = offsetX;
        lastY = offsetY;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        // Draw a dot if just clicked
        ctx.arc(offsetX, offsetY, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const { offsetX, offsetY } = getCoordinates(e);
        
        // Smooth line drawing
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        
        lastX = offsetX;
        lastY = offsetY;
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.closePath();
        }
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        
        if (e.type.includes('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            };
        } else {
            return {
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            };
        }
    }

    // Tool selection
    penBtn.addEventListener("click", () => {
        currentTool = "pen";
        penBtn.classList.add("active");
        eraserBtn.classList.remove("active");
        updateBrush();
    });

    eraserBtn.addEventListener("click", () => {
        currentTool = "eraser";
        eraserBtn.classList.add("active");
        penBtn.classList.remove("active");
        updateBrush();
    });

    // Size change
    sizeSlider.addEventListener("input", (e) => {
        currentSize = e.target.value;
        updateBrush();
    });

    // Clear canvas
    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your drawing?")) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    });

    // Submit drawing
    submitBtn.addEventListener("click", () => {
        // Check if canvas is empty
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const isCanvasBlank = !pixelData.some(channel => channel !== 255);
        
        if (isCanvasBlank) {
            showNotification("Please draw something before submitting!", "error");
            return;
        }
        
        const drawingData = canvas.toDataURL("image/png");

        // Simulate sending to backend
        console.log("Submitting drawing for:", currentQuestion);
        console.log("Drawing Data:", drawingData);

        // Show success notification
        showNotification("Drawing submitted successfully! Loading new challenge...");
        
        // Load a new question after a short delay
        setTimeout(() => {
            // Get a different question than the current one
            let newQuestion;
            do {
                newQuestion = questions[Math.floor(Math.random() * questions.length)];
            } while (newQuestion === currentQuestion && questions.length > 1);
            
            currentQuestion = newQuestion;
            questionElement.textContent = currentQuestion;
            
            // Clear canvas for new drawing
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 1500);
    });

    // Show notification
    function showNotification(message, type = "success") {
        notificationMessage.textContent = message;
        notification.style.backgroundColor = type === "error" ? "#f44336" : "#03dac6";
        notification.classList.add("show");
        
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    // Event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    
    // Touch support
    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        stopDrawing();
    });

    // Initialize
    initCanvas();
});