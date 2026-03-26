// ၁။ အခြေခံ Variables များ
let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();
let viewedDate = new Date(); 

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// ၂။ ရက်စွဲ Key ထုတ်ယူသည့် Function (YYYY-MM-DD)
function getDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// ၃။ Calendar ဆွဲသည့် Function
function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const yearDisplay = document.getElementById('yearDisplay');
    const calendarGrid = document.getElementById('calendarGrid');

    if (!calendarGrid) return; // Grid မရှိရင် ရပ်မယ်

    monthDisplay.innerText = months[currentMonth];
    yearDisplay.innerText = currentYear;

    // အဟောင်းတွေကို ရှင်းမယ်
    calendarGrid.innerHTML = `
        <div class="day-name sun">SUN</div><div class="day-name">MON</div>
        <div class="day-name">TUE</div><div class="day-name">WED</div>
        <div class="day-name">THUR</div><div class="day-name">FRI</div>
        <div class="day-name sat">SAT</div>
    `;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    // အလွတ်ကွက်များ
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = "day";
        calendarGrid.appendChild(div);
    }

    // ရက်စွဲများ
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = "day";
        dayDiv.innerText = day;

        const checkKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        
        if (checkKey === todayKey) {
            dayDiv.classList.add('today-highlight');
        }

        dayDiv.onclick = () => {
            viewedDate = new Date(currentYear, currentMonth, day);
            // Highlight ပြောင်းမယ်
            document.querySelectorAll('.day').forEach(d => d.style.background = "transparent");
            dayDiv.style.background = "rgba(241, 196, 15, 0.3)";
            dayDiv.style.borderRadius = "50%";
            loadTasksByDate(viewedDate);
        };

        calendarGrid.appendChild(dayDiv);
    }
}

// ၄။ Task သိမ်းဆည်းရန်
function saveTask(id) {
    let targetDate = new Date(viewedDate);
    if (id.startsWith('tomorrow')) {
        targetDate.setDate(viewedDate.getDate() + 1);
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const value = document.getElementById(id).value;
    localStorage.setItem(`${dateKey}_${id}`, value);
    alert("Saved for " + dateKey);
}

// ၅။ Tomorrow -> Today ပြောင်းပေးသည့် Rolling System
function loadTasks() {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

    const nums = ['1', '2', '3'];
    nums.forEach(num => {
        const pending = localStorage.getItem(`${yesterdayKey}_tomorrow${num}`);
        if (pending) {
            localStorage.setItem(`${todayKey}_today${num}`, pending);
            localStorage.removeItem(`${yesterdayKey}_tomorrow${num}`);
        }
    });

    viewedDate = now;
    loadTasksByDate(now);
}

// ၆။ ရက်စွဲအလိုက် Task ပြန်ဖော်ရန်
function loadTasksByDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const tomDate = new Date(date);
    tomDate.setDate(date.getDate() + 1);
    const tomKey = `${tomDate.getFullYear()}-${String(tomDate.getMonth()+1).padStart(2,'0')}-${String(tomDate.getDate()).padStart(2,'0')}`;

    const todayLabel = document.getElementById('todayLabel');
    if (todayLabel) {
        const realToday = new Date();
        const realTodayKey = `${realToday.getFullYear()}-${String(realToday.getMonth()+1).padStart(2,'0')}-${String(realToday.getDate()).padStart(2,'0')}`;
        todayLabel.innerText = (dateKey === realTodayKey) ? "TODAY TASKS" : `${day} ${months[date.getMonth()]} TASKS`;
    }

    ['today', 'tomorrow', 'memory'].forEach(type => {
        ['1', '2', '3'].forEach(num => {
            const id = `${type}${num}`;
            const key = (type === 'tomorrow') ? tomKey : dateKey;
            const val = localStorage.getItem(`${key}_${id}`);
            if (document.getElementById(id)) {
                document.getElementById(id).value = val ? val : "";
            }
        });
    });
}

// ၇။ ခလုတ်များ
document.getElementById('prevMonth').onclick = () => { currentMonth--; checkDate(); };
document.getElementById('nextMonth').onclick = () => { currentMonth++; checkDate(); };
document.getElementById('prevYear').onclick = () => { currentYear--; checkDate(); };
document.getElementById('nextYear').onclick = () => { currentYear++; checkDate(); };

function checkDate() {
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
}

// ၈။ စတင်ခြင်း
window.onload = () => {
    renderCalendar();
    loadTasks();
};
