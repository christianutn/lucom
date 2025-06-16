import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de tipo de negocio', () => {
    let token_adm;
    let tipoNegocioID_creado

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

    const tipoNegocioPrueba = {
        descripcion: "Tipo negocio desde JEST",
    };

    // alta de nuevo origen de prueba
    describe('POST /api/tipos-negocios', () => {
        it('debe devolver 201 y un tipo de negocios', async () => {
            const res = await request(app)
                .post('/api/tipos-negocios') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(tipoNegocioPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
            tipoNegocioID_creado = res.body.id;
        });


    });




    //Consultamos orrigen de prueba
    describe(`GET /api/tipos-domicilios?descripcion=${tipoNegocioPrueba.descripcion}`, () => {
        it('debe devolver 200 todos los tipos de domicilios con filtros', async () => {
            const res = await request(app)
                .get(`/api/tipos-domicilios`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del origen de datos TEST
    describe('PUT /api/tipos-negocios', () => {
        it('debe devolver 200 y un tipo de negocio', async () => {
            const res = await request(app)
                .put(`/api/tipos-negocios/${tipoNegocioID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    descripcion: "Modificado desde JEST",
                   activo: 0
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos cliente de prueba
    describe('DELETE /api/tipos-negocios/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/tipos-negocios/${tipoNegocioID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});