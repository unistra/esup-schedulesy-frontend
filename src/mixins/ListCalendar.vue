<script>
import moment from 'moment';

export default{
  props: {
    events: {
      type: Object,
      required: false,
      default : () => ({}),
    }
  },
  data: () => ({
    selectedOpen: false,
    selectedElement: null,
    selectedEvent: {},
    selectedEventGeolocation: [],
    showEventMap: false,
  }),
  computed: {
    viewerEvents() {
      if (this.events?.events?.length) {
        return this.events.events.map(event => ({
          ...event,
          ...{
            start: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.startHour}`,
            end: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.endHour}`,
          },
        }));
      }
      return [];
    },
    instructors() {
      return this.events.instructors
    },
    classrooms() {
      return this.events.classrooms
    },
    trainees() {
      return this.events.trainees
    },
    category5s () {
      return this.events.category5s
    }
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
      this.showEventMap = true;
      this.$nextTick(() => {
        this.selectedEventGeolocation = this.classrooms[classroom].geolocation;
      })
    },
  },
}
</script>
