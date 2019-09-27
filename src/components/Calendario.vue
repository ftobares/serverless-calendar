<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <AddElementDialog />
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                outlined
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 días</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="eventos"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          :short-months="shortMonths"
          :short-weekdays="shortWeekdays"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-btn icon @click="borrarEvento(selectedEvent.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>              
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import AddElementDialog from './AddElementDialog';

  export default {
    name: "Calendario",
    components: {
      AddElementDialog,
    },
    data: () => ({
      isLoading: false,
      //today: new Date(),
      focus: null,
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        '4day': '4 Días',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      shortMonths: false,
      shortWeekdays: false,     
      /*events: [
        {
          name: 'Reunion Backend',
          details: 'Primer reunion',
          start: '2019-09-06 11:00',
          color: 'blue',
        },
        {
          name: 'Almuerzo',
          details: 'Almuerzo en BurgerKing',
          start: '2019-09-06 13:00',
          color: 'red',
        },
        {
          name: 'Reunion Backend',
          details: 'Segunda reunion',
          start: '2019-09-13 11:00',
          color: 'indigo',
        },
        {
          name: 'Reunion Backend',
          details: 'Tercer reunion',
          start: '2019-09-20 11:00',
          color: 'deep-purple',
        },
        {
          name: 'Reunion Backend',
          details: 'Ultima reunion',
          start: '2019-09-27 11:00',
          color: 'cyan',
        },
        {
          name: 'Big Meeting',
          details: 'A very important meeting about nothing',
          start: '2019-09-16 08:00',
          end: '2019-09-20 11:00',
          color: 'green',
        },
      ],*/
    }),    
    beforeMount() {
      this.$store.dispatch('getEventos');
    },
    computed: {
      today() {
        let current_datetime = new Date()
        let formatted_date = 
            current_datetime.getFullYear()
            + "-" + 
            (current_datetime.getMonth() + 1) 
            + "-"
            + current_datetime.getDate() ;
        return formatted_date;
      },
      eventos () {
        var result = this.$store.state.eventos;
        // console.log('results='+JSON.stringify(result));
        var events = [];        
        if(result != null){
          for(var i = 0; i < result.length; i++) {
            var event = {
              id: null,
              name: null,
              details: null,
              start: null,
              color: null,
              end: null
            };
            event.id = result[i]._id;
            event.name = result[i]._name;
            event.details = result[i]._details;
            event.start = result[i]._start_date;
            event.color = result[i]._color;
            event.end = result[i]._end_date;
            // console.log('i='+i);
            // console.log('result.length='+result.length);
            // console.log('nameValue='+result[i].start_date);
            // console.log('event.start='+event.start);
            events.push(event);            
          }
        }
        // console.log('events='+JSON.stringify(events));      
        return events;
      },
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day //+ this.nth(start.day)
        const endDay = end.day //+ this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startDay} ${startMonth} ${startYear} - ${endDay} ${suffixMonth} ${suffixYear}`
          case 'day':
            return `${startDay} ${startMonth} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    methods: {
      actualizarEvento(eventoId){
        return this.$store.dispatch('putEvento',eventoId);
      },      
      borrarEvento(eventoId){
        this.selectedOpen = false;
        return this.$store.dispatch('deleteEvento',eventoId);
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
  }
</script>