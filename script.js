const monthYearText = document.querySelector(".month-box span:nth-child(2)");
const yearText = document.querySelector(".year-box span:nth-child(2)");
const calendarGrid = document.querySelector(".calendar-grid");
const prevMonthBtn = document.querySelector(".month-box .btn-text:first-child");
const nextMonthBtn = document.querySelector(".month-box .btn-text:last-child");
const prevYearBtn = document.querySelector(".year-box .btn-text:first-child");
const nextYearBtn = document.querySelector(".year-box .btn-text:last-child");

let currentDate = new Date();

function renderCalendar() {
    // ရက်စွဲအဟောင်းတွေကို ဖျက်ထုတ်ပါ
    calendarGrid.querySelectorAll(".date-cell").forEach(cell => {
        if (!cell.classList.contains('day-name')) cell.remove();
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    
    monthYearText.innerText = monthNames[month];
    yearText.innerText = year;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // အလွတ်ကွက်များ (လအစရက် မတိုင်ခင်ကွက်လပ်များ)
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("date-cell", "empty");
        calendarGrid.appendChild(emptyDiv);
    }

    // ရက်စွဲများ ထည့်ခြင်း
    for (let i = 1; i <= lastDay; i++) {
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("date-cell");
        dateDiv.innerText = i;

        // ဒီနေ့ရက်စွဲကို Highlight ပြခြင်း
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dateDiv.classList.add("today");
        }

        // ရက်စွဲကို နှိပ်ရင် Border အရောင်ပြောင်းရန်
        dateDiv.addEventListener("click", () => {
            document.querySelectorAll(".date-cell").forEach(d => {
                d.style.border = "1px solid #f0f0f0";
            });
            dateDiv.style.border = "2px solid #E026FA";
        });

        calendarGrid.appendChild(dateDiv);
    }
}

// မြှားနှိပ်ရင် လပြောင်းရန်
prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// ရှေ့နှစ်သို့ ပြောင်းရန်
prevYearBtn.addEventListener("click", () => {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderCalendar();
});

// နောက်နှစ်သို့ ပြောင်းရန်
nextYearBtn.addEventListener("click", () => {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderCalendar();
});

// --- အသစ်ထပ်တိုးထားသော Task သိမ်းသည့်အပိုင်း ---

// OK ခလုတ်အားလုံး (Today, Tomorrow, Memory) ကို တစ်ပြိုင်နက် အလုပ်လုပ်အောင်လုပ်ခြင်း
document.querySelectorAll(".check-mark").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        // နှိပ်လိုက်တဲ့ ခလုတ်ရဲ့ ဘေးက input box ထဲက စာသားကို ယူခြင်း
        const input = e.target.parentElement.querySelector("input");
        
        if (input.value.trim() !== "") {
            alert("Saved: " + input.value);
            input.value = ""; // စာရိုက်ပြီးရင် အကွက်လေးကို ပြန်ရှင်းပေးပါမယ်
        } else {
            alert("Please write something first!");
        }
    });
});

// ပထမဆုံးအကြိမ် Calendar ကို စတင်ပြသရန်
renderCalendar();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}