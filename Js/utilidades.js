document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar');
    const currentDateElem = document.getElementById('current-date');
    const eventModal = document.getElementById('event-modal');
    const closeModalButton = document.querySelector('.close-button');
    const eventForm = document.getElementById('event-form');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeSelect = document.getElementById('event-time');
    const eventDescriptionInput = document.getElementById('event-description');
    const eventParticipantsInput = document.getElementById('event-participants');
    const eventIdInput = document.getElementById('event-id');
    
    let currentView = 'monthly';
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let currentDay = new Date().getDate();
    let events = JSON.parse(localStorage.getItem('events')) || [];

    const renderTimeOptions = () => {
        eventTimeSelect.innerHTML = '';
        const times = [
            '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
            '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
            '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
        ];
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            eventTimeSelect.appendChild(option);
        });
    };

    const openEventModal = (date) => {
        eventDateInput.value = date;
        eventTimeSelect.value = '00:00';
        eventDescriptionInput.value = '';
        eventParticipantsInput.value = '';
        eventIdInput.value = '';
        eventModal.style.display = 'block';
    };

    const closeEventModal = () => {
        eventModal.style.display = 'none';
    };

    const saveEvent = (event) => {
        event.preventDefault();
        const id = eventIdInput.value || Date.now();
        const date = eventDateInput.value;
        const time = eventTimeSelect.value;
        const description = eventDescriptionInput.value;
        const participants = eventParticipantsInput.value;
        const eventData = { id, date, time, description, participants };
        const existingEventIndex = events.findIndex(e => e.id == id);

        if (existingEventIndex > -1) {
            events[existingEventIndex] = eventData;
        } else {
            events.push(eventData);
        }

        localStorage.setItem('events', JSON.stringify(events));
        closeEventModal();
        renderCalendar();
    };

    const renderCalendar = () => {
        calendarContainer.innerHTML = '';
        currentDateElem.textContent = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        if (currentView === 'monthly') {
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
            
            for (let i = firstDayOfMonth; i > 0; i--) {
                const dayElem = document.createElement('div');
                dayElem.classList.add('day', 'prev-month');
                dayElem.textContent = daysInPrevMonth - i + 1;
                calendarContainer.appendChild(dayElem);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const dayElem = document.createElement('div');
                dayElem.classList.add('day');
                dayElem.textContent = i;

                const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const dayEvents = events.filter(event => event.date === date);
                dayEvents.forEach(event => {
                    const eventElem = document.createElement('div');
                    eventElem.classList.add('event');
                    eventElem.textContent = `${event.time} - ${event.description}`;
                    dayElem.appendChild(eventElem);
                });

                dayElem.addEventListener('click', () => openEventModal(date));
                calendarContainer.appendChild(dayElem);
            }
        }
    };

    const changeMonth = (delta) => {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear += 1;
        }
        renderCalendar();
    };

    const changeYear = (delta) => {
        currentYear += delta;
        renderCalendar();
    };

    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
    document.getElementById('prev-year').addEventListener('click', () => changeYear(-1));
    document.getElementById('next-year').addEventListener('click', () => changeYear(1));
    document.getElementById('view-annual').addEventListener('click', () => { currentView = 'annual'; renderCalendar(); });
    document.getElementById('view-monthly').addEventListener('click', () => { currentView = 'monthly'; renderCalendar(); });
    document.getElementById('view-daily').addEventListener('click', () => { currentView = 'daily'; renderCalendar(); });
    closeModalButton.addEventListener('click', closeEventModal);
    eventForm.addEventListener('submit', saveEvent);

    renderTimeOptions();
    renderCalendar();
});
