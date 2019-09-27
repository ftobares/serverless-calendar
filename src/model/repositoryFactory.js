import EventoRepo from './eventoRepo';

const repositories = {
    evento: EventoRepo,
    //otros
};

export const RepositoryFactory = {
    get: name => repositories[name],
}