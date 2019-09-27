<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Agregar Evento</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Agregar nuevo evento</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="nombreEvento" label="Nombre evento *" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="descEvento" label="Descripción"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="colorEvento"
                  :items="['red', 'pink', 'purple', 'blue', 'green', 'yellow', 'black', 'orange']"
                  label="Color *"
                  required
                ></v-select>
              </v-col>              
              <v-col cols="12">
                <v-text-field v-model="fechaInicioEvento" label="Fecha inicio *" hint="Formato YYYY-MM-DD" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="fechaFinEvento" label="Fecha fin" hint="Formato YYYY-MM-DD"></v-text-field>
              </v-col>              
            </v-row>
          </v-container>
          <small>* Campos obligatorios</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Cerrar</v-btn>
          <v-btn color="blue darken-1" text @click="guardarEvento()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      nombreEvento: null,
      descEvento: null,
      colorEvento: null,
      fechaInicioEvento: null,
      fechaFinEvento: null
    }),
    methods: {
        guardarEvento(){
            var evento = {
                "id":null,
                "name":this.nombreEvento,
                "details":this.descEvento,
                "color":this.colorEvento,
                "start_date":this.fechaInicioEvento,
                "end_date":this.fechaFinEvento
            }
            //console.log('eventoNuevo='+JSON.stringify(evento));
            this.$store.dispatch('createEvento',evento);
            this.dialog = false;
        }
    }
  }
</script>