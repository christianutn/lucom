import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let rolID_creado

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

    const rolPrueba = {
        descripcion: "Role de prueba TT",
        codigo: "TEST2"
    };

    // alta de nuevo origen de prueba
    describe('POST /api/roles', () => {
        it('debe devolver 201 y un rol', async () => {
            const res = await request(app)
                .post('/api/roles') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(rolPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('codigo');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
            rolID_creado = res.body.codigo;
        });


    });




    //Consultamos orrigen de prueba
    describe(`GET /api/gigas?descripcion=${rolPrueba.descripcion}`, () => {
        it('debe devolver 200 todos los roles con filtros', async () => {
            const res = await request(app)
                .get(`/api/roles`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del origen de datos TEST
    describe('PUT /api/roles', () => {
        it('debe devolver 200 y un rol', async () => {
            const res = await request(app)
                .put(`/api/roles/${rolID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    descripcion: "Role de prueba TT se actualizo",
                   activo: 0
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('codigo');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos rol de prueba
    describe('DELETE /api/roles/:codigo', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/roles/${rolID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});