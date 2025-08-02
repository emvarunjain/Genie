# Genie - Your Intelligent AI Assistant

A modern, open-source AI assistant platform with a sophisticated chat interface, admin portal, and comprehensive configuration management. Genie brings the power of AI to your fingertips with beautiful animations and intuitive design.

## ✨ Features

- 🎭 **Genie AI Assistant**: Intelligent chat interface with markdown support and syntax highlighting
- 🔐 **Secure Authentication**: JWT-based authentication with user registration and login
- 👨‍💼 **Admin Portal**: Comprehensive admin interface for system management
- 📁 **File Upload System**: Support for PDF, Word documents, text files, and more
- ⚙️ **Runtime Configuration**: Dynamic configuration management with validation
- 🚀 **Production Ready**: Docker support, Kubernetes deployment, and health checks
- 📱 **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- 🔄 **Asynchronous Operations**: Non-blocking API calls and real-time updates
- 🌐 **Apache Integration**: One-click Apache deployment with virtual host configuration
- ✨ **Beautiful Animations**: Smooth transitions and delightful user interactions

## 🎨 Design & Animations

Genie features a modern, animated interface with:
- **Floating blob animations** in the background
- **Smooth fade-in effects** for content loading
- **Hover lift effects** for interactive elements
- **Success animations** for login/registration
- **Loading spinners** and progress indicators
- **Gradient text effects** and modern color schemes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: JWT with bcryptjs
- **File Upload**: React Dropzone with Multer
- **Markdown**: React Markdown with syntax highlighting
- **Deployment**: Docker, Docker Compose, Kubernetes, Apache

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (optional)
- Apache (for Apache deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd genie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the application**
   ```bash
   # Copy environment file
   cp env.example .env.local
   
   # Edit configuration file
   nano config/app.config.json
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Configuration

The application uses a JSON configuration file located at `config/app.config.json`:

```json
{
  "app": {
    "name": "Genie",
    "version": "1.0.0",
    "description": "Your intelligent AI assistant powered by Genie"
  },
  "server": {
    "hostname": "localhost",
    "port": 3000,
    "protocol": "http"
  }
}
```

### Default Admin Account

The system comes with a default admin account:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@agno.com

⚠️ **Important**: Change these credentials in production!

## 🌐 Apache Deployment (One-Click)

### Quick Start with Apache

1. **Make scripts executable** (if not already done)
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Start the application with Apache**
   ```bash
   ./scripts/start-apache.sh
   ```

3. **Stop the application**
   ```bash
   ./scripts/stop-apache.sh
   ```

4. **Restart the application**
   ```bash
   ./scripts/restart-apache.sh
   ```

### Apache Configuration

The start script automatically:
- Creates Apache virtual host configuration
- Enables the site
- Reloads Apache configuration
- Sets up proxy forwarding

The application will be accessible at the configured hostname (default: localhost).

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **For production with Nginx**
   ```bash
   docker-compose --profile production up -d
   ```

### Manual Docker Build

1. **Build the image**
   ```bash
   docker build -t genie .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name genie \
     -p 3000:3000 \
     -e JWT_SECRET=your-secret-key \
     -e NEXT_PUBLIC_API_BASE_URL=http://your-api-server:8000 \
     -v $(pwd)/uploads:/app/uploads \
     genie
   ```

## ☸️ Kubernetes Deployment

1. **Apply the Kubernetes configuration**
   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```

2. **Check deployment status**
   ```bash
   kubectl get pods -l app=genie
   kubectl get services -l app=genie
   ```

## 🔌 API Integration

The application is designed to work with the Genie AI Server API and includes all endpoints from the API documentation.

### Available API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Chat & Agents
- `POST /api/ask` - Send chat messages
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent (Admin only)
- `GET /api/agents/status` - Get agents status

#### Admin Functions
- `GET /api/admin/config` - Get system configuration
- `POST /api/admin/config` - Update system configuration
- `POST /api/admin/upload` - Upload knowledge base files
- `POST /api/admin/knowledge` - Add knowledge source
- `GET /api/admin/users` - List all users (Admin only)

#### User Functions
- `GET /api/user/history` - Get user's question history

#### System
- `GET /api/health` - Health check endpoint
- `GET /api/info` - API information and status
- `GET /` - Root endpoint with API information

### API Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## ⚙️ Configuration Management

The admin portal provides comprehensive configuration management:

### Server Configuration
- Hostname and port settings
- Protocol configuration
- Server URL management

### API Configuration
- Base URL configuration
- Timeout settings
- Retry policies

### Feature Toggles
- Chat functionality
- File upload settings
- Admin features

### Security Settings
- JWT secret management
- Session timeout
- Rate limiting

### UI Settings
- Theme configuration
- Language settings
- Timezone preferences

## 📁 File Upload Support

The system supports various file formats for knowledge base uploads:

- **Documents**: PDF, DOC, DOCX
- **Text Files**: TXT, CSV, JSON
- **Size Limit**: Configurable (default: 10MB)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

## ⚡ Performance Optimizations

- Next.js standalone output
- Docker multi-stage builds
- Image optimization
- Code splitting
- Lazy loading

## 📊 Monitoring and Health Checks

- Built-in health check endpoint (`/api/health`)
- Docker health checks
- Kubernetes liveness/readiness probes
- Application metrics

## 🛠️ Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── chat/           # Chat interface
│   ├── login/          # Authentication pages
│   └── register/
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── chat/          # Chat interface components
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
└── lib/               # Utility libraries
config/
├── app.config.json    # Application configuration
scripts/
├── start-apache.sh    # Apache start script
├── stop-apache.sh     # Apache stop script
└── restart-apache.sh  # Apache restart script
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `./scripts/start-apache.sh` - Start with Apache
- `./scripts/stop-apache.sh` - Stop application
- `./scripts/restart-apache.sh` - Restart application

## 🔧 Troubleshooting

### Common Issues

1. **Login Error**: Ensure the admin user is properly initialized
2. **Port Already in Use**: Change the port in `config/app.config.json`
3. **Apache Issues**: Check Apache logs and ensure mod_proxy is enabled
4. **Configuration Issues**: Verify `config/app.config.json` syntax

### Health Check

The application provides a health check endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-19T20:25:10.300Z",
  "uptime": 2.650966042,
  "environment": "production",
  "version": "1.0.0"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API documentation

## 🗺️ Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced file processing
- [ ] User roles and permissions
- [ ] Audit logging
- [ ] Backup and restore functionality

---

**🎭 Genie - Your Intelligent AI Assistant**  
*Powered by modern technology, designed for the future.*