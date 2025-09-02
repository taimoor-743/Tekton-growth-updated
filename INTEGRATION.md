# n8n Integration Guide

## API Contracts

### Frontend → n8n (Input Webhook POST)

```json
{
  "id": "uuid",
  "businessDetails": "Business description and requirements...",
  "websiteStructure": "Home, About, Services, Contact",
  "callbackUrl": "https://app/api/callback"
}
```

### n8n → App (Callback POST)

**Success Response:**
```json
{
  "id": "uuid",
  "outputLink": "https://drive.google.com/..."
}
```

**Error Response:**
```json
{
  "id": "uuid",
  "error": "Reason for failure..."
}
```

## n8n Workflow Outline

1. **Webhook Trigger** - Receives the input payload
2. **LLM Agent** - Processes business details and website structure
3. **Generate Google Doc(s)** - Creates content based on requirements
4. **Upload to Drive** - Saves documents to Google Drive
5. **Get Folder Link** - Retrieves shareable link
6. **HTTP Request** - POSTs result to callbackUrl

## Environment Variables

Add to your `.env.local`:

```
NEXT_PUBLIC_APP_URL=https://tekton-words.netlify.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_INPUT_WEBHOOK_URL=your_n8n_webhook_url
```

## Testing

1. Start the Next.js app: `npm run dev`
2. Fill out the form and click "Generate"
3. Check the callback URL displayed in the UI
4. Use this URL in your n8n workflow
5. Monitor the History page for status updates
