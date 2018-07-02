<template>
  <div id="app">
    <h2>Calendar: Default</h2>
    <Calendar :selectedDate="selectedDate1" :onChange="updateSelectedDate1" />

    <h2>Calendar: With pre-selected Date</h2>
    <Calendar :selectedDate="selectedDate2" :onChange="updateSelectedDate2" />

    <h2>Calendar: Target Year and Month</h2>
    <Calendar assignedYear="2018" assignedMonth="7" :selectedDate="selectedDate2" :onChange="updateSelectedDate2"  />

    <h2>Calendar: Available for start of this month to middle of this month</h2>
    <Calendar :availableDate="availableDate" :selectedDate="selectedDate3" :onChange="updateSelectedDate3"  />

    <h2>Calendar: Duration for a week</h2>
    <Calendar :durationDate="durationDate" />
  </div>
</template>

<script>
import Calendar from '@/components/DatePicker/Calendar.vue';

const today = new Date();

export default {
  name: 'root',
  components: {
    Calendar,
  },
  data: () => ({
    selectedDate1: null,
    selectedDate2: new Date(),
    selectedDate3: null,
    availableDate: {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth(), 15),
    },
    durationDate: {
      from: new Date(today.getFullYear(), today.getMonth(), 15),
      to: new Date(today.getFullYear(), today.getMonth(), 22),
    },
  }),
  methods: {
    updateSelectedDate1: function(dateObj) {
      this.selectedDate1 = dateObj.fullDate;
    },
    updateSelectedDate2: function(dateObj) {
      this.selectedDate2 = dateObj.fullDate;
    },
    updateSelectedDate3: function(dateObj) {
      this.selectedDate3 = dateObj.fullDate;
    },
  },
};
</script>

<style lang="less">
#app {
  color: #333333;
  font-family: 'BentonSans', 'Helvetica Neue', 'Helvetica', 'sans-serif';
  margin: 0;
  padding: 20px;
  text-align: center;
}
</style>
