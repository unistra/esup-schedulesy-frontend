<script>
export default{
  data: () => ({
    selectedOpen: false,
    selectedElement: null,
    selectedEvent: {},
    selectedEventGeolocation: [],
    showEventMap: false,
  }),
  computed: {
    events() {
      return this.$store.getters['calendar/getEvents'];
    },
    eventsInstructors() {
      return this.$store.getters['calendar/getEventsInstructors'];
    },
    eventsClassrooms() {
      return this.$store.getters['calendar/getEventsClassrooms'];
    },
    eventsTrainees() {
      return this.$store.getters['calendar/getEventsTrainees'];
    },
    eventsCategory5s() {
      return this.$store.getters['calendar/getEventsCategory5s'];
    },
  },
  methods: {
    objectFilter: (toFilter, allowed = []) => allowed.reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {}),
    showEvent({ event, nativeEvent }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => this.selectedOpen = true, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    showMap(classroom) {
      this.selectedEventGeolocation = this.eventsClassrooms[classroom].geolocation;
      this.showEventMap = !this.showEventMap;
    },
  },
}
</script>
