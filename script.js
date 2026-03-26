let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();
let viewedDate = new Date(); 

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// အချိန်ဒေသ Error ကင်းအောင် ရက်စွဲထုတ်မည့် Function (YYYY-MM-DD)
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
            document.querySelectorAll('.day').forEach(d => d.style.background = "transparent");
            dayDiv.style.background = "rgba(241, 196, 15, 0.3)";
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
    
    // မနေ့ကရက်စွဲကို ရှာမယ်
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

    if (dateKey === realTodayKey) {
        todayLabel.innerText = "TODAY TASKS";
        tomorrowLabel.innerText = "TOMORROW TASKS";
    } else {
        todayLabel.innerText = `${date.getDate()} ${months[date.getMonth()]} TASKS`;
        tomorrowLabel.innerText = `NEXT DAY TASKS`;
    }

    const taskTypes = ['today', 'tomorrow', 'memory'];
    const nums = ['1', '2', '3'];

    taskTypes.forEach(type => {
        nums.forEach(num => {
            const id = `${type}${num}`;
            const currentKey = (type === 'tomorrow') ? tomorrowKey : dateKey;
            const saved = localStorage.getItem(`${currentKey}_${id}`);
            document.getElementById(id).value = saved ? saved : "";
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
