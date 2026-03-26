let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();
let viewedDate = new Date(); 

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// ၁။ ရက်စွဲ Key ထုတ်ယူခြင်း (YYYY-MM-DD)
function getDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ၂။ Calendar ဆွဲခြင်း
function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const yearDisplay = document.getElementById('yearDisplay');
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return; 

    monthDisplay.innerText = months[currentMonth];
    yearDisplay.innerText = currentYear;

    calendarGrid.innerHTML = `
        <div class="day-name sun">SUN</div><div class="day-name">MON</div>
        <div class="day-name">TUE</div><div class="day-name">WED</div>
        <div class="day-name">THUR</div><div class="day-name">FRI</div>
        <div class="day-name sat">SAT</div>
    `;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const todayKey = getDateKey(new Date());

    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = "day";
        calendarGrid.appendChild(div);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = "day";
        dayDiv.innerText = day;

        const checkDate = new Date(currentYear, currentMonth, day);
        const checkKey = getDateKey(checkDate);
        
        if (checkKey === todayKey) {
            dayDiv.classList.add('today-highlight');
        }

        dayDiv.onclick = () => {
            viewedDate = new Date(currentYear, currentMonth, day);
            document.querySelectorAll('.day').forEach(d => {
                d.style.background = "transparent";
                d.style.borderRadius = "0";
            });
            dayDiv.style.background = "rgba(241, 196, 15, 0.3)";
            dayDiv.style.borderRadius = "50%";
            loadTasksByDate(viewedDate);
        };
        calendarGrid.appendChild(dayDiv);
    }
}

// ၃။ Task သိမ်းဆည်းရန် (Memory အတွက် Fixed Key သုံးထားသည်)
function saveTask(id) {
    let targetDate = new Date(viewedDate);
    let finalKey = "";

    if (id.startsWith('memory')) {
        // Memory ဆိုရင် ရက်စွဲနဲ့ မချိတ်ဘဲ ပုံသေ Key တစ်ခုတည်းနဲ့ သိမ်းမည်
        finalKey = `fixed_${id}`;
    } else {
        // Today နဲ့ Tomorrow အတွက်ကတော့ အရင်အတိုင်း ရက်စွဲနဲ့ ခွဲသိမ်းမည်
        let storageId = id;
        if (id.startsWith('tomorrow')) {
            targetDate.setDate(viewedDate.getDate() + 1);
            storageId = id.replace('tomorrow', 'today');
        }
        const dateKey = getDateKey(targetDate);
        finalKey = `${dateKey}_${storageId}`;
    }

    const value = document.getElementById(id).value;
    localStorage.setItem(finalKey, value);
    alert("Saved success!");
}

// ၄။ အချက်အလက်များကို ပြန်ဖော်ရန်
function loadTasksByDate(date) {
    const dateKey = getDateKey(date);
    const todayLabel = document.getElementById('todayLabel');
    const realTodayKey = getDateKey(new Date());

    // Label Update
    if (todayLabel) {
        todayLabel.innerText = (dateKey === realTodayKey) ? "TODAY TASKS" : `${date.getDate()} ${months[date.getMonth()]} TASKS`;
    }

    const tomDate = new Date(date);
    tomDate.setDate(date.getDate() + 1);
    const tomKey = getDateKey(tomDate);

    // Today & Tomorrow Tasks ပြန်ဖော်ခြင်း
    for (let i = 1; i <= 3; i++) {
        const todayVal = localStorage.getItem(`${dateKey}_today${i}`);
        const tomorrowVal = localStorage.getItem(`${tomKey}_today${i}`);
        
        if (document.getElementById(`today${i}`)) document.getElementById(`today${i}`).value = todayVal || "";
        if (document.getElementById(`tomorrow${i}`)) document.getElementById(`tomorrow${i}`).value = tomorrowVal || "";
    }

    // Memory ပြန်ဖော်ခြင်း (ဘယ်နေ့သွားသွား ပုံသေပေါ်နေမည်)
    for (let i = 1; i <= 3; i++) {
        const memoryVal = localStorage.getItem(`fixed_memory${i}`);
        if (document.getElementById(`memory${i}`)) {
            document.getElementById(`memory${i}`).value = memoryVal || "";
        }
    }
}

// ခလုတ်များ
document.getElementById('prevMonth').onclick = () => { currentMonth--; checkDate(); };
document.getElementById('nextMonth').onclick = () => { currentMonth++; checkDate(); };
document.getElementById('prevYear').onclick = () => { currentYear--; checkDate(); };
document.getElementById('nextYear').onclick = () => { currentYear++; checkDate(); };

function checkDate() {
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
}

// ၅။ Dark Mode / Light Mode Logic
function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.innerText = currentTheme === 'dark' ? "☀️ Light Mode" : "🌙 Dark Mode";

    themeBtn.onclick = () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.innerText = "☀️ Light Mode";
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeBtn.innerText = "🌙 Dark Mode";
        }
    };
}

window.onload = () => {
    renderCalendar();
    loadTasksByDate(new Date()); 
    initTheme(); 
};
