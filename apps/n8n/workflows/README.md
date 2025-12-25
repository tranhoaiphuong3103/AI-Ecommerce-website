# n8n Workflows

This directory contains n8n workflow templates for the e-commerce platform.

## Available Workflows

### 1. Virtual Try-On Video Generation (`video-generation-workflow.json`)

This workflow handles the complete video generation process:

1. **Webhook Trigger**: Receives requests from the Next.js app
2. **Data Extraction**: Extracts user measurements and product details
3. **ComfyUI Integration**: Calls ComfyUI API to generate the video using AnimateDiff
4. **Status Updates**: Updates database status to PROCESSING
5. **Video Download**: Retrieves the generated video from ComfyUI
6. **MinIO Upload**: Stores the video in MinIO S3-compatible storage
7. **Database Update**: Updates the video URL and status to COMPLETED
8. **Email Notification**: Sends email to user (via Mailhog in development)

### How to Import Workflows

1. Start the Docker containers: `docker-compose up -d`
2. Access n8n at http://localhost:5678
3. Login with credentials (admin / admin123)
4. Go to Workflows > Import from File
5. Select the workflow JSON file
6. Configure credentials:
   - PostgreSQL: Host=postgres, Port=5432, DB=ecommerce, User=postgres, Password=postgres
   - SMTP (Mailhog): Host=mailhog, Port=1025, No auth required

### Additional Workflow Ideas

You can create more workflows for:

- **Order Processing**: Auto-send confirmation emails, update inventory
- **Abandoned Cart**: Send reminder emails after 24/48/72 hours
- **Product Recommendations**: Analyze user behavior and send personalized suggestions
- **Inventory Management**: Alert when stock is low, auto-reorder from suppliers
- **Customer Support**: Auto-categorize tickets, route to appropriate team members
- **Marketing Campaigns**: Schedule promotional emails, social media posts

### Creating Custom Workflows

n8n provides a visual workflow builder. To create custom workflows:

1. Access n8n dashboard at http://localhost:5678
2. Click "Add workflow"
3. Drag and drop nodes from the left panel
4. Configure each node's parameters
5. Connect nodes to define the flow
6. Test with sample data
7. Activate the workflow

### Webhook URLs

After importing workflows, note the webhook URLs:

- Video Generation: `http://localhost:8080/webhook/generate-video`

Update your `.env.local` file with:
```
N8N_WEBHOOK_URL=http://localhost:8080/webhook/generate-video
```
