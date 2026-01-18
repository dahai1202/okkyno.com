// Netlify Function Handler using ES modules
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../../server/routes'; // Import routes
import { log } from '../../server/log';

// Create Express app for Netlify Functions
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
}));

// Request logging middleware
app.use((req, res, next) => {
  log(`${req.method} ${req.path}`);
  next();
});

// Promise that resolves when routes have been registered
const routesReady = (async () => {
  try {
    // Register routes
    await registerRoutes(app);

    // Fallback route for API
    app.use((req, res) => {
      log(`Route not found: ${req.method} ${req.path}`);
      res.status(404).json({ message: "API endpoint not found" });
    });

    // Error handler
    app.use((err, req, res, next) => {
      log(`Error: ${err.message}`, { stack: err.stack });
      res.status(500).json({ message: "Internal Server Error" });
    });
  } catch (error) {
    console.error("Failed to register routes:", error);
  }
})();

// Create serverless handler
const serverlessHandler = serverless(app);

// Export the handler function
export const handler = async (event, context) => {
  // Ensure routes are ready before handling the request
  await routesReady;

  log('Request received', {
    path: event.path,
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters
  });

  // Process the request through the serverless-http wrapper
  const result = await serverlessHandler(event, context);
  
  log('Response sent', { 
    statusCode: result.statusCode, 
    headers: result.headers 
  });
  
  return result;
};
