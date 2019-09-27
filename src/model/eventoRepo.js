import Repository from './repository';

const resource = "/events";

export default {
    get() {
        return Repository.get(`${resource}`);
    },
    getEvento(eventoId){
        return Repository.get(`${resource}?id=${eventoId}`);
    },
    createEvento(payload){
        return Repository.post(`${resource}`,payload);
    },
    updateEvento(payload){
        return Repository.put(`${resource}`,payload);
    },
    deleteEvento(eventoId){
        return Repository.delete(`${resource}?id=${eventoId}`);
    }
}