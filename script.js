// =================== Solana XP - script.js (clean) ===================

// ---- ROOT ELEMENTS / AUTH ----
const loginScreen   = document.getElementById('loginScreen');
const desktop       = document.getElementById('desktop');
const passwordInput = document.getElementById('password');
const loginBtn      = document.getElementById('loginBtn');
const errorMsg      = document.getElementById('errorMsg');
const CORRECT_PASSWORD = 'solana';

// ---- GLOBALS ----
const CONTRACT_ADDRESS = '424tCJy2ZFctvznL2Qi1h7YvwWJZNWNoy3FELGPs3fKy';
const TWITTER_URL = 'https://x.com/solana_xp'; // promijeni kad bude pravi handle

// ---- AUDIO ----
const startupSound   = new Audio('startup.mp3');
const loginSound     = new Audio('login.mp3');
const selectSound    = new Audio('select.mp3');
const shutdownSound  = new Audio('shutdown.mp3');
const closeSound     = new Audio('close.mp3');
const backgroundMusic= new Audio('music.mp3');
backgroundMusic.loop = true;

let audioStarted = false;
function startAudio() {
  if (audioStarted) return;
  audioStarted = true;
  startupSound.play().catch(e => console.log('Startup sound failed:', e));
  backgroundMusic.play().catch(e => console.log('Background music failed:', e));
}
document.addEventListener('click', startAudio, { once: true });

// ---- CLOCK ----
function updateClock() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const el = document.getElementById('clock');
  if (el) el.textContent = `${hh}:${mm}`;
}
function startClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

// ---- WINDOW STACK / POSITION HELPERS ----
let windowOffsetIndex = 0;
const CASCADE_OFFSET = 40;
let topZIndex = 10;

function bringWindowToFront(win) {
  topZIndex++;
  win.style.zIndex = topZIndex;
}

function cascadeWindow(win) {
  const maxOffset = 200;
  const off = (windowOffsetIndex * CASCADE_OFFSET) % maxOffset;
  win.style.top = `${100 + off}px`;
  win.style.left = `${150 + off}px`;
  win.style.transform = 'none';
  windowOffsetIndex = (windowOffsetIndex + 1) % Math.ceil(maxOffset / CASCADE_OFFSET);
}

function centerWindow(win) {
  win.style.bottom = 'auto';
  win.style.right  = 'auto';
  win.style.top    = '50%';
  win.style.left   = '50%';
  win.style.transform = 'translate(-50%, -50%)';
}

function positionTopRight(win) {
  win.style.bottom = 'auto';
  win.style.right  = '20px';
  win.style.top    = '20px';
  win.style.left   = 'auto';
  win.style.transform = 'none';
}

function positionBottomLeft(win) {
  win.style.bottom = 'auto';
  win.style.right  = 'auto';
  win.style.top    = `${window.innerHeight - 50 - win.offsetHeight - 70}px`;
  win.style.left   = '20px';
  win.style.transform = 'none';
}

function positionTopLeft(win) {
  win.style.bottom = 'auto';
  win.style.right  = 'auto';
  win.style.top    = '20px';
  win.style.left   = '20px';
  win.style.transform = 'none';
}

// ---- COPY CA (global util) ----
function copyContractAddress(buttonEl) {
  navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
    const original = buttonEl.textContent;
    buttonEl.textContent = 'Copied!';
    buttonEl.classList.add('copied');
    setTimeout(() => {
      buttonEl.textContent = original;
      buttonEl.classList.remove('copied');
    }, 2000);
  }).catch(err => console.error('Failed to copy:', err));
}

// ---- DRAGGING FOR WINDOWS ----
let isDragging = false, draggedWindow = null, initialX = 0, initialY = 0;

document.addEventListener('mousedown', (e) => {
  const titlebar = e.target.closest('.window-titlebar');
  if (!titlebar) return;
  if (e.target.classList.contains('window-btn')) return;
  draggedWindow = titlebar.closest('.window');
  if (!draggedWindow) return;
  const rect = draggedWindow.getBoundingClientRect();
  initialX = e.clientX - rect.left;
  initialY = e.clientY - rect.top;
  isDragging = true;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !draggedWindow) return;
  e.preventDefault();
  let x = e.clientX - initialX;
  let y = e.clientY - initialY;
  const rect = draggedWindow.getBoundingClientRect();
  const maxX = window.innerWidth  - rect.width;
  const maxY = window.innerHeight - 50 - rect.height; // 50px taskbar
  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));
  draggedWindow.style.bottom = 'auto';
  draggedWindow.style.right  = 'auto';
  draggedWindow.style.left   = x + 'px';
  draggedWindow.style.top    = y + 'px';
  draggedWindow.style.transform = 'none';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  draggedWindow = null;
});

// ---- LOGIN ----
loginBtn?.addEventListener('click', handleLogin);
passwordInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
  const password = passwordInput.value;
  if (password !== CORRECT_PASSWORD) {
    errorMsg.textContent = 'Incorrect password. Please try again.';
    passwordInput.value = '';
    passwordInput.focus();
    return;
  }

  errorMsg.textContent = '';
  loginSound.play().catch(e => console.log('Audio play failed:', e));
  loginScreen.classList.add('hidden');
  desktop.classList.remove('hidden');

  // show Welcome (center)
  const welcomeWindow = document.querySelector('.welcome-window');
  if (welcomeWindow) {
    welcomeWindow.style.display = '';
    welcomeWindow.classList.remove('hidden');
    centerWindow(welcomeWindow);
    bringWindowToFront(welcomeWindow);
  }

  // show BUY (top-right)
  const buyWindow = document.querySelector('.buy-window');
  if (buyWindow) {
    buyWindow.style.display = '';
    buyWindow.classList.remove('hidden', 'maximized');
    positionTopRight(buyWindow);
    bringWindowToFront(buyWindow);
  }

  startClock();
}

// ====================== DOMContentLoaded ======================
document.addEventListener('DOMContentLoaded', () => {
  const muteToggle = document.getElementById('muteToggle');
  let isMuted = false;

  // WINDOWS refs (shared)
  const browserWindow    = document.querySelector('.browser-window');
  const rewardsWindow    = document.querySelector('.rewards-window');
  const myComputerWindow = document.querySelector('.mycomputer-window');
  const mailWindow       = document.querySelector('.mail-window');
  const recycleBinWindow = document.querySelector('.recyclebin-window');
  const welcomeWindow    = document.querySelector('.welcome-window');
  const buyWindow        = document.querySelector('.buy-window');

  // ---- MUTE ----
  muteToggle?.addEventListener('click', () => {
    isMuted = !isMuted;
    backgroundMusic.volume = isMuted ? 0 : 1;
    muteToggle.textContent = isMuted ? '🔇' : '🔊';
  });

  // ---- BUY WINDOW ----
  const buyIcon   = document.getElementById('buyIcon');
  const buyCA     = document.getElementById('buyCA');
  const buyCopyCA = document.getElementById('buyCopyCA');

  if (buyCA) buyCA.textContent = CONTRACT_ADDRESS;
  buyCopyCA?.addEventListener('click', () => copyContractAddress(buyCopyCA));
  buyIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    buyWindow.style.display = '';
    buyWindow.classList.remove('hidden', 'maximized');
    positionTopRight(buyWindow);
    bringWindowToFront(buyWindow);
  });
  if (buyWindow) {
    buyWindow.querySelector('.close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      buyWindow.classList.add('hidden'); buyWindow.style.display = 'none';
    });
    buyWindow.querySelector('.minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); buyWindow.classList.add('hidden'); buyWindow.style.display = 'none';
    });
    buyWindow.querySelector('.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); buyWindow.classList.toggle('maximized');
    });
    buyWindow.addEventListener('mousedown', () => bringWindowToFront(buyWindow));
  }

  // ---- BROWSER ----
  const browserIcon = document.getElementById('browserIcon');
  browserIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    browserWindow.style.display = '';
    browserWindow.classList.remove('hidden');
    browserWindow.classList.add('maximized');
    bringWindowToFront(browserWindow);
  });
  browserWindow?.addEventListener('mousedown', () => bringWindowToFront(browserWindow));

  // ---- TWITTER LINKS ----
  const twitterLink        = document.getElementById('twitterLink');
  const welcomeTwitterLink = document.getElementById('welcomeTwitterLink');
  twitterLink?.addEventListener('click', (e) => { e.preventDefault(); window.open(TWITTER_URL,'_blank'); });
  welcomeTwitterLink?.addEventListener('click', (e) => { e.preventDefault(); window.open(TWITTER_URL,'_blank'); });

  // ---- COPY CA (welcome + browser) ----
  const welcomeCopyCA = document.getElementById('welcomeCopyCA');
  const browserCopyCA = document.getElementById('browserCopyCA');
  welcomeCopyCA?.addEventListener('click', () => copyContractAddress(welcomeCopyCA));
  browserCopyCA?.addEventListener('click', () => copyContractAddress(browserCopyCA));

  // ---- REWARDS ----
  const rewardsIcon = document.getElementById('rewardsIcon');
  rewardsIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    rewardsWindow.style.display = '';
    rewardsWindow.classList.remove('hidden','maximized');
    cascadeWindow(rewardsWindow);
    bringWindowToFront(rewardsWindow);
  });
  rewardsWindow?.addEventListener('mousedown', () => bringWindowToFront(rewardsWindow));

  // ---- MY COMPUTER ----
  const myComputerIcon = document.getElementById('myComputerIcon');
  myComputerIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    myComputerWindow.style.display = '';
    myComputerWindow.classList.remove('hidden','maximized');
    positionTopRight(myComputerWindow);
    bringWindowToFront(myComputerWindow);
  });
  myComputerWindow?.addEventListener('mousedown', () => bringWindowToFront(myComputerWindow));

  // ---- MAIL ----
  const mailIcon = document.getElementById('mailIcon');
  mailIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    mailWindow.style.display = '';
    mailWindow.classList.remove('hidden','maximized');
    positionBottomLeft(mailWindow);
    bringWindowToFront(mailWindow);
  });
  mailWindow?.addEventListener('mousedown', () => bringWindowToFront(mailWindow));

  // ---- START MENU ----
  const startButton = document.getElementById('startButton');
  const startMenu   = document.getElementById('startMenu');

  function openWindowFromSelector(sel) {
    const win = document.querySelector(sel);
    if (!win) return;
    win.style.display = '';
    win.classList.remove('hidden','maximized');
    if (sel === '.browser-window') win.classList.add('maximized');
    else if (sel === '.mycomputer-window') positionTopRight(win);
    else if (sel === '.mail-window') positionBottomLeft(win);
    else cascadeWindow(win);
    bringWindowToFront(win);
  }

  function toggleStartMenu(force) {
    const willOpen = (typeof force === 'boolean') ? force : startMenu.classList.contains('hidden');
    startMenu.classList.toggle('hidden', !willOpen);
    startMenu.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
  }

  if (startButton && startMenu) {
    startButton.addEventListener('click', (e) => {
      e.stopPropagation(); selectSound.play().catch(()=>{});
      toggleStartMenu();
    });
    document.addEventListener('click', (e) => {
      if (startMenu.classList.contains('hidden')) return;
      if (!startMenu.contains(e.target) && e.target !== startButton) toggleStartMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleStartMenu(false);
    });
    startMenu.addEventListener('click', (e) => {
      const li = e.target.closest('li'); if (!li) return;
      const action = li.getAttribute('data-action');
      const openSel= li.getAttribute('data-open');
      if (openSel) { openWindowFromSelector(openSel); toggleStartMenu(false); return; }
      switch (action) {
        case 'documents':
          openWindowFromSelector('.mycomputer-window'); toggleStartMenu(false); break;
        case 'mute-toggle':
          muteToggle?.click(); toggleStartMenu(false); break;
        case 'search':
          openWindowFromSelector('.mail-window'); toggleStartMenu(false); break;
        case 'help':
          alert('Help and Support is not implemented yet 🙂'); toggleStartMenu(false); break;
        case 'run':
          const cmd = prompt('Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.', 'browser');
          if (cmd) {
            const c = cmd.toLowerCase();
            if      (c.includes('browser')) openWindowFromSelector('.browser-window');
            else if (c.includes('mail'))    openWindowFromSelector('.mail-window');
            else if (c.includes('rewards')) openWindowFromSelector('.rewards-window');
            else if (c.includes('computer'))openWindowFromSelector('.mycomputer-window');
            else alert('Unknown command.');
          }
          toggleStartMenu(false); break;
        case 'logoff':
          backgroundMusic.pause();
          desktop.classList.add('hidden');
          loginScreen.classList.remove('hidden');
          passwordInput.value = ''; passwordInput.focus();
          toggleStartMenu(false); break;
        case 'shutdown':
          toggleStartMenu(false);
          powerIcon?.dispatchEvent(new MouseEvent('dblclick'));
          break;
      }
    });
  }

  // ---- DESKTOP BUDDY ----
  const helperIcon       = document.getElementById('helperIcon');
  const desktopBuddy     = document.getElementById('desktopBuddy');
  const buddyMascot      = document.getElementById('buddyMascot');
  const buddyClose       = document.getElementById('buddyClose');
  const botBubble        = document.getElementById('botBubble');
  const userBubble       = document.getElementById('userBubble');
  const botBubbleContent = document.getElementById('botBubbleContent');
  const userInput        = document.getElementById('userInput');
  const sendBtn          = document.getElementById('sendBtn');

  helperIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    desktopBuddy?.classList.remove('hidden');
    setTimeout(() => { showBotBubble("Hello! I'm Solana XP Bot! 👋 Click me to chat!"); }, 800);
  });

  buddyClose?.addEventListener('click', (e) => {
    e.stopPropagation(); closeSound.play().catch(()=>{});
    desktopBuddy?.classList.add('hidden');
    botBubble?.classList.add('hidden');
    userBubble?.classList.add('hidden');
  });

  // Buddy drag is handled separately in your main dragging logic (buddy has its own handlers below)
  let isBuddyDragging = false, buddyStartX, buddyStartY, buddyInitialX, buddyInitialY;
  desktopBuddy?.addEventListener('mousedown', (e) => {
    if (e.target.closest('.buddy-close') || e.target.closest('.speech-bubble') ||
        e.target.closest('.user-input')  || e.target.closest('.send-btn')) return;
    isBuddyDragging = true;
    const rect = desktopBuddy.getBoundingClientRect();
    buddyStartX = e.clientX; buddyStartY = e.clientY;
    buddyInitialX = rect.left; buddyInitialY = rect.top;
    desktopBuddy.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isBuddyDragging || !desktopBuddy) return;
    const dx = e.clientX - buddyStartX;
    const dy = e.clientY - buddyStartY;
    let nx = buddyInitialX + dx, ny = buddyInitialY + dy;
    const bw = desktopBuddy.offsetWidth, bh = desktopBuddy.offsetHeight;
    nx = Math.max(0, Math.min(nx, window.innerWidth - bw));
    ny = Math.max(0, Math.min(ny, window.innerHeight - 50 - bh));
    desktopBuddy.style.left = nx + 'px';
    desktopBuddy.style.top  = ny + 'px';
    desktopBuddy.style.bottom = 'auto';
    desktopBuddy.style.transform = 'none';
    desktopBuddy.style.marginLeft = '0';
  });
  document.addEventListener('mouseup', () => {
    if (isBuddyDragging && desktopBuddy) {
      isBuddyDragging = false;
      desktopBuddy.style.cursor = 'move';
    }
  });

  buddyMascot?.addEventListener('click', () => {
    selectSound.play().catch(()=>{});
    if (userBubble?.classList.contains('hidden')) {
      botBubble?.classList.add('hidden');
      userBubble?.classList.remove('hidden');
      userInput?.focus();
    } else {
      userBubble?.classList.add('hidden');
    }
  });

  const helperResponses = {
    'hello': 'Hello! 👋 Welcome to Solana XP! I\'m your Desktop Helper. How can I assist you today?',
    'petar': 'Petar! 👋 Al ga stara kurva napravi!',
    'hi': 'Hi there! 😊 I\'m Solana XP Bot, ready to help you navigate Solana XP. What would you like to know?',
    'hey': 'Hey! 🤖 Great to see you! I\'m here to help with any questions about Solana XP.',
    'good morning': 'Good morning! ☀️ Hope you\'re having a wonderful day! How can I help you with Solana XP?',
    'good afternoon': 'Good afternoon! 🌤️ I\'m here to assist you with Solana XP. What can I do for you?',
    'good evening': 'Good evening! 🌙 Ready to help you explore Solana XP. What\'s on your mind?',
    'greetings': 'Greetings! 🎉 I\'m your friendly Desktop Helper. Ask me anything about Solana XP!',
    'goodbye': 'Goodbye! 👋 Thanks for using Solana XP. Feel free to come back anytime you need assistance!',
    'bye': 'Bye! 😊 Have a great day! I\'ll be here whenever you need help with Solana XP.',
    'see you': 'See you later! 🌟 Thanks for chatting with me. Come back anytime!',
    'later': 'Catch you later! ✌️ Don\'t hesitate to reach out if you need help!',
    'farewell': 'Farewell! 🎊 It was a pleasure helping you today. Take care!',
    'good night': 'Good night! 🌙 Sweet dreams! I\'ll be here tomorrow if you need me.',
    'thank': 'You\'re very welcome! 😊 I\'m always happy to help. Is there anything else you\'d like to know?',
    'thanks': 'My pleasure! 🌟 Feel free to ask me anything else about Solana XP!',
    'please': 'Of course! I\'m here to help. What would you like to know about Solana XP?',
    'what is Solana XP': 'Solana XP is a retro-styled operating system interface that brings nostalgia and modern functionality together!',
    'how do i use': 'Double-click any desktop icon to open applications! Click the Power icon to shutdown.',
    'features': 'Solana XP includes: Solana XP Browser, My Computer, Mail, Desktop Helper, Recycle Bin, and a Power button with cool animations!',
    'who created': 'Solana XP was created as a nostalgic tribute to classic operating systems.',
    'help': 'Try asking: "What is Solana XP?", "How do I use this?", or say hi!',
    'how are you': 'I\'m doing fantastic! 🚀 Thanks for asking!',
    'awesome': 'That\'s awesome! 🎉',
    'cool': 'Right? Solana XP is pretty cool! 😎',
    'amazing': 'I know, right? Amazing! ⭐',
    'default': 'Interesting! Try asking about specific features or type "help" for suggestions!'
  };

  function showBotBubble(msg) {
    if (!botBubbleContent || !botBubble) return;
    botBubbleContent.textContent = msg;
    botBubble.classList.remove('hidden');
    setTimeout(() => botBubble.classList.add('hidden'), 5000);
  }

  function sendBuddyMessage() {
    if (!userInput || !userBubble) return;
    const msg = userInput.value.trim();
    if (!msg) return;
    const lower = msg.toLowerCase();
    userInput.value = '';
    userBubble.classList.add('hidden');
    let response = helperResponses['default'];
    for (const key in helperResponses) {
      if (lower.includes(key.toLowerCase())) { response = helperResponses[key]; break; }
    }
    setTimeout(() => showBotBubble(response), 600);
  }

  document.getElementById('sendBtn')?.addEventListener('click', sendBuddyMessage);
  userInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBuddyMessage(); });

  // ---- RECYCLE BIN ----
  const recycleBinIcon = document.getElementById('recycleBinIcon');
  recycleBinIcon?.addEventListener('dblclick', () => {
    selectSound.play().catch(()=>{});
    recycleBinWindow.style.display = '';
    recycleBinWindow.classList.remove('hidden');
    positionTopLeft(recycleBinWindow);
    bringWindowToFront(recycleBinWindow);
  });
  recycleBinWindow?.addEventListener('mousedown', () => bringWindowToFront(recycleBinWindow));

  // ---- POWER / SHUTDOWN ----
  const powerIcon       = document.getElementById('powerIcon');
  const shutdownOverlay = document.getElementById('shutdownOverlay');

  powerIcon?.addEventListener('dblclick', () => {
    backgroundMusic.pause();
    shutdownSound.play().catch(()=>{});

    // close windows
    browserWindow?.classList.add('hidden'); browserWindow?.classList.remove('maximized');
    myComputerWindow?.classList.add('hidden'); myComputerWindow?.classList.remove('maximized');
    mailWindow?.classList.add('hidden'); mailWindow?.classList.remove('maximized');
    desktopBuddy?.classList.add('hidden');
    recycleBinWindow?.classList.add('hidden'); recycleBinWindow?.classList.remove('maximized');
    rewardsWindow?.classList.add('hidden'); rewardsWindow?.classList.remove('maximized');
    buyWindow?.classList.add('hidden');
    if (welcomeWindow) welcomeWindow.style.display = 'none';

    // show overlay
    shutdownOverlay?.classList.remove('hidden');

    setTimeout(startReboot, 3000);
  });

  function startReboot() {
    startupSound.currentTime = 0;
    startupSound.play().catch(()=>{});
    const shutdownContent = shutdownOverlay.querySelector('.shutdown-content');
    if (shutdownContent) {
      shutdownContent.innerHTML = `
        <div class="boot-logo">Solana XP</div>
        <div class="boot-message">Booting up...</div>
        <div class="boot-progress"><div class="boot-progress-bar"></div></div>`;
    }
    setTimeout(() => {
      shutdownOverlay?.classList.add('hidden');
      desktop.classList.add('hidden');
      loginScreen.classList.remove('hidden');
      passwordInput.value = '';
      passwordInput.focus();
      backgroundMusic.currentTime = 0;
      backgroundMusic.play().catch(()=>{});
      if (shutdownContent) {
        shutdownContent.innerHTML = `
          <div class="shutdown-logo">Solana XP</div>
          <div class="shutdown-message">Shutting down...</div>
          <div class="shutdown-spinner"></div>`;
      }
    }, 2500);
  }

  // ---- WINDOW CONTROL BUTTONS ----
  // Welcome
  if (welcomeWindow) {
    welcomeWindow.querySelector('.window-btn.close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      welcomeWindow.style.display = 'none';
    });
    welcomeWindow.querySelector('.window-btn.minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); welcomeWindow.style.display = 'none';
    });
    welcomeWindow.querySelector('.window-btn.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); welcomeWindow.classList.toggle('maximized');
    });
  }

  // Browser
  if (browserWindow) {
    browserWindow.querySelector('.browser-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      browserWindow.classList.add('hidden'); browserWindow.style.display = 'none';
    });
    browserWindow.querySelector('.window-btn.minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); browserWindow.classList.add('hidden'); browserWindow.style.display = 'none';
    });
    browserWindow.querySelector('.window-btn.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); browserWindow.classList.toggle('maximized');
    });
  }

  // My Computer
  if (myComputerWindow) {
    myComputerWindow.querySelector('.mycomputer-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      myComputerWindow.classList.add('hidden'); myComputerWindow.style.display = 'none';
    });
    myComputerWindow.querySelector('.mycomputer-minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); myComputerWindow.classList.add('hidden'); myComputerWindow.style.display = 'none';
    });
    myComputerWindow.querySelector('.window-btn.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); myComputerWindow.classList.toggle('maximized');
    });
  }

  // Mail
  if (mailWindow) {
    mailWindow.querySelector('.mail-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      mailWindow.classList.add('hidden'); mailWindow.style.display = 'none';
    });
    mailWindow.querySelector('.mail-minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); mailWindow.classList.add('hidden'); mailWindow.style.display = 'none';
    });
    mailWindow.querySelector('.window-btn.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); mailWindow.classList.toggle('maximized');
    });
  }

  // Recycle Bin
  if (recycleBinWindow) {
    recycleBinWindow.querySelector('.recyclebin-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      recycleBinWindow.classList.add('hidden'); recycleBinWindow.style.display = 'none';
    });
    recycleBinWindow.querySelector('.recyclebin-minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); recycleBinWindow.classList.add('hidden'); recycleBinWindow.style.display = 'none';
    });
    recycleBinWindow.querySelector('.window-btn.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); recycleBinWindow.classList.toggle('maximized');
    });
  }

  // Rewards
  if (rewardsWindow) {
    rewardsWindow.querySelector('.rewards-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); closeSound.play().catch(()=>{});
      rewardsWindow.classList.add('hidden'); rewardsWindow.style.display = 'none';
    });
    rewardsWindow.querySelector('.rewards-minimize')?.addEventListener('click', (e) => {
      e.stopPropagation(); rewardsWindow.classList.add('hidden'); rewardsWindow.style.display = 'none';
    });
    rewardsWindow.querySelector('.window-btn.maximize')?.addEventListener('click', (e) => {
      e.stopPropagation(); rewardsWindow.classList.toggle('maximized');
    });
  }
});
// =================== /script.js ===================
