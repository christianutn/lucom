import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let gigaID_creado

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

    const gigaPrueba = {
        descripcion: "Giga de prueba TT",
    };

    // alta de nuevo cliente de prueba
    describe('POST /api/gigas', () => {
        it('debe devolver 201 y un giga', async () => {
            const res = await request(app)
                .post('/api/gigas') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(gigaPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
            gigaID_creado = res.body.id;
        });


    });




    //Consultamos cliente
    describe(`GET /api/gigas?descripcion=${gigaPrueba.descripcion}`, () => {
        it('debe devolver 200 todos los gigas con filtros', async () => {
            const res = await request(app)
                .get(`/api/gigas`)
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

    });

    // Actualizamos datos del domicilio TEST
    describe('PUT /api/gigas', () => {
        it('debe devolver 200 y un cliente', async () => {
            const res = await request(app)
                .put(`/api/gigas/${gigaID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    nombre: "Giga de prueba TT se actualizo",
                   activo: 0
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos cliente de prueba
    describe('DELETE /api/gigas/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/gigas/${gigaID_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});