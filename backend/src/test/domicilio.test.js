import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let domicilioId_creado;

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

    const domicilioPrueba = {
        cliente_id: 1,
        nombre_calle: "Calle test",
        numero_calle: "2020",
        entre_calle_1: "Entre calle test 1",
        entre_calle_2: "Entre calle test 2",
        barrio_id: 1
    };

    // alta de nuevo cliente de prueba
    describe('POST /api/domicilios', () => {
        it('debe devolver 201 y un domicilio', async () => {
            const res = await request(app)
                .post('/api/domicilios') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(domicilioPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('cliente_id');
            expect(res.body).toHaveProperty('nombre_calle');
            expect(res.body).toHaveProperty('numero_calle');
            expect(res.body).toHaveProperty('entre_calle_1');
            expect(res.body).toHaveProperty('entre_calle_2');
            expect(res.body).toHaveProperty('barrio_id');
            domicilioId_creado = res.body.id;
        });


    });




    //Consultamos cliente
    describe(`GET /api/domicilios?cliente_id=${domicilioPrueba.cliente_id}&barrio_id=${domicilioPrueba.barrio_id}&nombre_calle=${domicilioPrueba.nombre_calle}&numero_calle=${domicilioPrueba.numero_calle}`, () => {
        it('debe devolver 200 todos los domicilios sin filtros', async () => {
            const res = await request(app)
                .get(`/api/domicilios`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del domicilio TEST
    describe('PUT /api/domicilios', () => {
        it('debe devolver 200 y un cliente', async () => {
            const res = await request(app)
                .put(`/api/domicilios/${domicilioId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    cliente_id: `1`,
                    nombre_calle: "Calle test 2",
                    numero_calle: "2020",
                    entre_calle_1: "Entre calle test 1",
                    entre_calle_2: "Entre calle test 2",
                    barrio_id: 1
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('cliente_id');
            expect(res.body).toHaveProperty('nombre_calle');
            expect(res.body).toHaveProperty('numero_calle');
            expect(res.body).toHaveProperty('entre_calle_1');
            expect(res.body).toHaveProperty('entre_calle_2');
            expect(res.body).toHaveProperty('barrio_id');
        });

    })



    // Eliminamos cliente de prueba
    describe('DELETE /api/domicilios/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/domicilios/${domicilioId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});