        const statusInputs = document.querySelectorAll('input[name="status"]');
        const periodDateLabel = document.getElementById('periodDateLabel');
        const onboardingModal = document.getElementById('onboardingModal');
        const steps = document.querySelectorAll('.step-content');
        const stepDots = document.querySelectorAll('.step-dot');
        const nextStepButton = document.getElementById('nextStepButton');
        const calendarGrid = document.getElementById('calendarGrid');
        const flowTable = document.getElementById('flowTable');
        const periodDurationValue = document.getElementById('periodDurationValue');
        const storageKey = 'flowTrackSetupV2';
        const dailyLogStorageKey = 'flowTrackDailyLogV1';
        const dailyLogForm = document.querySelector('.log-form');
        let currentStep = 0;

        function renderFlowTable() {
            const duration = Number(document.getElementById('periodDuration').value);
            flowTable.innerHTML = `
                <div class="flow-row flow-header"><span>Day</span><span>Light</span><span>Medium</span><span>Heavy</span></div>
                ${Array.from({ length: duration }, (_, index) => `
                    <div class="flow-row">
                        <strong>Day ${String(index + 1).padStart(2, '0')}</strong>
                        ${['Light', 'Medium', 'Heavy'].map((level) => `
                            <label class="flow-choice">
                                <input type="radio" name="flow-day-${index + 1}" value="${level}" ${index === 0 && level === 'Medium' ? 'checked' : ''}>
                                <span></span>
                            </label>
                        `).join('')}
                    </div>
                `).join('')}
            `;
        }

        function updatePeriodDuration() {
            const durationInput = document.getElementById('periodDuration');
            const nextDuration = Math.min(10, Math.max(2, Number(durationInput.value)));
            durationInput.value = nextDuration;
            periodDurationValue.textContent = `${nextDuration} Day${nextDuration === 1 ? '' : 's'}`;
            renderFlowTable();
        }

        document.querySelectorAll('.stepper-button').forEach((button) => {
            button.addEventListener('click', () => {
                const durationInput = document.getElementById('periodDuration');
                durationInput.value = Number(durationInput.value) + Number(button.dataset.step);
                updatePeriodDuration();
            });
        });

        document.getElementById('periodDuration').addEventListener('change', updatePeriodDuration);
        renderFlowTable();

        function getSetupDetails() {
            return {
                age: document.getElementById('age').value,
                status: document.querySelector('input[name="status"]:checked').value,
                startDate: document.getElementById('lastPeriodDate').value,
                periodDuration: document.getElementById('periodDuration').value,
                cycleLength: document.getElementById('cycleLength').value,
                goal: document.getElementById('primaryGoal').value,
                symptoms: Array.from(document.querySelectorAll('#step4 .checkbox-tags input:checked'))
                    .map((input) => input.value),
                flow: Array.from({ length: Number(document.getElementById('periodDuration').value) }, (_, index) => {
                    const selected = document.querySelector(`input[name="flow-day-${index + 1}"]:checked`);
                    return selected ? selected.value : '';
                })
            };
        }

        function saveSetupDetails() {
            localStorage.setItem(storageKey, JSON.stringify(getSetupDetails()));
        }

        function restoreSetupDetails() {
            const savedDetails = localStorage.getItem(storageKey);
            if (!savedDetails) {
                return false;
            }

            try {
                const details = JSON.parse(savedDetails);
                document.getElementById('age').value = details.age || '';
                const statusInput = document.querySelector(`input[name="status"][value="${details.status}"]`);
                if (statusInput) {
                    statusInput.checked = true;
                }
                document.getElementById('lastPeriodDate').value = details.startDate;
                document.getElementById('periodDuration').value = details.periodDuration;
                document.getElementById('cycleLength').value = details.cycleLength;
                document.getElementById('primaryGoal').value = details.goal;
                document.querySelectorAll('#step4 .checkbox-tags input').forEach((input) => {
                    input.checked = Array.isArray(details.symptoms) && details.symptoms.includes(input.value);
                });
                updatePeriodDuration();
                if (Array.isArray(details.flow)) {
                    details.flow.forEach((level, index) => {
                        const flowInput = document.querySelector(`input[name="flow-day-${index + 1}"][value="${level}"]`);
                        if (flowInput) {
                            flowInput.checked = true;
                        }
                    });
                }
                periodDateLabel.textContent = details.status === 'active'
                    ? 'When did it start?'
                    : 'When did your last period start?';
                return true;
            } catch (error) {
                console.error('Unable to restore saved FlowTrack details.', error);
                localStorage.removeItem(storageKey);
                return false;
            }
        }

        statusInputs.forEach((statusInput) => {
            statusInput.addEventListener('change', () => {
                periodDateLabel.textContent = statusInput.value === 'active'
                    ? 'When did it start?'
                    : 'When did your last period start?';
            });
        });

        function parseDate(value) {
            const [year, month, day] = value.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        function addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        function formatDate(date) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }

        function formatMonth(date) {
            return date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }

        function getTodayKey() {
            const today = new Date();
            return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }

        function getDailyLogDetails() {
            return {
                date: getTodayKey(),
                flow: document.querySelector('input[name="flow"]:checked').value,
                symptoms: Array.from(document.querySelectorAll('#log .checkbox-grid input:checked'))
                    .map((input) => input.value)
            };
        }

        function saveDailyLog() {
            localStorage.setItem(dailyLogStorageKey, JSON.stringify(getDailyLogDetails()));
        }

        function restoreDailyLog() {
            const savedLog = localStorage.getItem(dailyLogStorageKey);
            if (!savedLog) {
                return;
            }

            try {
                const details = JSON.parse(savedLog);
                if (details.date !== getTodayKey()) {
                    return;
                }
                const flowInput = document.querySelector(`input[name="flow"][value="${details.flow}"]`);
                if (flowInput) {
                    flowInput.checked = true;
                }
                document.querySelectorAll('#log .checkbox-grid input').forEach((input) => {
                    input.checked = Array.isArray(details.symptoms) && details.symptoms.includes(input.value);
                });
            } catch (error) {
                console.error('Unable to restore today\'s FlowTrack log.', error);
                localStorage.removeItem(dailyLogStorageKey);
            }
        }

        function isBetween(date, start, end) {
            return date >= start && date <= end;
        }

        function renderCalendar(startDate, periodDuration, cycleLength, nextPeriodStart) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const visibleStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const visibleEnd = new Date(today.getFullYear(), today.getMonth() + 3, 0);
            const periodStarts = [];
            let periodStart = new Date(startDate);

            while (periodStart > visibleStart) {
                periodStart = addDays(periodStart, -cycleLength);
            }
            while (periodStart <= visibleEnd) {
                periodStarts.push(new Date(periodStart));
                periodStart = addDays(periodStart, cycleLength);
            }

            calendarGrid.innerHTML = '';

            for (let monthOffset = -1; monthOffset <= 2; monthOffset += 1) {
                const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
                const monthCard = document.createElement('div');
                monthCard.className = 'month-card';
                if (monthOffset === 0) {
                    monthCard.classList.add('highlight-month');
                }

                const monthTitle = document.createElement('div');
                monthTitle.className = 'month-title';
                monthTitle.innerHTML = `${formatMonth(monthDate)} <span class="month-tag${monthOffset === 0 ? ' current' : monthOffset > 0 ? ' future' : ''}">${monthOffset === 0 ? 'Current' : monthOffset > 0 ? 'Expected' : 'Past'}</span>`;
                monthCard.appendChild(monthTitle);

                const monthCalendar = document.createElement('div');
                monthCalendar.className = 'calendar-grid';
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((dayName) => {
                    const header = document.createElement('div');
                    header.className = 'day-header';
                    header.textContent = dayName;
                    monthCalendar.appendChild(header);
                });

                for (let emptyDay = 0; emptyDay < monthDate.getDay(); emptyDay += 1) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'day empty';
                    monthCalendar.appendChild(emptyCell);
                }

                const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
                for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
                    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNumber);
                    const day = document.createElement('div');
                    day.className = 'day';
                    day.textContent = dayNumber;

                    periodStarts.forEach((cycleStart) => {
                        const periodEnd = addDays(cycleStart, periodDuration - 1);
                        const estimatedOvulationDay = Math.max(periodDuration + 1, cycleLength - 14);
                        const fertileStart = addDays(cycleStart, Math.max(periodDuration, estimatedOvulationDay - 5));
                        const fertileEnd = addDays(cycleStart, Math.min(cycleLength - 1, estimatedOvulationDay + 1));

                        if (isBetween(date, cycleStart, periodEnd)) {
                            day.classList.add(cycleStart.getTime() === startDate.getTime()
                                ? 'actual-period'
                                : 'predicted-period');
                        } else if (isBetween(date, fertileStart, fertileEnd)) {
                            day.classList.add('fertile');
                        }
                    });

                    if (date.getTime() === today.getTime()) {
                        day.classList.add('today');
                    }
                    monthCalendar.appendChild(day);
                }

                monthCard.appendChild(monthCalendar);
                calendarGrid.appendChild(monthCard);
            }
        }

        function updateDashboard() {
            const selectedStatus = document.querySelector('input[name="status"]:checked').value;
            const age = Number(document.getElementById('age').value);
            const startDate = parseDate(document.getElementById('lastPeriodDate').value);
            const periodDuration = Number(document.getElementById('periodDuration').value);
            const cycleLength = Number(document.getElementById('cycleLength').value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysSinceStart = Math.max(0, Math.floor((today - startDate) / 86400000));
            const cycleDay = (daysSinceStart % cycleLength) + 1;
            const nextPeriodStart = addDays(startDate, (Math.floor(daysSinceStart / cycleLength) + 1) * cycleLength);
            const daysUntilNextPeriod = Math.max(0, Math.ceil((nextPeriodStart - today) / 86400000));
            const estimatedOvulationDay = Math.max(periodDuration + 1, cycleLength - 14);
            const ovulationStartDay = Math.max(periodDuration + 1, estimatedOvulationDay - 1);
            const ovulationEndDay = Math.min(cycleLength, estimatedOvulationDay + 1);
            const phase = cycleDay <= periodDuration
                ? 'Menstrual Phase'
                : cycleDay < ovulationStartDay
                    ? 'Follicular Phase'
                    : cycleDay <= ovulationEndDay
                        ? 'Ovulation Phase'
                        : 'Luteal Phase';
            const setupSymptoms = Array.from(document.querySelectorAll('#step4 .checkbox-tags input:checked'))
                .map((input) => input.value);
            const loggedSymptoms = Array.from(document.querySelectorAll('#log .checkbox-grid input:checked'))
                .map((input) => input.value);
            const selectedFlow = document.querySelector('input[name="flow"]:checked').value;
            const goal = document.getElementById('primaryGoal').value;
            const ageInsight = age < 18
                ? 'Teen cycles can be irregular while the body is developing. Tracking patterns over several months can be useful.'
                : age >= 45
                    ? 'Cycle timing and flow can change during the years leading up to menopause. Tracking changes can help you discuss them with a clinician.'
                    : 'Your cycle pattern can vary from month to month.';
            const phaseTips = cycleDay <= periodDuration
                ? [
                    cycleDay <= 2
                        ? 'Early period days can feel more tiring; plan lighter activities and keep water nearby.'
                        : 'As your period continues, gentle movement can support comfort if it feels good.',
                    'Track flow changes and how you feel today so your personal pattern becomes clearer.'
                ]
                : phase === 'Follicular Phase'
                    ? [
                        'Energy often starts to build after the period; gradually return to activities that feel comfortable.',
                        'Use today to note your energy, sleep, and discharge so you can compare cycles.'
                    ]
                    : phase === 'Ovulation Phase'
                        ? [
                            'You may notice more energy or cervical discharge around this phase; record changes that are normal for you.',
                            'Stay hydrated and choose movement based on how your body feels today.'
                        ]
                        : [
                            'In the days before a period, prioritize regular meals, sleep, hydration, and a manageable routine.',
                            'Make a note of changes in mood, energy, or body sensations to prepare for future cycles.'
                        ];
            const symptomTips = {
                'Period cramps': 'For cramps, try gentle movement, warmth, and rest; use only treatments that are safe for you.',
                Spotting: 'Keep tracking spotting, including its timing and amount. Seek medical advice if it is unusual for you or persistent.',
                'White discharge': 'Note changes in discharge color, odor, or texture. New unusual changes or irritation are worth discussing with a clinician.',
                Acne: 'Keep skincare gentle and avoid picking; note whether breakouts follow a repeatable cycle pattern.',
                Fatigue: 'For fatigue, prioritize sleep, hydration, regular meals, and gentle activity. Track whether it improves or persists.',
                'Body pain': 'Try gentle stretching, warmth, and rest for body pain, and record where it occurs and how long it lasts.',
                Bloating: 'For bloating, try regular meals, hydration, and light movement, and note foods or cycle days that seem related.',
                'Vaginal dryness': 'For dryness, avoid scented products and note when it occurs; persistent discomfort should be discussed with a clinician.',
                'Mood swings': 'For mood changes, protect sleep, take breaks, and record mood alongside cycle day to identify patterns.',
                Other: 'Add a note about your other symptom, including when it started, how strong it feels, and whether it changes.'
            };
            const loggedSymptomTips = {
                Cramps: symptomTips['Period cramps'],
                Headache: 'For a headache, try water, regular food, rest, and a quieter environment if helpful.',
                Bloating: symptomTips.Bloating,
                Acne: symptomTips.Acne
            };
            const suggestions = [...phaseTips];
            setupSymptoms.forEach((symptom) => {
                if (symptomTips[symptom]) {
                    suggestions.push(symptomTips[symptom]);
                }
            });
            loggedSymptoms.forEach((symptom) => {
                if (loggedSymptomTips[symptom]) {
                    suggestions.push(loggedSymptomTips[symptom]);
                }
            });
            if (selectedFlow === 'Heavy') {
                suggestions.push('Keep an eye on how heavy the flow is for you; seek medical advice if it is unusually heavy or you feel dizzy or faint.');
            }

            document.getElementById('phaseBadge').textContent = selectedStatus === 'active' && cycleDay <= periodDuration
                ? 'Menstrual Phase'
                : phase;
            const cycleDayElement = document.getElementById('cycleDay');
            const nextPeriodSummaryElement = document.getElementById('nextPeriodSummary');
            const nextPeriodText = `Next predicted period starts in ${daysUntilNextPeriod} day${daysUntilNextPeriod === 1 ? '' : 's'}`;
            const periodIsOver = cycleDay > periodDuration;
            cycleDayElement.textContent = periodIsOver ? nextPeriodText : `Day ${cycleDay}`;
            cycleDayElement.classList.toggle('next-period-message', periodIsOver);
            nextPeriodSummaryElement.textContent = nextPeriodText;
            nextPeriodSummaryElement.hidden = periodIsOver;
            document.getElementById('cycleLengthSummary').textContent = `${cycleLength} Days (Avg)`;
            document.getElementById('periodDurationSummary').textContent = `${periodDuration} Days`;
            document.getElementById('nextPeriodSummaryDate').textContent = `${formatDate(nextPeriodStart)} - ${formatDate(addDays(nextPeriodStart, periodDuration - 1))}`;
            document.getElementById('preferencesSummary').textContent = `${goal} | Symptoms: ${setupSymptoms.length ? setupSymptoms.join(', ') : 'None selected'}`;
            document.getElementById('ageInsight').textContent = age
                ? ageInsight
                : 'Add your age during setup for age-aware insights.';
            document.getElementById('suggestionsList').innerHTML = suggestions
                .map((suggestion) => `<li>${suggestion}</li>`)
                .join('');
            renderCalendar(startDate, periodDuration, cycleLength, nextPeriodStart);
        }

        dailyLogForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveDailyLog();
            updateDashboard();
        });

        dailyLogForm.querySelectorAll('input').forEach((input) => {
            input.addEventListener('change', updateDashboard);
        });

        nextStepButton.addEventListener('click', () => {
            if (currentStep === 0 && !document.getElementById('age').checkValidity()) {
                document.getElementById('age').reportValidity();
                return;
            }

            if (currentStep === steps.length - 1) {
                saveSetupDetails();
                updateDashboard();
                onboardingModal.style.display = 'none';
                return;
            }

            steps[currentStep].classList.remove('active');
            stepDots[currentStep].classList.remove('active');
            currentStep += 1;
            steps[currentStep].classList.add('active');
            stepDots[currentStep].classList.add('active');

            if (currentStep === steps.length - 1) {
                nextStepButton.textContent = 'Finish Setup';
            }
        });

        restoreDailyLog();
        if (restoreSetupDetails()) {
            updateDashboard();
            onboardingModal.style.display = 'none';
        }
