# AI Product Enhancement Setup Guide

## Overview

This implementation adds AI-powered optimization for product descriptions and keywords using Google's Gemini API.

## Files Created/Modified

### New Files:

1. **`app/api/ai/enhance/route.ts`** - AI API endpoint
2. **`hooks/use-ai-enhance.ts`** - React hook for AI enhancement
3. **`.env.local`** - Environment variables (updated)

### Modified Files:

1. **`components/admin/product-form.tsx`** - Added AI enhancement buttons

## Setup Instructions

### Step 1: Get Your Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

### Step 2: Add API Key to Environment

1. Open `.env.local` in your project root
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Verify Installation

The package `@google/generative-ai` is already installed. Verify with:

```bash
pnpm list @google/generative-ai
```

### Step 4: Test the Feature

1. Start your dev server: `pnpm dev`
2. Go to Admin → Product Management
3. Fill in Product Name, Category, and Description
4. Click **"✨ AI Enhance Description"** or **"✨ AI Generate Keywords"**
5. Review the AI-generated content and adjust as needed

## How It Works

### AI Enhancement Workflow:

1. **User Input**: Product Title, Category, and Description
2. **API Call**: Sends data to `/api/ai/enhance`
3. **Gemini Processing**: AI generates optimized content
4. **User Review**: Results appear in the form for review
5. **Publish**: User can edit and save as needed

### Description Enhancement:

- Generates 150-200 word optimized description
- Includes relevant SEO keywords naturally
- Highlights benefits and features
- Professional, persuasive tone

### Keyword Generation:

- Creates 8-12 relevant SEO keywords
- High search volume potential
- Mix of broad and long-tail keywords
- Automatically added as tags (with commas)

## API Endpoint

**POST** `/api/api/enhance`

### Request Body:

```json
{
  "title": "Product Name",
  "category": "water-purifier|air-purifier",
  "description": "Product description",
  "type": "description|keywords"
}
```

### Response:

```json
{
  "success": true,
  "type": "description|keywords",
  "content": "Generated content here"
}
```

### Error Response:

```json
{
  "error": "Error message"
}
```

## Features

✅ One-click AI enhancement for descriptions
✅ One-click AI keyword generation
✅ User review before publishing
✅ Error handling and feedback
✅ Loading states during processing
✅ API key validation

## Troubleshooting

### "Gemini API key is not configured"

- Make sure `.env.local` has `GEMINI_API_KEY` set
- Restart your dev server after adding the key

### "Failed to enhance content"

- Check your API key is correct
- Ensure you have Gemini API enabled in Google Cloud Console
- Check API rate limits

### Buttons Disabled

- Make sure Product Name, Category, and Description are filled
- Buttons require all three fields to enable

## Cost Consideration

Gemini API has free tier limits. Monitor your usage at https://aistudio.google.com/app/apikey

## Next Steps

- Customize the AI prompts in `app/api/ai/enhance/route.ts`
- Add more content types (product features, specifications)
- Implement batch processing for multiple products
- Add analytics for AI enhancement usage
