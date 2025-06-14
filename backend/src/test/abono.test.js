import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;

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

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/abonos', () => {
        it('debe devolver 200 y un array de abonos', async () => {
            const res = await request(app)
                .get('/api/abonos')
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

        });

        // consultas con filtros
        it('debe devolver 200 y un array de abonos con filtros', async () => {
            const res = await request(app)
                .get('/api/abonos?descripcion=res&activo=1')
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })


        //Consultas que devuelven lista vacía, error 404
        it('debe devolver 404', async () => {
            const res = await request(app)
                .get('/api/abonos?descripcion=abc&activo=1')
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(404);

        });
    });

    // Validamos ruta /api/abonos/:id
    describe('GET /api/abonos/:id', () => {
        it('debe devolver 200 y un abono', async () => {
            const res = await request(app)
                .get('/api/abonos/1')
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
        });

        // Devuelve error cuando el id es distinto de un entero
        it('debe devolver 400 y un mensaje de error cuando id es distinto de un entero', async () => {
            const res = await request(app)
                .get('/api/abonos/abc')
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        // Devuelve 404 cuando no encuentra ningún abono con id
        it('debe devolver 404 y un mensaje de error cuando no encuentra un abono con id', async () => {
            const res = await request(app)
                .get('/api/abonos/1004')
                .set('Authorization', `Bearer ${token_adm}`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
        });

    })

    //Validamos ruta POST /api/abonos
    describe('POST /api/abonos', () => {
        let abonoId_creado = 0;
        it('debe devolver 201 y un abono', async () => {
            const res = await request(app)
                .post('/api/abonos')
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ descripcion: "Abono de prueba" });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
            abonoId_creado = res.body.id;
        });

        // Error por que el abono ya existe
        it('debe devolver 400 cuando un atributo es inválido', async () => {
            const res = await request(app)
                .post(`/api/abonos`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ descripcion: 1 });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });


        //Elminamos abono creado
        afterAll(async () => {
            await request(app)
                .delete(`/api/abonos/${abonoId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .expect(204);
        });
    })

    // Validamos ruta PUT /api/abonos
    describe('PUT /api/abonos', () => {
        let abonoId_creado = 0;
        it('debe devolver 201 y un abono', async () => {
            const res = await request(app)
                .post('/api/abonos')
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ descripcion: "Abono de prueba" });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('descripcion');
            expect(res.body).toHaveProperty('activo');
            abonoId_creado = res.body.id;
        });

        // Error por que el abono ya existe
        it('debe devolver 400 cuando un atributo es inválido', async () => {
            const res = await request(app)
                .put(`/api/abonos`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ descripcion: 1 });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        //Elminamos abono creado
        afterAll(async () => {
            await request(app)
                .delete(`/api/abonos/${abonoId_creado}`)
                .set('Authorization', `Bearer ${token_adm}`)
                .expect(204);
        });
    })



});