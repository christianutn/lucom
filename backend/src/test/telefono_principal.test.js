import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Teléfonos principales', () => {
    let token_adm;
    let telID_creado

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

    const telPrueba = {
        cliente_id: 1,
        numero_telefono: "3518963255"
    };

    // alta de nuevo origen de prueba
    describe('POST /api/telefonos-principales', () => {
        it('debe devolver 201 y un telefeno principal', async () => {
            const res = await request(app)
                .post('/api/telefonos-principales') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(telPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('cliente_id');
            expect(res.body).toHaveProperty('activo');
            expect(res.body).toHaveProperty('numero_telefono');
            expect(res.body).toHaveProperty('fecha_modificacion');
            telID_creado = res.body.id;
        });


    });




    //Consultamos orrigen de prueba
    describe(`GET /api/telefonos-principales?numero_telefono=${telPrueba.numero_telefono}`, () => {
        it('debe devolver 200 todos los roles con filtros', async () => {
            const res = await request(app)
                .get(`/api/telefonos-principales`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del origen de datos TEST
    describe('PUT /api/telefonos-principales', () => {
        it('debe devolver 200 y un rol', async () => {
            const res = await request(app)
                .put(`/api/telefonos-principales/${telID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    cliente_id: 2,
                    activo: 0,
                    numero_telefono: "3518963254"
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('cliente_id');
            expect(res.body).toHaveProperty('numero_telefono');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos rol de prueba
    describe('DELETE /api/roles/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/telefonos-principales/${telID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});