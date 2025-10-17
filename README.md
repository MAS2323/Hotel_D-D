# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

src/
├── components/
│ ├── common/
│ │ ├── Header.jsx
│ │ └── Footer.jsx
│ ├── ui/
│ │ └── RoomCard.jsx # Reutilizable
│ └── forms/
│ └── BookingForm.jsx
├── contexts/
│ └── AuthContext.jsx # Estado global para auth
├── pages/
│ ├── public/
│ │ ├── Home.jsx
│ │ ├── Rooms.jsx
│ │ ├── About.jsx
│ │ ├── Contact.jsx
│ │ └── Booking.jsx
│ └── admin/
│ ├── Dashboard.jsx # Admin principal
│ ├── ManageRooms.jsx # CRUD habitaciones
│ └── ManageBookings.jsx # Ver/editar reservas
├── services/
│ └── api.js # Llamadas a Django API
├── hooks/
│ └── useAuth.js # Hook para auth
├── App.jsx
├── main.jsx
├── index.css
└── assets/
