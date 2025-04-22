// to create a div with iframe inside it. and set src to the url chatgpt.com, give all the permissions to the iframe, make sure it doesnt conflicts with cors
// upon pressing CTRL + Tab + W, opacity of div should be 1, and 0 when pressed again
// it should be the floating window, moving slowly here and there at random.
// it should be draggable, and resizable. with a copy button inside div (implement later what to copy)
// all with javascript. also make sure when script is loaded, url in the address is kept blank and page should not reload, whatever is in address bar should get ""

document.addEventListener('DOMContentLoaded', function() {
    // Clear the URL in address bar without reloading
    window.history.replaceState({}, document.title, '/');
    
    // Create container div for the floating window
    const floatingDiv = document.createElement('div');
    floatingDiv.id = 'floatingWindow';
    floatingDiv.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        width: 400px;
        height: 300px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s;
        overflow: hidden;
        resize: both;
    `;
    
    // Create header for drag functionality
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 10px;
        background-color: #f1f1f1;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.innerHTML = '<span>ChatGPT</span>';
    floatingDiv.appendChild(header);
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.style.cssText = `
        padding: 5px 10px;
        cursor: pointer;
    `;
    copyButton.onclick = function() {
        // Implementation for copy functionality to be added later
        alert('Copy feature will be implemented later');
    };
    header.appendChild(copyButton);
    
    // Create iframe to load ChatGPT
    const iframe = document.createElement('iframe');
    iframe.src = 'https://chatgpt.com';
    iframe.style.cssText = `
        width: 100%;
        height: calc(100% - 40px);
        border: none;
    `;
    // Try to set all permissions (note: many of these aren't actually supported by browsers due to security)
    iframe.setAttribute('allow', 'fullscreen; microphone; camera; display-capture; geolocation; autoplay');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals allow-top-navigation');
    floatingDiv.appendChild(iframe);
    
    // Add the floating window to the document
    document.body.appendChild(floatingDiv);
    
    // Variables for dragging
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // Drag functionality
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
    
    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === header || e.target.parentNode === header) {
            isDragging = true;
        }
    }
    
    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, floatingDiv);
        }
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
    
    // Toggle visibility with CTRL+Tab+W (changed from CTRL+T)
    let isVisible = false;
    let ctrlPressed = false;
    let tabPressed = false;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Control') {
            ctrlPressed = true;
        } else if (e.key === 'Tab' && ctrlPressed) {
            e.preventDefault(); // Prevent browser's default Tab behavior
            tabPressed = true;
        } else if (e.key === 'w' && ctrlPressed && tabPressed) {
            e.preventDefault(); // Prevent browser's default behavior
            isVisible = !isVisible;
            floatingDiv.style.opacity = isVisible ? '1' : '0';
            floatingDiv.style.pointerEvents = isVisible ? 'all' : 'none';
            
            // Stop random movement when invisible
            if (isVisible) {
                startRandomMovement();
            } else {
                stopRandomMovement();
            }
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Control') {
            ctrlPressed = false;
            tabPressed = false;
        } else if (e.key === 'Tab') {
            tabPressed = false;
        }
    });
    
    // Random slow movement
    let movementInterval;
    
    function startRandomMovement() {
        movementInterval = setInterval(() => {
            if (!isDragging) { // Only move if not being dragged
                const randomX = (Math.random() - 0.5) * 2; // Random between -1 and 1
                const randomY = (Math.random() - 0.5) * 2;
                
                currentX += randomX;
                currentY += randomY;
                xOffset = currentX;
                yOffset = currentY;
                
                setTranslate(currentX, currentY, floatingDiv);
            }
        }, 1000); // Move slightly every second
    }
    
    function stopRandomMovement() {
        clearInterval(movementInterval);
    }
});