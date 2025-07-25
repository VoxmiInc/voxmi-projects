document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CORRECT_PIN = '369911'; // This is the 6-digit PIN. Change it as needed.
    const UNLOCKED_KEY = 'isWebsiteUnlocked';

    // --- Core Logic ---

    // Check if the site is already unlocked for this browser session
    if (sessionStorage.getItem(UNLOCKED_KEY) === 'true') {
        return; // Do nothing, content is accessible.
    }

    // If not unlocked, create and show the security overlay.
    createLockOverlay();

    // --- Functions ---

    /**
     * Creates the HTML for the overlay and modal, and adds it to the page.
     */
    function createLockOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        overlay.innerHTML = `
            <div class="pin-modal">
                <h2>Access Required</h2>
                <p>Please enter the 6-digit PIN to view this site.</p>
                <input type="password" id="pin-input" maxlength="6" inputmode="numeric" autocomplete="one-time-code">
                <button id="pin-submit">Unlock</button>
                <p id="pin-error" class="pin-error-message"></p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Prevent the main page from scrolling while the overlay is active
        document.body.style.overflow = 'hidden';

        // Add event listeners for the submit button and the enter key
        document.getElementById('pin-submit').addEventListener('click', checkPin);
        document.getElementById('pin-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkPin();
            }
        });
        document.getElementById('pin-input').focus();
    }

    /**
     * Checks the entered PIN against the correct one.
     */
    function checkPin() {
        const input = document.getElementById('pin-input');
        const errorMessage = document.getElementById('pin-error');
        const modal = document.querySelector('.pin-modal');

        if (input.value === CORRECT_PIN) {
            unlockSite();
        } else {
            errorMessage.textContent = 'Incorrect PIN. Please try again.';
            input.value = '';
            input.focus();
            
            // Add a shake animation for visual feedback
            modal.classList.add('shake');
            setTimeout(() => {
                modal.classList.remove('shake');
            }, 500);
        }
    }

    /**
     * Unlocks the site, saves the state, and removes the overlay.
     */
    function unlockSite() {
        sessionStorage.setItem(UNLOCKED_KEY, 'true');
        const overlay = document.getElementById('security-overlay');
        if (overlay) {
            overlay.remove();
        }
        // Restore scrolling to the main page
        document.body.style.overflow = '';
    }
}); 