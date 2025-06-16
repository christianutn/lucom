import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de empleado', () => {
    let token_adm;
    let empleadoId_creado;

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

    const empleadoPrueba = {
        nombre: "Cliente de prueba TT",
        apellido: "Apellido TT",
        correo_electronico: "correoTT@tt.com"
    };

    // alta de nuevo cliente de prueba
    describe('POST /api/empleados', () => {
        it('debe devolver 201 y un empleado', async () => {
            const res = await request(app)
                .post('/api/empleados') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(empleadoPrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('nombre');
            expect(res.body).toHaveProperty('apellido');
            expect(res.body).toHaveProperty('correo_electronico');
            expect(res.body).toHaveProperty('activo');
            empleadoId_creado = res.body.id;
        });


    });




    //Consultamos cliente
    describe(`GET /api/empleados?nombre=${empleadoPrueba.nombre}&apellido=${empleadoPrueba.apellido}&correo_electronico=${empleadoPrueba.correo_electronico}&activo=${empleadoPrueba.activo}`, () => {
        it('debe devolver 200 todos los domicilios con filtros', async () => {
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
                .put(`/api/empleados/${empleadoId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({
                    nombre: "Cliente de prueba TT se actualizo",
                    apellido: "Apellido TT se actualizo",
                    correo_electronico: "correoTT@tt.com",
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('nombre');
            expect(res.body).toHaveProperty('apellido');
            expect(res.body).toHaveProperty('correo_electronico');
            expect(res.body).toHaveProperty('activo');
        });

    })



    // Eliminamos cliente de prueba
    describe('DELETE /api/empleados/:id', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/empleados/${empleadoId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
            expect(res.statusCode).toBe(204);
        });
    });



    afterAll(async () => {

        await sequelize.close();
    });

});