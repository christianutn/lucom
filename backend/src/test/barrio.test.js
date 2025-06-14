import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let barrioId_creado;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await initDb();

        // Login para obtener token (ajusta el id_empleado y contraseña según tu base de datos de test)
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ id_empleado: 100, contrasena: "1234" });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body).toHaveProperty('token');
        token_adm = loginRes.body.token;
    });

   
    // alta de nuevo barrio de prueba
    describe('POST /api/barrios', () => {
        it('debe devolver 201 y un barrio', async () => {
            const res = await request(app)
                .post('/api/barrios')
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ nombre: "Barrio de prueba", codigo_postal: "1234" });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('nombre');
            expect(res.body).toHaveProperty('codigo_postal');
            expect(res.body).toHaveProperty('activo');
            barrioId_creado = res.body.id;
        });

        // Error por datos inválidos
        it('debe devolver 400 cuando un atributo es inválido', async () => {
            const res = await request(app)
                .post(`/api/barrios`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ nombre: 1 });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });


    // Buscamos barrio por id

    describe('GET /api/barrios/:id', () => {
        it('debe devolver 200 y un barrio', async () => {
            const res = await request(app)
                .get(`/api/barrios/${barrioId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('nombre');
            expect(res.body).toHaveProperty('codigo_postal');
            expect(res.body).toHaveProperty('activo');
        });

        // Error por que se invía un id inválido
        it('debe devolver 400 cuando un id es inválido', async () => {
            const res = await request(app)
                .get(`/api/barrios/abc`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        // Eror por barrio no encontrado
        it('debe devolver 404 cuando no se encuentra el barrio', async () => {
            const res = await request(app)
                .get(`/api/barrios/999999999999`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
        });
    });

    // Actualizamos datos de barrio creado

    describe('PUT /api/barrios', () => {
        it('debe devolver 200 y un barrio', async () => {
            const res = await request(app)
                .put(`/api/barrios/${barrioId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ nombre: "Barrio de prueba actualizado", codigo_postal: "1234", activo: 0 });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('nombre');
            expect(res.body).toHaveProperty('codigo_postal');
            expect(res.body).toHaveProperty('activo');
        });


        //Error se envia id inválido para actualizar
        it('debe devolver 400 cuando un id es inválido', async () => {
            const res = await request(app)
                .put(`/api/barrios/abc`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ nombre: "Barrio de prueba actualizado", codigo_postal: "1234", activo: 0 });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    // Eliminamos barrio creado
    describe('DELETE /api/barrios/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/barrios/${barrioId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .expect(204);
        });

        // Error se intenta eliminar un barrio inexistente
        it('debe devolver 404 cuando no se encuentra el barrio', async () => {
            const res = await request(app)
                .delete(`/api/barrios/999999999999`)
                .set('Authorization', `Bearer ${token_adm}`)
                .expect(404);
            expect(res.body).toHaveProperty('message');
        });

        // Error se envvía un id inválido
        it('debe devolver 400 cuando un id es inválido', async () => {
            const res = await request(app)
                .delete(`/api/barrios/abc`)
                .set('Authorization', `Bearer ${token_adm}`)
                .expect(400);
            expect(res.body).toHaveProperty('message');
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});