class Evento {
    constructor(id, name, details, color, start_date, end_date) {
        this._id = id;
        this._name = name;
        this._details = details;
        this._color = color;
        this._start_date = start_date;
        this._end_date = end_date;
    }

    get id(){
        return this._id;
    }
    set id(x){
        this._id = x;
    }

    get name(){
        return this._name;
    }
    set name(x){
        this._name = x;
    }

    get details(){
        return this._details;
    }
    set details(x){
        this._details = x;
    }

    get color(){
        return this._color;
    }
    set color(x){
        this._color = x;
    }

    get start_date(){
        return this._start_date;
    }
    set start_date(x){
        this._start_date = x;
    }

    get end_date(){
        return this._end_date;
    }
    set end_date(x){
        this._end_date = x;
    }
    
}

module.exports = Evento;