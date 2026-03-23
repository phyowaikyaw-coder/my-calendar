let currentMonth = 2; // March
let currentYear = 2026;

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Calendar ဆွဲရန် Function
function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const yearDisplay = document.getElementById('yearDisplay');
    const calendarGrid = document.getElementById('calendarGrid');

    monthDisplay.innerText = months[currentMonth];
    yearDisplay.innerText = currentYear;

    // အရင်ရက်စွဲများကို ဖျက်ထုတ်ပြီး ခေါင်းစဉ်များကို ပြန်ထည့်မည်
    const dayNames = `
        <div class="day-name sun">SUN</div>
        <div class="day-name">MON</div>
        <div class="day-name">TUE</div>
        <div class="day-name">WED</div>
        <div class="day-name">THUR</div>
        <div class="day-name">FRI</div>
        <div class="day-name sat">SAT</div>
    `;
    calendarGrid.innerHTML = dayNames;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // အလွတ်ကွက်များ
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }

    // ရက်စွဲများ
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = day;
        calendarGrid.appendChild(dayDiv);
    }
}

// ခလုတ်များ အလုပ်လုပ်ရန်
document.getElementById('prevMonth').onclick = () => { currentMonth--; checkDate(); };
document.getElementById('nextMonth').onclick = () => { currentMonth++; checkDate(); };
document.getElementById('prevYear').onclick = () => { currentYear--; checkDate(); };
document.getElementById('nextYear').onclick = () => { currentYear++; checkDate(); };

function checkDate() {
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
}

// Task သိမ်းရန်
function saveTask(id) {
    const value = document.getElementById(id).value;
    localStorage.setItem(id, value);
    alert("မှတ်သားပြီးပါပြီဗျာ!");
}

// Task ပြန်ဖော်ရန်
function loadTasks() {
    const ids = ['today1', 'today2', 'today3', 'tomorrow1', 'tomorrow2', 'tomorrow3', 'memory1', 'memory2', 'memory3'];
    ids.forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved) document.getElementById(id).value = saved;
    });
}

// App စတင်ခြင်း
window.onload = () => {
    renderCalendar();
    loadTasks();
};
