import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
         label: 'Trabajo',
         isTitle: true
    },
    {
        id: 12,
        label: 'Dashboard',
        icon: 'uil-home',
        link: '/',
    },
    {
         id: 2,
         label: 'Dispositivos',
         icon: 'uil-document-layout-left',
         link: '/dispositivos/lista-dispositivos',
    },
    {
        id: 10,
        label: 'BlueVox',
        icon: 'uil-bag-alt',
        link: '/bluevox/lista-bluevox',
    },
    {
        id: 3,
        label: 'Vehiculos',
        icon: 'uil-car',
        link: '/vehiculos/lista-vehiculos',
    },
    {
        id: 4,
        label: 'Operadores',
        icon: 'uil-users-alt',
        link: '/operadores/lista-operadores',
    },
    {
        id: 5,
        label: 'Monederos',
        icon: 'uil-moneybag-alt',
        link: '/monederos/lista-monederos',
    },
    {
        id: 6,
        label: 'Pasajeros',
        icon: 'uil-user-circle',
        link: '/pasajeros/lista-pasajeros',
    },
    {
        id: 9,
        label: 'Rutas',
        icon: 'uil-arrows-right-down',
        link: '/rutas/lista-rutas',
    },
    {
        id: 11,
        label: 'Monitoreo',
        icon: 'uil-map',
        link: '/monitoreo',
    },
    {
        id: 7,
        label: 'Transacciones',
        icon: 'uil-refresh',
        link: '/transacciones/lista-transacciones',
    },
    {
        id: 8,
        label: 'Bitacora',
        icon: 'uil-list-ul',
        link: '/bitacora/lista-bitacora',
    },
    {
        id: 13, //Continua el id 14
        label: 'Perfil',
        icon: 'uil-user-circle',
        link: '/contacts/profile',
    },
    {
        id: 115,
        label: 'MENUITEMS.PRUEBACOMPONENTCERRAR.TEXT',
        isTitle: true
    },
    {
        id: 116,
        label: 'MENUITEMS.PRUEBACUATROSESION.TEXT',
        icon: 'uil-list-ul',
        link: '/account/login',
    },
];

