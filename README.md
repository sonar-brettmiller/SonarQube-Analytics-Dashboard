# SonarQube Analytics Dashboard

A modern, responsive React dashboard for visualizing SonarQube Cloud metrics and project health data. Built with Material-UI and TypeScript for a professional, enterprise-ready interface.

## Features

- 📊 **Real-time Metrics**: Live data from SonarQube Cloud API
- 🎨 **Modern UI**: Clean, responsive design with Material-UI components
- 🔍 **Project Overview**: Comprehensive project health visualization
- 📈 **Quality Gates**: Visual representation of quality gate status
- 🐛 **Issue Tracking**: Bugs, vulnerabilities, code smells, and security hotspots
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔧 **Debug Tools**: Built-in debugging and testing utilities

## Screenshots

### Dashboard Overview
- Key metrics cards showing coverage, bugs, vulnerabilities, and code smells
- Quality gate status visualization
- Project list with individual metrics

### Navigation
- Clean navigation bar with access to all features
- Mobile-responsive hamburger menu
- Active page highlighting

## Tech Stack

- **Frontend**: React 19, TypeScript, Material-UI v7
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts, MUI X Charts
- **Styling**: Emotion (CSS-in-JS)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SonarQube Cloud account with API token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sonarqube-analytics-dashboard.git
cd sonarqube-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure your SonarQube Cloud API token:
   - Open `src/contexts/SonarQubeContext.tsx`
   - Replace the hardcoded token with your own SonarQube Cloud API token
   - Update the organization name if needed

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Configuration

#### SonarQube Cloud Setup

1. Go to [SonarQube Cloud](https://sonarcloud.io)
2. Create an account or sign in
3. Generate an API token:
   - Go to User Account → Security → Generate Tokens
   - Copy the generated token
4. Update the token in `src/contexts/SonarQubeContext.tsx`

#### Organization Configuration

Update the organization name in `src/services/sonarqubeApi.ts`:
```typescript
constructor(token: string, organization: string = 'your-organization') {
```

## Project Structure

```
src/
├── components/          # React components
│   ├── NavBar.tsx      # Navigation bar
│   ├── SimpleDashboard.tsx  # Main dashboard
│   ├── TestConnection.tsx   # Connection testing
│   ├── ProjectDebug.tsx     # Project debugging
│   ├── ApiDebug.tsx         # API debugging
│   └── SimpleApiTest.tsx    # Simple API testing
├── contexts/           # React contexts
│   └── SonarQubeContext.tsx  # SonarQube API context
├── services/           # API services
│   └── sonarqubeApi.ts      # SonarQube API service
├── types/              # TypeScript type definitions
│   └── sonarqube.ts         # SonarQube API types
└── App.tsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

The dashboard integrates with SonarQube Cloud API:

- **Projects**: `/api/projects/search`
- **Measures**: `/api/measures/component`
- **Quality Gates**: `/api/qualitygates/project_status`
- **Issues**: `/api/issues/search`

## Debugging Tools

The application includes several debugging utilities:

- **Test Connection**: Verify API connectivity
- **Debug Projects**: Inspect project data
- **API Debug**: Direct API testing console
- **Simple Test**: Quick API validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SonarQube](https://www.sonarqube.org/) for the amazing code quality platform
- [Material-UI](https://mui.com/) for the beautiful React components
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the amazing frontend framework

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/sonarqube-analytics-dashboard/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

Made with ❤️ for the SonarQube community