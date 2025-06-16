import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let clienteId_creado;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await initDb();

        // Login para obtener token (ajusta el id_empleado y contraseña según tu base de datos de test)
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ empleado_id: 100, contrasena: "1234" });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body).toHaveProperty('token');
        token_adm = loginRes.body.token;
    });

    const clientePrueba = {
        tipo_documento: 1,
        numero_documento: "36612359",
        nombre: "Cliente de prueba",
        apellido: "Prueba",
        telefono_secundario: "3512365487"
    };

    // alta de nuevo cliente de prueba
    describe('POST /api/clientes', () => {
        it('debe devolver 201 y un cliente', async () => {
            const res = await request(app)
                .post('/api/clientes') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(clientePrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('tipo_documento');
            expect(res.body).toHaveProperty('numero_documento');
            expect(res.body).toHaveProperty('apellido');
            expect(res.body).toHaveProperty('activo');
            expect(res.body).toHaveProperty('id');
            clienteId_creado = res.body.id;
            console.log("ClienteIDCREADO: ",clienteId_creado);


        });

        // Devuelve error por enviar datos de entrada inválidos al dar de alta un cliente
        it('debe devolver 400', async () => {
            const res = await request(app)
                .post('/api/clientes') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ ...clientePrueba, apellido: "" });
            expect(res.statusCode).toBe(400);
        });


    });




    //Consultamos cliente
    describe('GET /api/clientes', () => {
        it('debe devolver 200 todos los clientes sin filtros', async () => {
            const res = await request(app)
                .get(`/api/clientes`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

        // Filtros que devuelven 404 por no encontrar recurso en servidor
        it('debe devolver 404 si no encuentra un cliente (con ID improbable)', async () => {
            const res = await request(app)
                .get(`/api/clientes?numero_documento=absurd&tipo_documento=1`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(404);
        });

        // Filtro por cliente y devuelve 200
        it('debe devolver 200 si encuentra un cliente (con ID probable)', async () => {
            const res = await request(app)
                .get(`/api/clientes?numero_documento=${clientePrueba.numero_documento}&tipo_documento=${clientePrueba.tipo_documento}`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            //Quiero ver las propiedades de un elemento del array
            expect(res.body[0]).toHaveProperty('tipo_documento');
            expect(res.body[0]).toHaveProperty('numero_documento');
            expect(res.body[0]).toHaveProperty('apellido');
            expect(res.body[0]).toHaveProperty('activo');
            expect(res.body[0]).toHaveProperty('telefono_secundario');
            expect(res.body[0]).toHaveProperty('fecha_nacimiento');
            expect(res.body[0]).toHaveProperty('nombre');


        });

    });

    // Actualizamos datos del cliente TEST
    describe('PUT /api/clientes', () => {
        it('debe devolver 200 y un cliente', async () => {
            const res = await request(app)
                .put(`/api/clientes/${clienteId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    "tipo_documento": `${clientePrueba.tipo_documento}`,
                    "numero_documento": `${clientePrueba.numero_documento}`,
                    "nombre": "TEST",
                    "apellido": "TEST modificado",
                    "fecha_nacimiento": "1993-11-11",
                    "telefono_secundario": "3516341265",
                    "activo": 1
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('tipo_documento');
            expect(res.body).toHaveProperty('numero_documento');
            expect(res.body).toHaveProperty('apellido');
            expect(res.body).toHaveProperty('activo');
            expect(res.body).toHaveProperty('telefono_secundario');
            expect(res.body).toHaveProperty('fecha_nacimiento');
            expect(res.body).toHaveProperty('nombre');
        });


    })



    // Eliminamos cliente de prueba
    describe('DELETE /api/clientes/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/clientes/${clienteId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });






    afterAll(async () => {

        await sequelize.close();
    });

});