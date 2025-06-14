// Importar todos los modelos
import Abono from './abono.models.js';
import Barrio from './barrio.models.js';
import Cliente from './cliente.models.js';
import Compania from './compania.models.js';
import DatosServiciosConvergencias from './dato_servicio_convergencia.models.js';
import DetalleBaf from './detalle_baf.models.js';
import DetallePorta from './detalle_porta.models.js';
import Domicilio from './domicilio.models.js';
import Empleado from './empleado.models.js';
import Giga from './giga.models.js';
import OrigenDato from './origen_dato.models.js';
import Rol from './rol.models.js';
import TelefonoPrincipal from './telefono_principal.models.js';
import TipoConvergencia from './tipo_convergencia.models.js';
import TipoDocumento from './tipo_documento.models.js';
import TipoDomicilio from './tipo_domicilio.models.js';
import TipoNegocio from './tipo_negocio.models.js';
import Usuario from './usuario.models.js';
import Venta from './venta.models.js';

// Asociaciones
// Cliente - TipoDocumento
Cliente.belongsTo(TipoDocumento, { foreignKey: 'tipo_documento', as: 'tipoDocumento' });
TipoDocumento.hasMany(Cliente, { foreignKey: 'tipo_documento', as: 'clientes' });

// Domicilio - Cliente
Domicilio.belongsTo(Cliente, { foreignKey: ['tipo_documento_cliente', 'numero_documento_cliente'], as: 'cliente' });
Cliente.hasMany(Domicilio, { foreignKey: ['tipo_documento_cliente', 'numero_documento_cliente'], as: 'domicilios' });

// Domicilio - Barrio
Domicilio.belongsTo(Barrio, { foreignKey: 'barrio', as: 'barrioAsociado' });
Barrio.hasMany(Domicilio, { foreignKey: 'barrio', as: 'domiciliosAsociados' });

// Venta - Cliente
Venta.belongsTo(Cliente, {
  foreignKey: 'numero_documento_cliente',
  targetKey: 'numero_documento',
  as: 'cliente'
});
Cliente.hasMany(Venta, {
  foreignKey: 'numero_documento_cliente',
  sourceKey: 'numero_documento',
  as: 'ventas'
});
// Venta - TipoNegocio
Venta.belongsTo(TipoNegocio, { foreignKey: 'tipo_negocio_id', as: 'tipoNegocio' });
TipoNegocio.hasMany(Venta, { foreignKey: 'tipo_negocio_id', as: 'ventas' });

// DetalleBaf - Venta
DetalleBaf.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasOne(DetalleBaf, { foreignKey: 'venta_id', as: 'detalleBaf' });

// DetalleBaf - TipoDomicilio
DetalleBaf.belongsTo(TipoDomicilio, { foreignKey: 'tipos_domicilios_id', as: 'tipoDomicilio' });
TipoDomicilio.hasMany(DetalleBaf, { foreignKey: 'tipos_domicilios_id', as: 'detallesBaf' });

// DetalleBaf - Abono
DetalleBaf.belongsTo(Abono, { foreignKey: 'abono_id', as: 'abono' });
Abono.hasMany(DetalleBaf, { foreignKey: 'abono_id', as: 'detallesBaf' });

// DetalleBaf - TipoConvergencia
DetalleBaf.belongsTo(TipoConvergencia, { foreignKey: 'tipo_convergencia', as: 'tipoConvergencia' });
TipoConvergencia.hasMany(DetalleBaf, { foreignKey: 'tipo_convergencia', as: 'detallesBaf' });

// DetallePorta - Venta
DetallePorta.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasOne(DetallePorta, { foreignKey: 'venta_id', as: 'detallePorta' });

// DetallePorta - Giga
DetallePorta.belongsTo(Giga, { foreignKey: 'gigas', as: 'giga' });
Giga.hasMany(DetallePorta, { foreignKey: 'gigas', as: 'detallesPorta' });

// DetallePorta - Compania
DetallePorta.belongsTo(Compania, { foreignKey: 'compania', as: 'companiaAsociada' });
Compania.hasMany(DetallePorta, { foreignKey: 'compania', as: 'detallesPorta' });

// TelefonoPrincipal - Cliente
TelefonoPrincipal.belongsTo(Cliente, { foreignKey: ['tipo_documento', 'numero_documento'], as: 'cliente' });
Cliente.hasMany(TelefonoPrincipal, { foreignKey: ['tipo_documento', 'numero_documento'], as: 'telefonosPrincipales' });

// Usuario - Empleado
Usuario.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
Empleado.hasOne(Usuario, { foreignKey: 'id_empleado', as: 'usuario' });

// Exportar todos los modelos
export default {
  Abono,
  Barrio,
  Cliente,
  Compania,
  DatosServiciosConvergencias,
  DetalleBaf,
  DetallePorta,
  Domicilio,
  Empleado,
  Giga,
  OrigenDato,
  Rol,
  TelefonoPrincipal,
  TipoConvergencia,
  TipoDocumento,
  TipoDomicilio,
  TipoNegocio,
  Usuario,
  Venta
};
