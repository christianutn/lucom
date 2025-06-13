import request from 'supertest';
import { app, initDb } from '../index.js';
import sequelize from '../config/base_datos.js';

describe('Rutas de Abono', () => {
    let token_adm;
    let clienteTipoDoc_creado;
    let clienteNumeroDocumento_creado;

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

    const clientePrueba = {
        tipo_documento: 1,
        numero_documento: "328513571",
        nombre: "Cliente de prueba",
        apellido: "Prueba",
        telefono_secundario: "3512365487"
    };

    // alta de nuevo cliente de prueba
    describe('POST /api/clientes', () => {
        it('debe devolver 201 y un cliente', async () => {
            const res = await request(app)
                .post('/api/clientes') // Corrige la ruta: debe ser plural
                .set('Authorization', `Bearer ${token_adm}`)
                .send(clientePrueba);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('tipo_documento');
            expect(res.body).toHaveProperty('numero_documento');
            expect(res.body).toHaveProperty('apellido');
            expect(res.body).toHaveProperty('activo');
            clienteTipoDoc_creado = res.body.tipo_documento;
            clienteNumeroDocumento_creado = res.body.numero_documento;
        });
    });


    // Eliminamos cliente de prueba
    describe('DELETE /api/clientes/:tipo_documento/:numero_documento', () => {
        it('debe devolver 204', async () => {
            const res = await request(app)
                .delete(`/api/clientes`)
                .set('Authorization', `Bearer ${token_adm}`)
                .send({ tipo_documento: clienteTipoDoc_creado, numero_documento: clienteNumeroDocumento_creado });
            expect(res.statusCode).toBe(204);
        });
    });






    afterAll(async () => {

        await sequelize.close();
    });

});