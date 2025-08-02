# Agno Financial Analysis Server

A production-grade REST API server for financial analysis and AI agent management, built with FastAPI and Agno framework.

## Features

- **User Authentication**: Secure JWT-based authentication with user registration and login
- **Admin Portal**: Admin interface for system management and configuration
- **Agent Management**: Create and manage multiple AI agents at runtime
- **Financial Analysis**: Specialized agents for stock market and economic analysis
- **Knowledge Management**: Support for PDF, URL, and database knowledge sources
- **Horizontal Scaling**: Docker and Kubernetes ready for production deployment
- **Session Management**: Redis-based session storage with user behavior tracking
- **Error Logging**: Comprehensive error tracking and logging system
- **Web Access Control**: Admin can enable/disable external web access for agents

## Architecture

- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Cache/Sessions**: Redis
- **AI Framework**: Agno with Ollama models
- **Containerization**: Docker with multi-stage builds  
- **Orchestration**: Kubernetes with horizontal pod autoscaling
- **Web Server**: Nginx/Apache with SSL termination

## Quick Start

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- Redis server
- Ollama (for local AI models)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agno-server
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

4. **Start Ollama and pull models**
   ```bash
   ollama serve
   ollama pull mistral
   ollama pull mxbai-embed-large
   ```

5. **Run the application**
   ```bash
   python start_server.py
   ```

The server will be available at `http://localhost:8000`

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - API: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password123"
}

Response:
{
    "message": "User registered successfully",
    "username": "john_doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "secure_password123"
}

Response:
{
    "access_token": "eyJhbGciOiJIUzI1...",
    "token_type": "bearer"
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
    "message": "Logged out successfully"
}
```

### Chat

#### Ask Question
```http
POST /api/ask
Authorization: Bearer <token>
Content-Type: application/json

{
    "message": "What can you help me with?"
}

Response:
{
    "response": "I can help you with...",
    "timestamp": "2025-06-20T03:39:39.123456"
}
```

### Agents

#### List Agents
```http
GET /api/agents
Authorization: Bearer <token>

Response:
[
    {
        "name": "Genie",
        "description": "A helpful AI agent that can answer questions and help with various tasks.",
        "model_id": "gpt-4",
        "tools": ["duckduckgo"]
    }
]
```

#### Create Agent (Admin only)
```http
POST /api/agents
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "MarketAnalyst",
    "description": "Specialized market analysis agent",
    "model_id": "mistral",
    "instructions": [
        "You are a market analysis expert",
        "Focus on technical and fundamental analysis"
    ],
    "knowledge_sources": [],
    "tools": ["yfinance", "duckduckgo"]
}

Response:
{
    "message": "Agent created successfully",
    "name": "MarketAnalyst"
}
```

### User History

#### Get User Question History
```http
GET /api/user/history
Authorization: Bearer <token>

Response:
[
    {
        "question": "What can you help me with?",
        "answer": "I can help you with...",
        "agent_used": "Genie",
        "timestamp": "2025-06-20T03:39:39.123456",
        "success": true
    }
]
```

### Admin

#### Get System Configuration
```http
GET /api/admin/config
Authorization: Bearer <token>

Response:
{
    "web_access_enabled": true,
    "max_agents_per_user": 5,
    "session_timeout_minutes": 30
}
```

#### Update System Configuration
```http
POST /api/admin/config
Authorization: Bearer <token>
Content-Type: application/json

{
    "web_access_enabled": true,
    "max_agents_per_user": 5,
    "session_timeout_minutes": 30
}

Response:
{
    "message": "Configuration updated successfully"
}
```

#### Add Knowledge Source
```http
POST /api/admin/knowledge
Authorization: Bearer <token>
Content-Type: application/json

{
    "source_type": "url",
    "source_data": "https://example.com/docs",
    "description": "Documentation for financial analysis"
}

Response:
{
    "message": "Knowledge source added successfully"
}
```

#### List Users
```http
GET /api/admin/users
Authorization: Bearer <token>

Response:
[
    {
        "username": "john_doe",
        "email": "john@example.com",
        "is_admin": false,
        "is_active": true,
        "created_at": "2025-06-20T03:39:39.123456"
    }
]
```

### Health and Info

#### Health Check
```http
GET /api/health

Response:
{
    "status": "healthy",
    "timestamp": "2025-06-20T03:39:39.123456"
}
```

#### API Info
```http
GET /api/info

Response:
{
    "title": "Genie - AI Assistant Platform",
    "version": "1.0.0",
    "description": "A powerful AI platform with multi-agent support"
}
```

### Notes

- All endpoints except `/api/auth/register`, `/api/auth/login`, `/api/health`, and `/api/info` require authentication
- Authentication is done via JWT tokens in the `Authorization` header
- Admin endpoints require an admin user token
- All timestamps are in ISO 8601 format
- All responses use JSON format
- Error responses follow the format:
  ```json
  {
      "detail": "Error message"
  }
  ```

## Default Credentials

- **Admin User**: `admin` / `admin123`
- **Default Agent**: `FinancialAnalyst`

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- Helm (optional)

### Deploy to Kubernetes

1. **Build and push Docker image**
   ```bash
   docker build -t agno-server:latest .
   docker tag agno-server:latest your-registry/agno-server:latest
   docker push your-registry/agno-server:latest
   ```

2. **Update image in deployment.yaml**
   ```yaml
   image: your-registry/agno-server:latest
   ```

3. **Deploy to cluster**
   ```bash
   kubectl apply -f kubernetes/
   ```

4. **Check deployment status**
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

### Scaling

The deployment includes HorizontalPodAutoscaler that automatically scales based on CPU and memory usage:

```bash
kubectl get hpa
kubectl describe hpa agno-hpa
```

## Configuration

### Environment Variables

- `SECRET_KEY`: JWT secret key (required)
- `REDIS_HOST`: Redis server host (default: localhost)
- `REDIS_PORT`: Redis server port (default: 6379)
- `DATABASE_URL`: Database connection string
- `LOG_LEVEL`: Logging level (default: INFO)

### System Configuration

Admins can configure system settings via API:

```json
{
  "web_access_enabled": true,
  "max_agents_per_user": 5,
  "session_timeout_minutes": 30
}
```

## Financial Analysis Features

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

## Agent Management

### Creating New Agents

```bash
curl -X POST "http://localhost:8000/api/agents" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MarketAnalyst",
    "description": "Specialized market analysis agent",
    "model_id": "mistral",
    "instructions": [
      "You are a market analysis expert",
      "Focus on technical and fundamental analysis"
    ],
    "knowledge_sources": [
      "https://www.nseindia.com/",
      "https://www.bseindia.com/"
    ],
    "tools": ["yfinance", "duckduckgo"]
  }'
```

### Agent Collaboration

Agents can work together in feedback loops:

1. **Primary Agent**: Handles main analysis
2. **Validation Agent**: Cross-checks results
3. **Specialist Agents**: Domain-specific analysis
4. **Synthesis Agent**: Combines insights

## Monitoring and Logging

### Health Checks
- Application health: `/api/health`
- Database connectivity
- Redis connectivity
- Agent availability

### Metrics
- Request/response times
- Error rates
- Resource usage
- Agent performance

### Logs
- Structured logging with structlog
- Request/response logging
- Error tracking
- Performance metrics

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- SQL injection protection
- Rate limiting (configurable)

## Production Deployment

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName agno.yourdomain.com
    Redirect permanent / https://agno.yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName agno.yourdomain.com
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:8000/
    ProxyPassReverse / http://localhost:8000/
    
    ErrorLog ${APACHE_LOG_DIR}/agno_error.log
    CustomLog ${APACHE_LOG_DIR}/agno_access.log combined
</VirtualHost>
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name agno.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name agno.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

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

### Logs Location

- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation at `/docs`
- Review the API documentation at `/redoc` 