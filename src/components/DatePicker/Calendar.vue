<template>
  <div class="component-calendar">
    <div class="nav-btn prev" @click="goPrevMonth">
      <svg
        class="arrow-left arrow-icon"
        x="0px"
        y="0px"
        width="14px"
        height="14px"
        viewBox="0 0 199.404 199.404"
      >
        <polygon points="135.412,0 35.709,99.702 135.412,199.404 163.695,171.119 92.277,99.702 163.695,28.285" />
      </svg>
    </div>
    <div class="calendar-table">
      <div class="calendar-header row">
        <div class="date">
          {{getMonthFormatted(currentDate)}}
          {{'  '}}
          {{currentDate.getFullYear()}}
        </div>
      </div>
      <div class="cal-row-fluid cal-row-head">
        <div class="cal-span">{{language.d1}}</div>
        <div class="cal-span">{{language.d2}}</div>
        <div class="cal-span">{{language.d3}}</div>
        <div class="cal-span">{{language.d4}}</div>
        <div class="cal-span">{{language.d5}}</div>
        <div class="cal-span">{{language.d6}}</div>
        <div class="cal-span">{{language.d0}}</div>
      </div>
      <div class="cal-month-box">
        <div v-for="week in month" v-bind:key="week.index" class="cal-row-fluid cal-week">
          <div v-for="dayObj in week" v-bind:key="dayObj.day" :class="['cal-span', 'cal-cell',
          {
            'cal-day-outmonth': dayObj.outmonth,
            'inDuration': dayObj.inDuration,
            'fromDuration': dayObj.fromDuration,
            'toDuration': dayObj.toDuration,
          }]">
            <div :class="['cal-month-day', {
              'cal-day-weekend': dayObj.day === 6 || dayObj.day === 7,
              'cal-day-today': dayObj.isToday,
              'not-available': !dayObj.available,
              'selected': selectedDate &&
              selectedDate.getDate() === dayObj.date &&
              selectedDate.getMonth() === currentDate.getMonth() &&
              selectedDate.getFullYear() === currentDate.getFullYear() &&
              !dayObj.outmonth,
            }]"
              @click="selectDayEvent(dayObj)"
              @mouseEnter="hoverDayEvent(dayObj)"
            >
            {{dayObj.date}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-btn next" @click="goNextMonth">
      <svg
        class="arrow-right arrow-icon"
        x="0px"
        y="0px"
        width="14px"
        height="14px"
        viewBox="0 0 199.404 199.404"
      >
        <polygon points="63.993,199.404 163.695,99.702 63.993,0 35.709,28.285 107.127,99.702 35.709,171.119" />
      </svg>
    </div>
  </div>
</template>

<script>
const language = {
  ms0: 'January',
  ms1: 'February',
  ms2: 'March',
  ms3: 'April',
  ms4: 'May',
  ms5: 'June',
  ms6: 'July',
  ms7: 'August',
  ms8: 'September',
  ms9: 'October',
  ms10: 'November',
  ms11: 'December',
  d0: 'S',
  d1: 'M',
  d2: 'T',
  d3: 'W',
  d4: 'T',
  d5: 'F',
  d6: 'S',
  thisMonth: 'This month',
  goPrevMonth: 'Prev',
  nextMonth: 'Next',
};

const DEFAULT_CURRENT_DATE = new Date();
DEFAULT_CURRENT_DATE.setDate(1);

const stringifyDay = date =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

// month between 1 ~ 12
const monthGenegrator = ({
  currentDate,
  today,
  availableDate,
  durationDate,
}) => {
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const monthArray = [];
  const firstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
  //  weekDay between 1 ~ 7 , 1 is Monday, 7 is Sunday
  const firstDayInFirstweek = firstDay.getDay() > 0 ? firstDay.getDay() : 7;
  const daysOfMonth = daysInMonth(month, year);
  const prevDaysOfMonth = daysInMonth(month - 1, year);

  let recordDate = 0;

  // record which day obj already genegrate
  // first week row
  monthArray.push(
    weekGenerator({
      year,
      month,
      startDate: recordDate - firstDayInFirstweek,
      daysOfMonth,
      prevDaysOfMonth,
      availableDate,
      durationDate,
    })
  );

  recordDate = 7 - firstDayInFirstweek;
  // loop for following week row
  while (recordDate < daysOfMonth - 1) {
    monthArray.push(
      weekGenerator({
        year,
        month,
        startDate: recordDate,
        daysOfMonth,
        availableDate,
        durationDate,
      })
    );
    recordDate += 7;
  }

  // set isToday
  if (
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  ) {
    const atWeek =
      Math.ceil((today.getDate() + firstDayInFirstweek - 1) / 7) - 1;
    const atDay = (today.getDate() + firstDayInFirstweek - 2) % 7;
    monthArray[atWeek][atDay].isToday = true;
  }
  return monthArray;
};

// month between 1~12
const weekGenerator = ({
  year,
  month,
  startDate,
  daysOfMonth,
  prevDaysOfMonth,
  availableDate,
  durationDate,
}) => {
  const week = [];
  let realDate;
  let outmonth;
  let isBeforeMonth;
  let fullDate;
  let available;
  let inDuration;
  let fromDuration, toDuration;

  for (let i = 1; i <= 7; i++) {
    outmonth = false;
    available = true;
    inDuration = false;
    fromDuration = false;
    toDuration = false;

    if (startDate + i < 0) {
      realDate = prevDaysOfMonth + startDate + i + 1;
      outmonth = true;
      isBeforeMonth = true;
    } else if (startDate + i + 1 > daysOfMonth) {
      realDate = startDate + i - daysOfMonth + 1;
      outmonth = true;
      isBeforeMonth = false;
    } else {
      realDate = startDate + i + 1;
      isBeforeMonth = false;
    }

    if (outmonth && isBeforeMonth) {
      fullDate = new Date(year, month - 2, realDate);
    } else if (outmonth && !isBeforeMonth) {
      fullDate = new Date(year, month, realDate);
    } else {
      fullDate = new Date(year, month - 1, realDate);
    }

    // is available ?
    if (availableDate && availableDate.from && fullDate < availableDate.from) {
      available = false;
    }

    if (availableDate && availableDate.to && fullDate > availableDate.to) {
      available = false;
    }

    if (durationDate && durationDate.from && durationDate.to) {
      if (
        fullDate.getTime() > durationDate.from.getTime() &&
        fullDate.getTime() < durationDate.to.getTime()
      ) {
        inDuration = true;
      }
      if (stringifyDay(fullDate) === stringifyDay(durationDate.from)) {
        fromDuration = true;
      }
      if (stringifyDay(fullDate) === stringifyDay(durationDate.to)) {
        toDuration = true;
      }
    }

    week.push({
      outmonth,
      day: i,
      date: realDate,
      available,
      fullDate,
      inDuration,
      fromDuration,
      toDuration,
    });
  }
  return week;
};

export default {
  name: 'calendar',
  props: [
    'onChange',
    'onHover',
    'selectedDate',
    'assignedMonth',
    'assignedYear',
    'availableDate',
    'durationDate',
    // 'highlightDates',
  ],
  data: () => ({
    currentDate: DEFAULT_CURRENT_DATE,
    today: new Date(),
    language: language,
  }),
  created: function() {
    this.setCurrentDate();
  },
  computed: {
    month: function() {
      return monthGenegrator({
        currentDate: this.currentDate,
        today: this.today,
        availableDate: this.availableDate,
        durationDate: this.durationDate,
      });
    },
  },
  methods: {
    getMonthFormatted: date => language[`ms${date.getMonth()}`],

    setCurrentDate: function() {
      const targetMonth = parseInt(this.assignedMonth, 10);
      const targetYear = parseInt(this.assignedYear, 10);
      if (
        !isNaN(targetMonth) &&
        !isNaN(targetYear) &&
        targetMonth >= 0 &&
        targetMonth < 13
      ) {
        this.currentDate = new Date(targetYear, targetMonth - 1, 1);
      }
    },

    goPrevMonth: function() {
      const newCurrentDate = new Date(this.currentDate);
      newCurrentDate.setMonth(this.currentDate.getMonth() - 1, 1);
      this.currentDate = newCurrentDate;
    },

    goNextMonth: function() {
      const newCurrentDate = new Date(this.currentDate);
      newCurrentDate.setMonth(this.currentDate.getMonth() + 1, 1);
      this.currentDate = newCurrentDate;
    },

    selectDayEvent: function(dateObj) {
      if (typeof this.onChange === 'function') {
        const selectedDateObj = {
          year: this.currentDate.getFullYear(),
          month: this.currentDate.getMonth(),
          day: dateObj.date,
          fullDate: dateObj.fullDate,
        };
        this.onChange(selectedDateObj);
      }
    },

    hoverDayEvent: function(dateObj) {
      if (typeof this.onChange === 'function') {
        if (dateObj) {
          const selectedDateObj = {
            year: this.currentDate.getFullYear(),
            month: this.currentDate.getMonth(),
            day: dateObj.date,
            fullDate: dateObj.fullDate,
          };
          this.onHover(selectedDateObj);
        } else {
          this.onHover(null);
        }
      }
    },
  },
};
</script>


<style scoped lang="less">
.component-calendar {
  display: flex;
  border-radius: 5px;
  color: #4a5b6b;
  user-select: none;
  .nav-btn {
    display: flex;
    padding: 12px 4px;
    cursor: pointer;
    align-items: center;
    .arrow-icon {
      width: 22px;
      fill: #2c2c2c;
    }
  }
  .calendar-table {
    flex: 1;
  }

  .calendar-header {
    display: flex;
    align-items: center;
    padding: 4px 0 8px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin: 0 auto;

    .date {
      margin: 0 auto;
      font-size: 16px;
      line-height: 1.5;
      color: #2c2c2c;
      text-transform: uppercase;
    }
  }
  .cal-row-fluid {
    .cal-span {
      position: relative;
      display: block;
      float: left;
      width: 14.285714285714285%;
      margin: 4px 0;
      &.inDuration {
        background: #99ccff;
        .cal-month-day {
          color: #fff;
        }
      }
      &.fromDuration,
      &.toDuration {
        background: inherit;
        .cal-month-day {
          background: #55a9ff;
          color: #fff;
        }
        &:after {
          content: ' ';
          position: absolute;
          top: 0;
          height: 100%;
          background: #99ccff;
          z-index: 0;
        }
      }
      &.fromDuration:after {
        left: 50%;
        right: 0;
      }
      &.toDuration:after {
        right: 50%;
        left: 0;
      }
      &.fromDuration.toDuration:after {
        content: none;
      }
      &.cal-day-outmonth {
        cursor: default;
        pointer-events: none;
        opacity: 0;
      }
    }
    &:after {
      clear: both;
    }
    &:before,
    &:after {
      display: table;
      content: '';
      line-height: 0;
    }
  }

  .cal-row-head {
    margin-bottom: 8px;
    padding: 0 4px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;

    .cal-span {
      font-size: 12px;
      line-height: 1.5;
      color: #2c2c2c;
    }
  }

  .cal-month-box {
    padding: 2px 4px 16px;
  }

  .cal-month-day {
    position: relative;
    width: 24px;
    height: 24px;
    margin: 0 auto;
    text-align: center;
    cursor: pointer;

    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: #2c2c2c;
    border-radius: 12px;
    font-size: 12px;
    line-height: 1.5;
    z-index: 1;

    &:hover {
      background-color: #c9c9c9;
    }
    &:active {
      background-color: #afafaf;
    }
    &.cal-day-today {
      background: #eee;
    }

    &.selected {
      background: #55a9ff;
      color: #fff;
    }

    &.not-available {
      cursor: default;
      pointer-events: none;
      opacity: 0.4;
    }
  }
}
</style>
