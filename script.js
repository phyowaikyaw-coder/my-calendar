// လက်ရှိ ပြသနေသော လ နှင့် နှစ်
let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// ရက်စွဲအလိုက် Key ထုတ်ရန် (ဥပမာ: 2026-03-26)
function getDateKey(date) {
    return date.toISOString().split('T')[0];
}

// Calendar ဆွဲရန် Function
function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const yearDisplay = document.getElementById('yearDisplay');
    const calendarGrid = document.getElementById('calendarGrid');

    monthDisplay.innerText = months[currentMonth];
    yearDisplay.innerText = currentYear;

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

        // ရက်စွဲကို နှိပ်လိုက်ရင် အဲ့ဒီနေ့က Task တွေကို ပြန်ပြရန်
        dayDiv.onclick = () => {
            const clickedDate = new Date(currentYear, currentMonth, day);
            loadTasksByDate(clickedDate);
            // Alert လေးနဲ့ ဘယ်နေ့ကို ကြည့်နေလဲဆိုတာ ပြပေးမယ်
            console.log("Viewing history for: " + getDateKey(clickedDate));
        };

        calendarGrid.appendChild(dayDiv);
    }
}

// Task သိမ်းရန် (ရက်စွဲနဲ့တွဲပြီး သိမ်းသွားမည်)
function saveTask(id) {
    const value = document.getElementById(id).value;
    const now = new Date();
    let targetDate = new Date();

    // Tomorrow IDs ဖြစ်ရင် မနက်ဖြန်ရက်စွဲနဲ့ သိမ်းမယ်
    if (id.startsWith('tomorrow')) {
        targetDate.setDate(now.getDate() + 1);
    }

    const dateKey = getDateKey(targetDate);
    localStorage.setItem(`${dateKey}_${id}`, value);
    alert("မှတ်သားပြီးပါပြီဗျာ!");
}

// Task များအားလုံးကို စနစ်တကျ ပြန်ဖော်ရန် (Rolling System ပါဝင်သည်)
function loadTasks() {
    const now = new Date();
    const todayKey = getDateKey(now);
    
    // ၁။ မနေ့က Tomorrow Task ကို ဒီနေ့ Today ထဲ ရွှေ့ပေးခြင်း
    const ids = ['1', '2', '3']; // index များ
    ids.forEach(num => {
        const yesterdayTomorrowData = localStorage.getItem(`${todayKey}_tomorrow${num}`);
        
        if (yesterdayTomorrowData) {
            // မနေ့က Tomorrow ကို ဒီနေ့ Today ထဲ ထည့်မယ်
            localStorage.setItem(`${todayKey}_today${num}`, yesterdayTomorrowData);
            // ရွှေ့ပြီးရင် မနေ့က Tomorrow Key ကို ဖျက်ပစ်မယ်
            localStorage.removeItem(`${todayKey}_tomorrow${num}`);
        }
    });

    // ၂။ လက်ရှိ ဒီနေ့ နဲ့ မနက်ဖြန် Task တွေကို UI မှာ ပြမယ်
    loadTasksByDate(now);
}

// သတ်မှတ်ထားသော ရက်စွဲအလိုက် Task များကို Input Box များတွင် ပြပေးရန်
function loadTasksByDate(date) {
    const dateKey = getDateKey(date);
    
    // မနက်ဖြန် ရက်စွဲကို တွက်မယ်
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    const tomorrowKey = getDateKey(tomorrow);

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

// App စတင်ခြင်း
window.onload = () => {
    renderCalendar();
    loadTasks(); // ဂိမ်းစတာနဲ့ Task တွေ ရွှေ့/ပြ လုပ်မယ်
};
