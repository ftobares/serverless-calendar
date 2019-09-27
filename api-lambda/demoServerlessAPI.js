const { Pool } = require('pg');
const Evento = require('./evento.js');
const pool = new Pool(); //Defino un Pool reutilizable

exports.handler = async (event) => {

  //Obtengo un cliente para establecer la conexion
  const client = await pool.connect();

  //Defino variables locales
  const inputBody = JSON.parse(event.body);
  let body;
  let httpStatusCode;
  let evento;

  if (event['httpMethod'] === 'DELETE') {
    try {
      const idEvento = event.queryStringParameters['id'];
      const res = await client.query('update eventos set activo = 0, fecha_modificacion = now() where id=$1', [idEvento]);
      body = 'Evento cancelado';
      httpStatusCode = 200;
    } catch (ex) {
      console.log('Error al cancelar evento.', ex);
      httpStatusCode = 500;
    } finally {
      //Libero el cliente al pool de conexiones para que pueda ser reutilizado
      client.release();
    }
  } else if (event['httpMethod'] === 'GET') {
    try {
      //Defino y seteo constantes enviadas por parametros
      let idEvento
      if(event.queryStringParameters != null){
        idEvento = event.queryStringParameters['id'];
        const res = await client.query('select id, name, details, color, start_date, end_date from eventos where activo = 1 and id=$1', [idEvento]);
        if(res.rows.length > 0){
          body = new Evento(res.rows[0].id, res.rows[0].name, res.rows[0].details, res.rows[0].color, res.rows[0].start_date, res.rows[0].end_date);
          httpStatusCode = 200;
        }else{
          body = 'No se ha encontrado el evento con Id='+idEvento;
          httpStatusCode = 404;
        }
      }else{
        const res = await client.query('select id, name, details, color, start_date, end_date from eventos where activo = 1');
        if(res.rows.length > 0){
          var eventos = [];
          for(var i = 0; i < res.rows.length; i++){
            var event = {};
            event = new Evento(res.rows[i].id, res.rows[i].name, res.rows[i].details, res.rows[i].color, res.rows[i].start_date, res.rows[i].end_date);
            eventos.push(event);
          }
          body = eventos;
          httpStatusCode = 200;
        }else{
          body = 'No se han encontrado eventos';
          httpStatusCode = 404;
        }
      }
            
    } catch (ex) {
      console.log('Error buscando usuario.', ex);
      httpStatusCode = 500;
    } finally {
      //Libero el cliente al pool de conexiones para que pueda ser reutilizado
      client.release()
    }
  } else if (event['httpMethod'] === 'POST') {
    try {
      evento = new Evento(null, inputBody.name, inputBody.details, inputBody.color, inputBody.start_date, inputBody.end_date);
      const res = await client.query('INSERT INTO eventos (name, details, color, start_date, end_date, activo) '+
                                     'VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, 1) '+
                                     'RETURNING id;', 
                                    [evento.name, 
                                      evento.details, 
                                      evento.color, 
                                      evento.start_date, 
                                      evento.end_date]
                                    );
      evento.id = res.rows[0];
      body = evento;
      httpStatusCode = 201;
    } catch (ex) {
      console.log('Error al crear evento.', ex);
      httpStatusCode = 500;
    } finally {
      //Libero el cliente al pool de conexiones para que pueda ser reutilizado
      client.release();
    }
  } else if (event['httpMethod'] === 'PUT') {
    try {
      evento = new Evento(inputBody.id, inputBody.name, inputBody.details, inputBody.color, inputBody.start_date, inputBody.end_date);
      const res = await client.query('UPDATE eventos '+
                                     'SET name = $2::text, details = $3::text, color = $4::text, start_date = $5::text, end_date = $6::text, fecha_modificacion = now() '+
                                     'WHERE id = $1', 
                                    [evento.id,                                       
                                      evento.name,
                                      evento.details, 
                                      evento.color,
                                      evento.start_date,
                                      evento.end_date]
                                    );
      body = evento;
      httpStatusCode = 200;
    } catch (ex) {
      console.log('Error al actualizar evento.', ex);
      httpStatusCode = 500;
    } finally {
      //Libero el cliente al pool de conexiones para que pueda ser reutilizado
      client.release();
    }
  }

  var response = {
    "isBase64Encoded": false,
    "headers": {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    "statusCode": httpStatusCode,
    "body": JSON.stringify(body)
  };
  
  console.info(JSON.stringify(response));

  return response;
};