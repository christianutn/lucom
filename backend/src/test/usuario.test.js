import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de tipo de negocio', () => {
    let token_adm;
    let usuarioID_creado

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

    const usuarioPrueba = {
        empleado_id: 113,
        rol: "ADM",
        contrasena: "1234"
    };

    // alta de nuevo origen de prueba
    describe('POST /api/usuarios', () => {
        it('debe devolver 201 y un usuario', async () => {
            const res = await request(app)
                .post('/api/usuarios') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(usuarioPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('empleado_id');
            expect(res.body).toHaveProperty('rol');
            expect(res.body).toHaveProperty('activo');
            usuarioID_creado = res.body.empleado_id;
        });


    });




    //Consultamos orrigen de prueba
    describe(`GET /api/usuarios?empleado_id=${usuarioPrueba.empleado_id}&rol=${usuarioPrueba.rol}`, () => {
        it('debe devolver 200 todos los usuarios con filtros', async () => {
            const res = await request(app)
                .get(`/api/usuarios`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del origen de datos TEST
    describe('PUT /api/usuarios', () => {
        it('debe devolver 200 y un tipo de negocio', async () => {
            const res = await request(app)
                .put(`/api/usuarios/${usuarioID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    rol: "VEND",
                   activo: 0
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('empleado_id');
            expect(res.body).toHaveProperty('rol');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos usuario de prueba
    describe('DELETE /api/usuarios/:empleado_id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/usuarios/${usuarioID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});