import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let origenID_creado

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

    const origenPrueba = {
        descripcion: "Giga de prueba TT",
    };

    // alta de nuevo origen de prueba
    describe('POST /api/origen-datos', () => {
        it('debe devolver 201 y un origen de datos', async () => {
            const res = await request(app)
                .post('/api/origen-datos') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(origenPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
            origenID_creado = res.body.id;
        });


    });




    //Consultamos orrigen de prueba
    describe(`GET /api/gigas?descripcion=${origenPrueba.descripcion}`, () => {
        it('debe devolver 200 todos los origenes de datos con filtros', async () => {
            const res = await request(app)
                .get(`/api/origen-datos`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del origen de datos TEST
    describe('PUT /api/origen-datos', () => {
        it('debe devolver 200 y un origen de datos', async () => {
            const res = await request(app)
                .put(`/api/origen-datos/${origenID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    nombre: "Origen de datos de prueba TT se actualizo",
                   activo: 0
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos cliente de prueba
    describe('DELETE /api/origen-datos/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/origen-datos/${origenID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});