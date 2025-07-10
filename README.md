# FRONTEND_MONITORAMENTO – Solar Plant Monitoring Interface

This is the frontend of a full-stack solar plant monitoring platform, built with React and TypeScript. It allows users to track energy generation, system performance, and technical data in real time, through integration with a FastAPI backend.

## Features

- Login and authentication using JWT
- Dashboard with daily, 7-day, and 30-day performance summaries
- Detailed plant view with power curves, alarms, and technical data per string/MPPT
- PDF report generation for each plant
- Multi-tenant architecture (each client accesses only their own plants)
- Responsive layout (desktop/mobile)
- API integration with solar inverter platforms (Sungrow, Deye, Huawei)

## Tech Stack

- React 18
- TypeScript
- Vite
- Recharts
- ShadCN UI (Tailwind CSS)
- Axios
- React Router DOM
- LocalStorage (JWT)
- Custom Hooks (e.g., `useToast`, `useMobile`)

## Project Structure

frontend_monitoramento/
├── src/
│ ├── components/ # Reusable UI elements and charts
│ ├── pages/ # Dashboard, Plants, Reports, Login, etc.
│ ├── services/ # API integration (e.g., usinaService.ts)
│ ├── hooks/ # Custom React hooks
│ ├── App.tsx # Main router
│ └── main.tsx # Entry point
├── public/
├── index.html
└── vite.config.ts

bash
Copiar
Editar

## Environment Variables

Create a `.env` file with your backend URL:

```env
VITE_API_URL=https://backendmonitoramento-production.up.railway.app
How to Run Locally
bash
Copiar
Editar
# Clone the repository
git clone https://github.com/rafamrn/frontend_solareye.git
cd frontend_monitoramento

# Install dependencies
npm install

# Start development server
npm run dev
API Integration
This frontend communicates with a FastAPI backend using secure JWT-based authentication. Tokens are stored in localStorage and sent with each request via Authorization header.

Key API endpoints used:

GET /usina – list all plants for the authenticated user

GET /performance_diaria, /performance_7dias, /performance_30dias

GET /geracao_diaria – fetch current day's energy generation

POST /projecoes/salvar_e_recalcular – submit monthly projections and recalculate performance

POST /integracoes/ – manage platform credentials (e.g., Sungrow, Deye)

Notes
The frontend is modular and scalable, with separation of concerns between UI, services, and state

Designed to work with multi-client environments (admin/client separation)

Uses token-based route protection and auto redirection on session expiration

License
This project is for educational and demonstration purposes only.
Feel free to fork, contribute, or reach out via LinkedIn if you'd like to collaborate.