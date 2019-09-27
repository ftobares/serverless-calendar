import Vue from 'vue';
import Vuex from 'vuex';
import { RepositoryFactory } from './model/repositoryFactory';

Vue.use(Vuex);

const EventoRepo = RepositoryFactory.get('evento');

const store = new Vuex.Store({
  state: {
    eventos: [],
    evento: null
  },
  mutations: {
    setEventos(state, eventos) {
      state.eventos = eventos
      //console.log('eventos='+JSON.stringify(eventos));
    },
    setEvento(state, evento) {
      state.evento = evento
      //console.log('evento='+JSON.stringify(evento));
    },
    addEvento(state, evento) {      
      state.eventos.push(evento);
      //console.log('state.eventos='+JSON.stringify(state.eventos));
    },
    removeEvento(state, eventId){      
      var filtered = state.eventos.filter(function(value){        
        return value._id != eventId;
      });
      state.eventos = filtered;
    }
  },
  actions: {
    async getEventos({ commit }){
      const response = await EventoRepo.get();
      commit('setEventos', response.data);
    },
    async getEventoById({ commit }, eventId){
      const response = await EventoRepo.getEvento(eventId);
      commit('setEvento', response.data);
    },
    async putEvento({ commit }, evento){
      commit('setEvento', await EventoRepo.updateEvento(evento));      
    },
    async createEvento({ commit }, evento){
      const eventoNuevo = await EventoRepo.createEvento(evento);
      //console.log('eventoNuevo='+JSON.stringify(eventoNuevo));
      commit('addEvento', eventoNuevo.data);
    },
    async deleteEvento({ commit }, eventId){
      await EventoRepo.deleteEvento(eventId);      
      commit('removeEvento', eventId);
    },
  }
})

export default store