// OK နှိပ်ရင် စာသားသိမ်းဖို့ Function
function saveTask(id) {
    const inputValue = document.getElementById(id).value;
    if (inputValue) {
        localStorage.setItem(id, inputValue);
        alert("မှတ်သားပြီးပါပြီ: " + inputValue);
    } else {
        alert("စာသားလေး အရင်ရိုက်ပေးပါဦးဗျာ။");
    }
}

// App ဖွင့်လိုက်တာနဲ့ သိမ်းထားတဲ့ စာသားတွေ ပြန်ဖော်ဖို့ Function
function loadTasks() {
    const inputIds = [
        'today1', 'today2', 'today3', 
        'tomorrow1', 'tomorrow2', 'tomorrow3', 
        'memory1', 'memory2', 'memory3'
    ];
    
    inputIds.forEach(id => {
        const savedData = localStorage.getItem(id);
        if (savedData) {
            document.getElementById(id).value = savedData;
        }
    });
}

// Page load ဖြစ်တာနဲ့ loadTasks ကို အလုပ်လုပ်ခိုင်းမယ်
window.onload = loadTasks;

// Service Worker (PWA အတွက်)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
