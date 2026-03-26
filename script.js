let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();
let viewedDate = new Date(); 

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Local Date Key (YYYY-MM-DD) ထုတ်ရန်
function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const yearDisplay = document.getElementById('yearDisplay');
    const calendarGrid = document.getElementById('calendarGrid');

    // Element တွေ ရှိမရှိ အရင်စစ်မယ် (Error ကာကွယ်ရန်)
    if (!monthDisplay || !yearDisplay || !calendarGrid) return;

    monthDisplay.innerText = months[currentMonth];
    yearDisplay.innerText = currentYear;

    // Grid ကို အရင် ရှင်းထုတ်မယ်
    calendarGrid.innerHTML = "";

    // ရက်သတ္တပတ် ခေါင်းစဉ်များ ထည့်မယ်
    const days = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    days.forEach(dayName => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day-name');
        if (dayName === "SUN") dayHeader.classList.add('sun');
        if (dayName === "SAT") dayHeader.classList.add('sat');
        dayHeader.innerText = dayName;
        calendarGrid.appendChild(dayHeader);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const realTodayKey = getDateKey(today);

    // အလွတ်ကွက်များ
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day');
        calendarGrid.appendChild(emptyDiv);
    }

    // ရက်စွဲများ
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = day;
        dayDiv.style.cursor = "pointer";

        const thisDate = new Date(currentYear, currentMonth, day);
        const thisDateKey = getDateKey(thisDate);

        // ဒီနေ့ရက်ကို Highlight လုပ်မယ်
        if (thisDateKey === realTodayKey) {
            dayDiv.classList.add('today-highlight');
        }

        dayDiv.onclick = () => {
            viewedDate = new Date(currentYear, currentMonth, day);
            
            // Selection Style ပြောင်းခြင်း
            document.querySelectorAll('.day').forEach(d => {
                d.style.background = "transparent";
                d.style.borderRadius = "0";
            });
            dayDiv.style.background = "rgba(241, 196, 15, 0.4)";
            dayDiv.style.borderRadius = "50%";
            
            loadTasksByDate(viewedDate);
        };

        calendarGrid.appendChild(dayDiv);
    }
}

function saveTask(id) {
    let targetDate = new Date(viewedDate);
    if (id.startsWith('tomorrow')) {
        targetDate.setDate(viewedDate.getDate() + 1);
    }

    const dateKey = getDateKey(targetDate);
    const value = document.getElementById(id).value;
    localStorage.setItem(`${dateKey}_${id}`, value);
    alert("Saved: " + dateKey);
}

function loadTasks() {
    const now = new Date();
    const todayKey = getDateKey(now);
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = getDateKey(yesterday);

    const nums = ['1', '2', '3'];
    nums.forEach(num => {
        const pendingTask = localStorage.getItem(`${yesterdayKey}_tomorrow${num}`);
        if (pendingTask) {
            localStorage.setItem(`${todayKey}_today${num}`, pendingTask);
            localStorage.removeItem(`${yesterdayKey}_tomorrow${num}`);
        }
    });

    viewedDate = now;
    loadTasksByDate(now);
}

function loadTasksByDate(date) {
    const dateKey = getDateKey(date);
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    const tomorrowKey = getDateKey(tomorrow);

    const todayLabel = document.getElementById('todayLabel');
    const tomorrowLabel = document.getElementById('tomorrowLabel');
    const realTodayKey = getDateKey(new Date());

    if (todayLabel) {
        todayLabel.innerText = (dateKey === realTodayKey) ? "TODAY TASKS" : `${date.getDate()} ${months[date.getMonth()]} TASKS`;
    }
    if (tomorrowLabel) {
        tomorrowLabel.innerText = (dateKey === realTodayKey) ? "TOMORROW TASKS" : "NEXT DAY TASKS";
    }

    const taskTypes = ['today', 'tomorrow', 'memory'];
    const nums = ['1', '2', '3'];

    taskTypes.forEach(type => {
        nums.forEach(num => {
            const id = `${type}${num}`;
            const inputField = document.getElementById(id);
            if (inputField) {
                const currentKey = (type === 'tomorrow') ? tomorrowKey : dateKey;
                const saved = localStorage.getItem(`${currentKey}_${id}`);
                inputField.value = saved ? saved : "";
            }
        });
    });
}

document.getElementById('prevMonth').onclick = () => { currentMonth--; checkDate(); };
document.getElementById('nextMonth').onclick = () => { currentMonth++; checkDate(); };
document.getElementById('prevYear').onclick = () => { currentYear--; checkDate(); };
document.getElementById('nextYear').onclick = () => { currentYear++; checkDate(); };

function checkDate() {
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
}

window.onload = () => {
    renderCalendar();
    loadTasks();
};
