// uiInteractions.js

document.addEventListener("DOMContentLoaded", function() {
    // Handle Enter key navigation
    function handleEnterKeyNavigation(e) {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default action (submitting the form)
            const inputs = Array.from(document.querySelectorAll("input[type='text'], input[type='number'], input[type='date'], select"));
            const currentIndex = inputs.indexOf(e.target);
            const nextInput = inputs[currentIndex + 1];
            if (nextInput) {
                nextInput.focus(); // Focus the next input
            }
        }
    }

    // Handle Arrow key navigation
    function handleArrowKeyNavigation(e) {
        const inputs = Array.from(document.querySelectorAll("input[type='text'], input[type='number'], input[type='date'], select"));
        const currentIndex = inputs.indexOf(e.target);
        let nextInput;

        switch (e.key) {
            case "ArrowUp":
                nextInput = inputs[currentIndex - 1];
                break;
            case "ArrowDown":
                nextInput = inputs[currentIndex + 1];
                break;
            case "ArrowLeft":
                if (currentIndex > 0) {
                    nextInput = inputs[currentIndex - 1];
                }
                break;
            case "ArrowRight":
                if (currentIndex < inputs.length - 1) {
                    nextInput = inputs[currentIndex + 1];
                }
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        if (nextInput) {
            e.preventDefault(); // Prevent default action
            nextInput.focus(); // Focus the next input
        }
    }

    // Attach event listeners to all existing inputs
    document.addEventListener("keydown", function(e) {
        if (e.target.matches("input[type='text'], input[type='number'], input[type='date'], select")) {
            handleEnterKeyNavigation(e);
            handleArrowKeyNavigation(e);
        }
    });
});
