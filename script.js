let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();
let viewedDate = new Date(); // လက်ရှိ ကြည့်ရှုနေသော ရက်စွဲ

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// ရက်စွဲကို ISO String (YYYY-MM-DD) ပြောင်းရန် (Timezone Error မတက်အောင်)
function getDateKey(date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
}

// Calendar ဆွဲရန်
function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const yearDisplay = document.getElementById('yearDisplay');
    const calendarGrid = document.getElementById('calendarGrid');

    monthDisplay.innerText = months[currentMonth];
    yearDisplay.innerText = currentYear;

    const dayNames = `
        <div class="day-name sun">SUN</div><div class="day-name">MON</div>
        <div class="day-name">TUE</div><div class="day-name">WED</div>
        <div class="day-name">THUR</div><div class="day-name">FRI</div>
        <div class="day-name sat">SAT</div>
    `;
    calendarGrid.innerHTML = dayNames;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day');
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = day;
        dayDiv.style.cursor = "pointer";

        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayDiv.classList.add('today-highlight');
        }

        dayDiv.onclick = () => {
            viewedDate = new Date(currentYear, currentMonth, day);
            
            // UI Selection Highlight
            document.querySelectorAll('.day').forEach(d => {
                d.style.background = "transparent";
                d.style.border = "none";
            });
            dayDiv.style.background = "rgba(241, 196, 15, 0.3)";
            dayDiv.style.borderRadius = "50%";
            
            loadTasksByDate(viewedDate);
        };

        calendarGrid.appendChild(dayDiv);
    }
}

// Task သိမ်းဆည်းရန်
function saveTask(id) {
    let targetDate = new Date(viewedDate);
    // Tomorrow Task ဆိုရင် ကြည့်နေတဲ့ရက်ရဲ့ နောက်တစ်ရက်မှာ သွားသိမ်းမယ်
    if (id.startsWith('tomorrow')) {
        targetDate.setDate(viewedDate.getDate() + 1);
    }

    const dateKey = getDateKey(targetDate);
    const value = document.getElementById(id).value;
    localStorage.setItem(`${dateKey}_${id}`, value);
    alert("Saved: " + dateKey);
}

// မနေ့က Tomorrow ကို ဒီနေ့ Today သို့ ရွှေ့ပေးမည့် Rolling Logic
function loadTasks() {
    const now = new Date();
    const todayKey = getDateKey(now);
    
    // မနေ့က ရက်စွဲကို တွက်မယ်
    const yesterday
