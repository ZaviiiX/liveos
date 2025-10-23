// Login functionality
const loginScreen = document.getElementById('loginScreen');
const desktop = document.getElementById('desktop');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

// Correct password
const CORRECT_PASSWORD = 'PUMP';

// Sound effects
const startupSound = new Audio('startup.mp3');
const loginSound = new Audio('login.mp3');
const selectSound = new Audio('select.mp3');
const shutdownSound = new Audio('shutdown.mp3');
const closeSound = new Audio('close.mp3');
const backgroundMusic = new Audio('music.mp3');
backgroundMusic.loop = true;

// Audio started flag
let audioStarted = false;

// Function to start all audio on first user interaction
function startAudio() {
    if (!audioStarted) {
        audioStarted = true;
        startupSound.play().catch(e => console.log('Startup sound failed:', e));
        backgroundMusic.play().catch(e => console.log('Background music failed:', e));
    }
}

// Start audio on any click on the login screen
document.addEventListener('click', startAudio, { once: true });

// Login button click
loginBtn.addEventListener('click', handleLogin);

// Enter key press
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

function handleLogin() {
    const password = passwordInput.value;
    
    if (password === CORRECT_PASSWORD) {
        // Successful login
        errorMsg.textContent = '';
        
        // Play login sound
        loginSound.play().catch(e => console.log('Audio play failed:', e));
        
        loginScreen.classList.add('hidden');
        desktop.classList.remove('hidden');
        
        // Show welcome window on login
        const welcomeWindow = document.querySelector('.welcome-window');
        if (welcomeWindow) {
            welcomeWindow.style.display = '';
        }
        
        startClock();
    } else {
        // Failed login
        errorMsg.textContent = 'Incorrect password. Please try again.';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('clock').textContent = timeString;
}

function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// Window cascading offset tracker
let windowOffsetIndex = 0;
const CASCADE_OFFSET = 40; // pixels to offset each window

// Window z-index management
let topZIndex = 10;

function bringWindowToFront(windowElement) {
    topZIndex++;
    windowElement.style.zIndex = topZIndex;
}

// Mute toggle functionality
const muteToggle = document.getElementById('muteToggle');
let isMuted = false;

// Window controls
document.addEventListener('DOMContentLoaded', () => {
    const welcomeWindow = document.querySelector('.welcome-window');

    // Mute toggle event
    muteToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            backgroundMusic.volume = 0;
            muteToggle.textContent = '🔇';
        } else {
            backgroundMusic.volume = 1;
            muteToggle.textContent = '🔊';
        }
    });

    // ===== Pump BROWSER =====
    const browserIcon = document.getElementById('browserIcon');
    const browserWindow = document.querySelector('.browser-window');

    // Open browser on icon double-click - fullscreen
    browserIcon.addEventListener('dblclick', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        browserWindow.style.display = '';
        browserWindow.classList.remove('hidden');
        browserWindow.classList.add('maximized');
        bringWindowToFront(browserWindow);
    });

    // Bring browser to front when clicked
    browserWindow.addEventListener('mousedown', () => {
        bringWindowToFront(browserWindow);
    });

    // Twitter link handler
    const twitterLink = document.getElementById('twitterLink');
    twitterLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Replace with actual Twitter URL when available
        const twitterUrl = 'https://x.com/Pump_BSC'; // Update this URL when Twitter link is provided
        window.open(twitterUrl, '_blank');
    });

    // Welcome window Twitter link handler
    const welcomeTwitterLink = document.getElementById('welcomeTwitterLink');
    welcomeTwitterLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Replace with actual Twitter URL when available
        const twitterUrl = 'https://x.com/Pump_BSC'; // Update this URL when Twitter link is provided
        window.open(twitterUrl, '_blank');
    });

    // Contract Address
    const CONTRACT_ADDRESS = '';

    // Copy CA button handlers
    const welcomeCopyCA = document.getElementById('welcomeCopyCA');
    const browserCopyCA = document.getElementById('browserCopyCA');

    function copyContractAddress(button) {
        // Copy to clipboard
        navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
            // Store original text
            const originalText = button.textContent;
            
            // Change button text and style
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    welcomeCopyCA.addEventListener('click', () => {
        copyContractAddress(welcomeCopyCA);
    });

    browserCopyCA.addEventListener('click', () => {
        copyContractAddress(browserCopyCA);
    });

    // ===== REWARDS =====
    const rewardsIcon = document.getElementById('rewardsIcon');
    const rewardsWindow = document.querySelector('.rewards-window');

    rewardsIcon.addEventListener('dblclick', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        rewardsWindow.style.display = '';
        rewardsWindow.classList.remove('hidden');
        rewardsWindow.classList.remove('maximized');
        cascadeWindow(rewardsWindow);
        bringWindowToFront(rewardsWindow);
    });

    // Bring Rewards to front when clicked
    rewardsWindow.addEventListener('mousedown', () => {
        bringWindowToFront(rewardsWindow);
    });

    // ===== MY COMPUTER =====
    const myComputerIcon = document.getElementById('myComputerIcon');
    const myComputerWindow = document.querySelector('.mycomputer-window');

    myComputerIcon.addEventListener('dblclick', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        myComputerWindow.style.display = '';
        myComputerWindow.classList.remove('hidden');
        myComputerWindow.classList.remove('maximized');
        positionTopRight(myComputerWindow);
        bringWindowToFront(myComputerWindow);
    });

    // Bring My Computer to front when clicked
    myComputerWindow.addEventListener('mousedown', () => {
        bringWindowToFront(myComputerWindow);
    });

    // ===== MAIL =====
    const mailIcon = document.getElementById('mailIcon');
    const mailWindow = document.querySelector('.mail-window');

    mailIcon.addEventListener('dblclick', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        mailWindow.style.display = '';
        mailWindow.classList.remove('hidden');
        mailWindow.classList.remove('maximized');
        positionBottomLeft(mailWindow);
        bringWindowToFront(mailWindow);
    });

    // Bring Mail to front when clicked
    mailWindow.addEventListener('mousedown', () => {
        bringWindowToFront(mailWindow);
    });

    // ===== DESKTOP BUDDY =====
    const helperIcon = document.getElementById('helperIcon');
    const desktopBuddy = document.getElementById('desktopBuddy');
    const buddyMascot = document.getElementById('buddyMascot');
    const buddyClose = document.getElementById('buddyClose');
    const botBubble = document.getElementById('botBubble');
    const userBubble = document.getElementById('userBubble');
    const botBubbleContent = document.getElementById('botBubbleContent');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Show buddy on icon double-click
    helperIcon.addEventListener('dblclick', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        desktopBuddy.classList.remove('hidden');
        
        // Show welcome message after a delay
        setTimeout(() => {
            showBotBubble('Hello! I\'m Pump Bot! 👋 Click me to chat!');
        }, 800);
    });

    // Close buddy
    buddyClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        desktopBuddy.classList.add('hidden');
        botBubble.classList.add('hidden');
        userBubble.classList.add('hidden');
    });

    // Make desktop buddy draggable
    let isBuddyDragging = false;
    let buddyStartX, buddyStartY, buddyInitialX, buddyInitialY;

    desktopBuddy.addEventListener('mousedown', (e) => {
        // Don't drag if clicking on close button or chat bubbles
        if (e.target.closest('.buddy-close') || 
            e.target.closest('.speech-bubble') || 
            e.target.closest('.user-input') || 
            e.target.closest('.send-btn')) {
            return;
        }

        isBuddyDragging = true;
        const rect = desktopBuddy.getBoundingClientRect();
        buddyStartX = e.clientX;
        buddyStartY = e.clientY;
        buddyInitialX = rect.left;
        buddyInitialY = rect.top;
        
        desktopBuddy.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isBuddyDragging) return;

        const deltaX = e.clientX - buddyStartX;
        const deltaY = e.clientY - buddyStartY;
        
        let newX = buddyInitialX + deltaX;
        let newY = buddyInitialY + deltaY;
        
        // Constrain to viewport (accounting for buddy size)
        const buddyWidth = desktopBuddy.offsetWidth;
        const buddyHeight = desktopBuddy.offsetHeight;
        const maxX = window.innerWidth - buddyWidth;
        const maxY = window.innerHeight - 50 - buddyHeight; // 50px for taskbar
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // Update position - override the centered positioning
        desktopBuddy.style.left = newX + 'px';
        desktopBuddy.style.top = newY + 'px';
        desktopBuddy.style.bottom = 'auto';
        desktopBuddy.style.transform = 'none';
        desktopBuddy.style.marginLeft = '0';
    });

    document.addEventListener('mouseup', () => {
        if (isBuddyDragging) {
            isBuddyDragging = false;
            desktopBuddy.style.cursor = 'move';
        }
    });

    // Toggle chat on mascot click
    buddyMascot.addEventListener('click', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        
        if (userBubble.classList.contains('hidden')) {
            // Show user input bubble
            botBubble.classList.add('hidden');
            userBubble.classList.remove('hidden');
            userInput.focus();
        } else {
            // Hide user input bubble
            userBubble.classList.add('hidden');
        }
    });

    // Helper chat functionality
    const helperResponses = {
        // Greetings
        'hello': 'Hello! 👋 Welcome to PumpOS! I\'m your Desktop Helper. How can I assist you today?',
        'hi': 'Hi there! 😊 I\'m Pump Bot, ready to help you navigate PumpOS. What would you like to know?',
        'hey': 'Hey! 🤖 Great to see you! I\'m here to help with any questions about PumpOS.',
        'good morning': 'Good morning! ☀️ Hope you\'re having a wonderful day! How can I help you with PumpOS?',
        'good afternoon': 'Good afternoon! 🌤️ I\'m here to assist you with PumpOS. What can I do for you?',
        'good evening': 'Good evening! 🌙 Ready to help you explore PumpOS. What\'s on your mind?',
        'greetings': 'Greetings! 🎉 I\'m your friendly Desktop Helper. Ask me anything about PumpOS!',
        
        // Goodbyes
        'goodbye': 'Goodbye! 👋 Thanks for using PumpOS. Feel free to come back anytime you need assistance!',
        'bye': 'Bye! 😊 Have a great day! I\'ll be here whenever you need help with PumpOS.',
        'see you': 'See you later! 🌟 Thanks for chatting with me. Come back anytime!',
        'later': 'Catch you later! ✌️ Don\'t hesitate to reach out if you need help!',
        'farewell': 'Farewell! 🎊 It was a pleasure helping you today. Take care!',
        'good night': 'Good night! 🌙 Sweet dreams! I\'ll be here tomorrow if you need me.',
        
        // Politeness
        'thank': 'You\'re very welcome! 😊 I\'m always happy to help. Is there anything else you\'d like to know?',
        'thanks': 'My pleasure! 🌟 Feel free to ask me anything else about PumpOS!',
        'please': 'Of course! I\'m here to help. What would you like to know about PumpOS?',
        
        // Information queries
        'what is PumpOS': 'PumpOS is a retro-styled operating system interface that brings nostalgia and modern functionality together! It features a beautiful cyan gradient design and classic window aesthetics.',
        'how do i use': 'Double-click any desktop icon to open applications! You can explore the Browser, My Computer, Mail, and more. Click the Power icon to shutdown the system.',
        'features': 'PumpOS includes: Pump Browser for BNB token info, My Computer for system details, Mail with success stories, this Desktop Helper for assistance, an empty Recycle Bin, and a Power button with cool animations!',
        'who created': 'PumpOS was created as a nostalgic tribute to classic operating systems, combining retro aesthetics with modern web technologies.',
        'help': 'I can help you learn about PumpOS! Try asking: "What is PumpOS?", "How do I use this?", "What features are available?", or just say hi!',
        
        // Fun interactions
        'how are you': 'I\'m doing fantastic! 🚀 Thanks for asking! I\'m always excited to help users explore PumpOS. How are you?',
        'awesome': 'That\'s awesome! 🎉 Glad you\'re enjoying PumpOS!',
        'cool': 'Right? PumpOS is pretty cool! 😎 What would you like to explore next?',
        'amazing': 'I know, right? Amazing! ⭐ Is there anything specific you\'d like to learn about?',
        
        'default': 'That\'s an interesting question! PumpOS features include a browser, mail client, system information, and more. Try asking about specific features, say hello, or type "help" for suggestions!'
    };

    function showBotBubble(message) {
        botBubbleContent.textContent = message;
        botBubble.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            botBubble.classList.add('hidden');
        }, 5000);
    }

    function sendBuddyMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        const messageLower = message.toLowerCase();
        
        // Clear input and hide user bubble
        userInput.value = '';
        userBubble.classList.add('hidden');

        // Get bot response
        let response = helperResponses['default'];
        for (let key in helperResponses) {
            if (messageLower.includes(key)) {
                response = helperResponses[key];
                break;
            }
        }

        // Show bot response after a delay
        setTimeout(() => {
            showBotBubble(response);
        }, 600);
    }

    sendBtn.addEventListener('click', sendBuddyMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBuddyMessage();
        }
    });

    // ===== RECYCLE BIN =====
    const recycleBinIcon = document.getElementById('recycleBinIcon');
    const recycleBinWindow = document.querySelector('.recyclebin-window');

    recycleBinIcon.addEventListener('dblclick', () => {
        selectSound.play().catch(e => console.log('Audio play failed:', e));
        recycleBinWindow.style.display = '';
        recycleBinWindow.classList.remove('hidden');
        positionTopLeft(recycleBinWindow);
        bringWindowToFront(recycleBinWindow);
    });

    // Bring Recycle Bin to front when clicked
    recycleBinWindow.addEventListener('mousedown', () => {
        bringWindowToFront(recycleBinWindow);
    });

    // ===== POWER BUTTON =====
    const powerIcon = document.getElementById('powerIcon');
    const shutdownOverlay = document.getElementById('shutdownOverlay');

    powerIcon.addEventListener('dblclick', () => {
        // Stop background music and play shutdown sound
        backgroundMusic.pause();
        shutdownSound.play().catch(e => console.log('Shutdown sound failed:', e));
        
        // Close all windows before shutdown
        browserWindow.classList.add('hidden');
        browserWindow.classList.remove('maximized');
        myComputerWindow.classList.add('hidden');
        myComputerWindow.classList.remove('maximized');
        mailWindow.classList.add('hidden');
        mailWindow.classList.remove('maximized');
        desktopBuddy.classList.add('hidden');
        recycleBinWindow.classList.add('hidden');
        recycleBinWindow.classList.remove('maximized');
        welcomeWindow.style.display = 'none';
        
        // Start shutdown sequence
        shutdownOverlay.classList.remove('hidden');
        
        // After 3 seconds, start reboot
        setTimeout(() => {
            startReboot();
        }, 3000);
    });

    function startReboot() {
        // Play startup sound for reboot
        startupSound.currentTime = 0;
        startupSound.play().catch(e => console.log('Audio play failed:', e));
        
        // Change to boot screen
        const shutdownContent = shutdownOverlay.querySelector('.shutdown-content');
        
        shutdownContent.innerHTML = `
            <div class="boot-logo">PumpOS</div>
            <div class="boot-message">Booting up...</div>
            <div class="boot-progress">
                <div class="boot-progress-bar"></div>
            </div>
        `;

        // After 2.5 seconds, return to login
        setTimeout(() => {
            shutdownOverlay.classList.add('hidden');
            desktop.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            
            // Restart background music on login screen
            backgroundMusic.currentTime = 0;
            backgroundMusic.play().catch(e => console.log('Background music restart failed:', e));
            
            // Reset shutdown overlay for next time
            shutdownContent.innerHTML = `
                <div class="shutdown-logo">PumpOS</div>
                <div class="shutdown-message">Shutting down...</div>
                <div class="shutdown-spinner"></div>
            `;
        }, 2500);
    }

    // Welcome Window Controls
    welcomeWindow.querySelector('.window-btn.close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        welcomeWindow.style.display = 'none';
    });
    welcomeWindow.querySelector('.window-btn.minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        welcomeWindow.style.display = 'none';
    });
    welcomeWindow.querySelector('.window-btn.maximize').addEventListener('click', (e) => {
        e.stopPropagation();
        welcomeWindow.classList.toggle('maximized');
    });

    // Browser Window Controls
    browserWindow.querySelector('.browser-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        browserWindow.classList.add('hidden');
        browserWindow.style.display = 'none';
    });
    browserWindow.querySelector('.window-btn.minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        browserWindow.classList.add('hidden');
        browserWindow.style.display = 'none';
    });
    browserWindow.querySelector('.window-btn.maximize').addEventListener('click', (e) => {
        e.stopPropagation();
        browserWindow.classList.toggle('maximized');
    });

    // My Computer Window Controls
    myComputerWindow.querySelector('.mycomputer-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        myComputerWindow.classList.add('hidden');
        myComputerWindow.style.display = 'none';
    });
    myComputerWindow.querySelector('.mycomputer-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        myComputerWindow.classList.add('hidden');
        myComputerWindow.style.display = 'none';
    });
    myComputerWindow.querySelector('.window-btn.maximize').addEventListener('click', (e) => {
        e.stopPropagation();
        myComputerWindow.classList.toggle('maximized');
    });

    // Mail Window Controls
    mailWindow.querySelector('.mail-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        mailWindow.classList.add('hidden');
        mailWindow.style.display = 'none';
    });
    mailWindow.querySelector('.mail-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        mailWindow.classList.add('hidden');
        mailWindow.style.display = 'none';
    });
    mailWindow.querySelector('.window-btn.maximize').addEventListener('click', (e) => {
        e.stopPropagation();
        mailWindow.classList.toggle('maximized');
    });


    // Recycle Bin Window Controls
    recycleBinWindow.querySelector('.recyclebin-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        recycleBinWindow.classList.add('hidden');
        recycleBinWindow.style.display = 'none';
    });
    recycleBinWindow.querySelector('.recyclebin-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        recycleBinWindow.classList.add('hidden');
        recycleBinWindow.style.display = 'none';
    });
    recycleBinWindow.querySelector('.window-btn.maximize').addEventListener('click', (e) => {
        e.stopPropagation();
        recycleBinWindow.classList.toggle('maximized');
    });

    // Rewards Window Controls
    rewardsWindow.querySelector('.rewards-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeSound.play().catch(e => console.log('Close sound failed:', e));
        rewardsWindow.classList.add('hidden');
        rewardsWindow.style.display = 'none';
    });
    rewardsWindow.querySelector('.rewards-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        rewardsWindow.classList.add('hidden');
        rewardsWindow.style.display = 'none';
    });
    rewardsWindow.querySelector('.window-btn.maximize').addEventListener('click', (e) => {
        e.stopPropagation();
        rewardsWindow.classList.toggle('maximized');
    });
});

// Helper function to cascade windows
function cascadeWindow(windowElement) {
    const offset = windowOffsetIndex * CASCADE_OFFSET;
    const maxOffset = 200; // Reset after this many pixels
    
    // Calculate position with wrap-around
    const actualOffset = offset % maxOffset;
    
    windowElement.style.top = `${100 + actualOffset}px`;
    windowElement.style.left = `${150 + actualOffset}px`;
    windowElement.style.transform = 'none';
    
    // Increment offset for next window
    windowOffsetIndex++;
    
    // Reset if we've gone too far
    if (windowOffsetIndex * CASCADE_OFFSET >= maxOffset) {
        windowOffsetIndex = 0;
    }
}

// Helper function to center windows
function centerWindow(windowElement) {
    windowElement.style.bottom = 'auto';
    windowElement.style.right = 'auto';
    windowElement.style.top = '50%';
    windowElement.style.left = '50%';
    windowElement.style.transform = 'translate(-50%, -50%)';
}

// Helper function to position window at top right
function positionTopRight(windowElement) {
    windowElement.style.bottom = 'auto';
    windowElement.style.right = '20px';
    windowElement.style.top = '20px';
    windowElement.style.left = 'auto';
    windowElement.style.transform = 'none';
}

// Helper function to position window at bottom left
function positionBottomLeft(windowElement) {
    windowElement.style.bottom = 'auto';
    windowElement.style.right = 'auto';
    windowElement.style.top = `${window.innerHeight - 50 - windowElement.offsetHeight - 70}px`; // Above taskbar
    windowElement.style.left = '20px';
    windowElement.style.transform = 'none';
}

// Helper function to position window at top left
function positionTopLeft(windowElement) {
    windowElement.style.bottom = 'auto';
    windowElement.style.right = 'auto';
    windowElement.style.top = '20px';
    windowElement.style.left = '20px';
    windowElement.style.transform = 'none';
}

// Make windows draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let draggedWindow = null;

document.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    // Check if clicked on a titlebar
    const titlebar = e.target.closest('.window-titlebar');
    if (!titlebar) return;
    
    // Don't drag if clicked on a button
    if (e.target.classList.contains('window-btn')) return;
    
    draggedWindow = titlebar.closest('.window');
    if (!draggedWindow) return;
    
    const rect = draggedWindow.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    isDragging = true;
}

function drag(e) {
    if (isDragging && draggedWindow) {
        e.preventDefault();
        
        // Calculate new position
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        // Get window dimensions
        const windowRect = draggedWindow.getBoundingClientRect();
        const windowWidth = windowRect.width;
        const windowHeight = windowRect.height;
        
        // Get viewport dimensions (account for taskbar)
        const maxX = window.innerWidth - windowWidth;
        const maxY = window.innerHeight - 50 - windowHeight; // 50px for taskbar
        
        // Constrain to bounds
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        // Clear any bottom/right positioning that might conflict
        draggedWindow.style.bottom = 'auto';
        draggedWindow.style.right = 'auto';
        
        draggedWindow.style.left = currentX + 'px';
        draggedWindow.style.top = currentY + 'px';
        draggedWindow.style.transform = 'none';
    }
}

function dragEnd(e) {
    isDragging = false;
    draggedWindow = null;
}