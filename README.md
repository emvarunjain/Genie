# 🎭 Genie - Your Intelligent AI Assistant

A modern, full-stack AI assistant platform with a sophisticated chat interface, admin portal, and comprehensive AI agent management. Genie brings the power of AI to your fingertips with beautiful animations, secure authentication, and production-ready deployment options.

## ✨ Features

### 🤖 AI & Chat
- **Intelligent AI Assistant**: Multi-agent system with specialized capabilities
- **Financial Analysis**: Specialized agents for stock market and economic analysis
- **Markdown Support**: Rich text formatting with syntax highlighting
- **Real-time Chat**: Smooth, responsive chat interface with typing indicators
- **Agent Management**: Create and manage multiple AI agents at runtime
- **Knowledge Base**: Support for PDF, URL, and database knowledge sources

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **User Registration**: Complete user management system
- **Admin Portal**: Comprehensive admin interface for system management
- **Role-based Access**: Admin and user role management
- **Session Management**: Redis-based session storage with user behavior tracking

### 🎨 User Interface
- **Modern Design**: Beautiful UI with Tailwind CSS and Radix UI components
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful Animations**: Floating blob animations, smooth transitions, and hover effects
- **Dark/Light Mode**: Theme support with modern color schemes
- **File Upload**: Drag-and-drop file upload with progress indicators

### 🚀 Production Ready
- **Docker Support**: Complete containerization with multi-stage builds
- **Kubernetes Deployment**: Production-ready K8s configurations
- **Apache Integration**: One-click Apache deployment with virtual host configuration
- **Health Monitoring**: Comprehensive health checks and monitoring
- **Horizontal Scaling**: Auto-scaling capabilities for high availability

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 18 and TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Context API
- **Authentication**: JWT with bcryptjs
- **File Upload**: React Dropzone with Multer
- **Markdown**: React Markdown with syntax highlighting

### Backend (FastAPI)
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Cache/Sessions**: Redis
- **AI Framework**: Agno with Ollama models
- **Authentication**: JWT with bcrypt
- **File Processing**: Support for PDF, DOC, DOCX, TXT, CSV

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with horizontal pod autoscaling
- **Web Server**: Nginx/Apache with SSL termination
- **Monitoring**: Built-in health checks and logging

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.11+**
- **Docker** and Docker Compose (optional)
- **Redis** server
- **Ollama** (for local AI models)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Genie
   ```

2. **Backend Setup**
   ```bash
   cd BackEnd
   pip install -r requirements.txt
   
   # Start Redis
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Start Ollama and pull models
   ollama serve
   ollama pull mistral
   ollama pull mxbai-embed-large
   
   # Run the backend server
   python server.py
   ```

3. **Frontend Setup**
   ```bash
   cd FrontEnd
   npm install
   
   # Copy environment file
   cp env.example .env.local
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Default Credentials

- **Admin User**: `admin` / `admin123`
- **Default Agent**: `FinancialAnalyst`

⚠️ **Important**: Change these credentials in production!

## 🐳 Docker Deployment

### Using Docker Compose

1. **Start both frontend and backend**
   ```bash
   # From the root directory
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Individual Services

#### Backend Only
```bash
cd BackEnd
docker-compose up -d
```

#### Frontend Only
```bash
cd FrontEnd
docker-compose up -d
```

## ☸️ Kubernetes Deployment

1. **Apply the Kubernetes configurations**
   ```bash
   kubectl apply -f BackEnd/kubernetes/
   kubectl apply -f FrontEnd/k8s-deployment.yaml
   ```

2. **Check deployment status**
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

## 🌐 Apache Deployment (One-Click)

### Quick Start with Apache

1. **Make scripts executable**
   ```bash
   chmod +x FrontEnd/scripts/*.sh
   ```

2. **Start the application with Apache**
   ```bash
   ./FrontEnd/scripts/start-apache.sh
   ```

3. **Stop the application**
   ```bash
   ./FrontEnd/scripts/stop-apache.sh
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat & Agents
- `POST /api/ask` - Send chat messages
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent (Admin only)
- `GET /api/agents/status` - Get agents status

### Admin Functions
- `GET /api/admin/config` - Get system configuration
- `POST /api/admin/config` - Update system configuration
- `POST /api/admin/upload` - Upload knowledge base files
- `POST /api/admin/knowledge` - Add knowledge source
- `GET /api/admin/users` - List all users (Admin only)

### User Functions
- `GET /api/user/history` - Get user's question history

### System
- `GET /api/health` - Health check endpoint
- `GET /api/info` - API information and status

## 🎯 Financial Analysis Features

The system includes specialized agents for:

- **Stock Market Analysis**: Real-time stock data and trends
- **Economic Indicators**: GDP, inflation, employment data
- **Global Markets**: International market correlations
- **Policy Impact**: Government policies and their market effects
- **Technical Analysis**: Chart patterns and indicators
- **Fundamental Analysis**: Company financials and ratios

### Sample Questions

- "What is the current market sentiment for Indian stocks?"
- "How will Fed rate changes affect emerging markets?"
- "Analyze the impact of crude oil prices on Indian economy"
- "What are the key factors affecting gold prices?"
- "Compare Indian and US market performance"

## ⚙️ Configuration

### Environment Variables

#### Backend
- `SECRET_KEY`: JWT secret key (required)
- `REDIS_HOST`: Redis server host (default: localhost)
- `REDIS_PORT`: Redis server port (default: 6379)
- `DATABASE_URL`: Database connection string
- `LOG_LEVEL`: Logging level (default: INFO)

#### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `JWT_SECRET`: JWT secret key
- `NEXTAUTH_SECRET`: NextAuth secret

### System Configuration

Admins can configure system settings via API:

```json
{
  "web_access_enabled": true,
  "max_agents_per_user": 5,
  "session_timeout_minutes": 30
}
```

## 🔧 Development

### Project Structure

```
Genie/
├── BackEnd/                 # FastAPI backend
│   ├── app/
│   │   ├── agents/         # AI agent definitions
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core configuration
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic
│   ├── kubernetes/        # K8s deployment configs
│   └── requirements.txt   # Python dependencies
├── FrontEnd/               # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utility libraries
│   ├── config/           # Configuration files
│   └── scripts/          # Deployment scripts
└── README.md             # This file
```

### Available Scripts

#### Backend
```bash
cd BackEnd
python server.py          # Start development server
pytest                    # Run tests
```

#### Frontend
```bash
cd FrontEnd
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
```

## 🔒 Security Features

- JWT-based authentication with bcrypt password hashing
- CORS configuration
- Input validation and sanitization
- SQL injection protection
- Rate limiting (configurable)
- XSS and CSRF protection
- Secure file upload handling

## 📊 Monitoring and Health Checks

- Built-in health check endpoints
- Docker health checks
- Kubernetes liveness/readiness probes
- Comprehensive logging with structlog
- Error tracking and performance metrics
- Request/response logging

## 🛠️ Troubleshooting

### Common Issues

1. **Redis Connection Error**
   - Check Redis server is running
   - Verify connection settings

2. **Agent Loading Failures**
   - Check Ollama is running
   - Verify model availability
   - Check knowledge source URLs

3. **Database Errors**
   - Verify database permissions
   - Check connection strings
   - Ensure tables are created

4. **Authentication Issues**
   - Verify JWT secret key
   - Check token expiration
   - Validate user credentials

### Health Check

Check application health:
```bash
# Backend
curl http://localhost:8000/api/health

# Frontend
curl http://localhost:3000/api/health
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
- Review the API documentation at `/docs`

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced file processing
- [ ] User roles and permissions
- [ ] Audit logging
- [ ] Backup and restore functionality
- [ ] WebSocket support for real-time chat
- [ ] Advanced agent collaboration features

---

**🎭 Genie - Your Intelligent AI Assistant**  
*Powered by modern technology, designed for the future.* 