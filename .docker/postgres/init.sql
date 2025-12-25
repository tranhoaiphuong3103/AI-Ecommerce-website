-- Create n8n database for workflow storage
CREATE DATABASE n8n;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO postgres;
GRANT ALL PRIVILEGES ON DATABASE n8n TO postgres;

-- Enable UUID extension for the ecommerce database
\c ecommerce;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable UUID extension for n8n database
\c n8n;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
