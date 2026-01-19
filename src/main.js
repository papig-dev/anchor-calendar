// Anchor Calendar – Monthly/Yearly View with local holidays
// No network, no sync, read-only

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-11
let today = new Date();
today.setHours(0, 0, 0, 0);
let holidays = {};
let selectedHolidayKey = null;

// Load holidays.json
async function loadHolidays() {
  try {
    const resp = await fetch('./holidays.json');
    if (resp.ok) {
      holidays = await resp.json();
    }
  } catch (e) {
    console.warn('Failed to load holidays.json', e);
  }
}

// Save holidays to file (simplified - just update in memory and reload)
async function saveHolidays() {
  // For now, just reload the calendar
  // In production, you'd use Tauri's file system API
  renderMonthlyView();
}

// Format YYYY.MM
function formatYearMonth(y, m) {
  return `${y}.${String(m + 1).padStart(2, '0')}`;
}

// Render monthly view (6x7 grid)
function renderMonthlyView() {
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const prevLastDay = new Date(currentYear, currentMonth, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay()); // align to Sunday

  // Helper to get YYYY-MM-DD in KST (UTC+9)
  function toKSTString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const cell = document.createElement('div');
    cell.className = 'calendar-cell';

    const dateNum = document.createElement('span');
    dateNum.className = 'date';
    dateNum.textContent = cellDate.getDate();

    cell.appendChild(dateNum);

    // Determine classes
    const isCurrentMonth = cellDate.getMonth() === currentMonth;
    const isToday = cellDate.getTime() === today.getTime();
    const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
    const dateKey = toKSTString(cellDate); // KST-based key
    const isHoliday = holidays[dateKey];

    if (!isCurrentMonth) cell.classList.add('other-month');
    if (isToday) cell.classList.add('today');
    if (isWeekend) cell.classList.add('weekend');
    if (isHoliday) cell.classList.add('holiday');

    // Show holiday name below date if current month
    if (isHoliday && isCurrentMonth) {
      const holidayLabel = document.createElement('div');
      holidayLabel.className = 'holiday-label';
      holidayLabel.textContent = holidays[dateKey];
      cell.appendChild(holidayLabel);
    }

    // Optional: click to jump to that month (if other month)
    cell.addEventListener('click', () => {
      if (cellDate.getMonth() !== currentMonth || cellDate.getFullYear() !== currentYear) {
        currentYear = cellDate.getFullYear();
        currentMonth = cellDate.getMonth();
        renderMonthlyView();
        updateMonthLabel();
      }
    });

    grid.appendChild(cell);
  }
}

// Update month label
function updateMonthLabel() {
  document.getElementById('current-month').textContent = formatYearMonth(currentYear, currentMonth);
}

// Render yearly view (12 mini months)
function renderYearlyView() {
  const grid = document.getElementById('year-grid');
  grid.innerHTML = '';

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  for (let m = 0; m < 12; m++) {
    const mini = document.createElement('div');
    mini.className = 'mini-month';

    const title = document.createElement('div');
    title.className = 'mini-month-title';
    title.textContent = monthNames[m];
    mini.appendChild(title);

    const miniGrid = document.createElement('div');
    miniGrid.className = 'mini-grid';

    // Mini weekday headers (optional)
    // for simplicity, skip headers

    const firstDay = new Date(currentYear, m, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);

      const cell = document.createElement('div');
      cell.className = 'mini-cell';

      const isCurrentMonth = cellDate.getMonth() === m;
      const isToday = cellDate.getTime() === today.getTime();
      const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;

      if (!isCurrentMonth) cell.classList.add('other-month');
      if (isToday) cell.classList.add('today');
      if (isWeekend) cell.classList.add('weekend');

      cell.textContent = isCurrentMonth ? cellDate.getDate() : '';

      miniGrid.appendChild(cell);
    }

    mini.appendChild(miniGrid);
    mini.addEventListener('click', () => {
      currentMonth = m;
      switchToMonthlyView();
    });

    grid.appendChild(mini);
  }
}

// Update year label
function updateYearLabel() {
  document.getElementById('current-year').textContent = currentYear;
}

// Switch views
function switchToMonthlyView() {
  document.getElementById('monthly-view').classList.remove('hidden');
  document.getElementById('yearly-view').classList.add('hidden');
  document.getElementById('btn-monthly').classList.add('active');
  document.getElementById('btn-yearly').classList.remove('active');
  document.getElementById('btn-monthly-y').classList.add('active');
  document.getElementById('btn-yearly-y').classList.remove('active');
  renderMonthlyView();
  updateMonthLabel();
}

function switchToYearlyView() {
  document.getElementById('monthly-view').classList.add('hidden');
  document.getElementById('yearly-view').classList.remove('hidden');
  document.getElementById('btn-monthly').classList.remove('active');
  document.getElementById('btn-yearly').classList.add('active');
  document.getElementById('btn-monthly-y').classList.remove('active');
  document.getElementById('btn-yearly-y').classList.add('active');
  renderYearlyView();
  updateYearLabel();
}

// Modal functions
function openHolidayModal() {
  document.getElementById('holiday-modal').classList.remove('hidden');
  renderHolidayList();
}

function closeHolidayModal() {
  document.getElementById('holiday-modal').classList.add('hidden');
  selectedHolidayKey = null;
  document.getElementById('holiday-date').value = '';
  document.getElementById('holiday-name').value = '';
}

function renderHolidayList() {
  const list = document.getElementById('holiday-list-items');
  list.innerHTML = '';
  const sortedKeys = Object.keys(holidays).sort();
  sortedKeys.forEach(key => {
    const li = document.createElement('li');
    li.textContent = `${key}: ${holidays[key]}`;
    li.dataset.key = key;
    if (key === selectedHolidayKey) li.classList.add('selected');
    li.addEventListener('click', () => {
      selectedHolidayKey = key;
      document.getElementById('holiday-date').value = key;
      document.getElementById('holiday-name').value = holidays[key];
      renderHolidayList();
    });
    list.appendChild(li);
  });
}

async function addHoliday() {
  const date = document.getElementById('holiday-date').value;
  const name = document.getElementById('holiday-name').value.trim();
  if (!date || !name) return;
  holidays[date] = name;
  await saveHolidays();
  renderMonthlyView();
  renderHolidayList();
  // Clear inputs
  document.getElementById('holiday-date').value = '';
  document.getElementById('holiday-name').value = '';
}

async function updateHoliday() {
  if (!selectedHolidayKey) return;
  const date = document.getElementById('holiday-date').value;
  const name = document.getElementById('holiday-name').value.trim();
  if (!date || !name) return;
  if (date !== selectedHolidayKey) {
    delete holidays[selectedHolidayKey];
  }
  holidays[date] = name;
  await saveHolidays();
  renderMonthlyView();
  renderHolidayList();
  selectedHolidayKey = date;
}

async function deleteHoliday() {
  if (!selectedHolidayKey) return;
  delete holidays[selectedHolidayKey];
  await saveHolidays();
  renderMonthlyView();
  renderHolidayList();
  selectedHolidayKey = null;
  document.getElementById('holiday-date').value = '';
  document.getElementById('holiday-name').value = '';
}

// Navigation handlers
document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderMonthlyView();
  updateMonthLabel();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderMonthlyView();
  updateMonthLabel();
});

document.getElementById('prev-year').addEventListener('click', () => {
  currentYear--;
  renderYearlyView();
  updateYearLabel();
});

document.getElementById('next-year').addEventListener('click', () => {
  currentYear++;
  renderYearlyView();
  updateYearLabel();
});

document.getElementById('btn-monthly').addEventListener('click', () => {
  // Reset to today's month
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();
  switchToMonthlyView();
});

document.getElementById('btn-yearly').addEventListener('click', switchToYearlyView);
document.getElementById('btn-monthly-y').addEventListener('click', () => {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();
  switchToMonthlyView();
});
document.getElementById('btn-yearly-y').addEventListener('click', switchToYearlyView);

// Holiday modal buttons
document.getElementById('btn-edit-holidays').addEventListener('click', openHolidayModal);
document.getElementById('btn-edit-holidays-y').addEventListener('click', openHolidayModal);
document.getElementById('close-modal').addEventListener('click', closeHolidayModal);
document.getElementById('add-holiday').addEventListener('click', addHoliday);
document.getElementById('update-holiday').addEventListener('click', updateHoliday);
document.getElementById('delete-holiday').addEventListener('click', deleteHoliday);

// Init
window.addEventListener('DOMContentLoaded', async () => {
  await loadHolidays();
  switchToMonthlyView(); // Always start in Monthly View
});
