# Cloudinary Upload Preset Setup Guide

## Step 1: Create Upload Preset in Cloudinary

1. Go to https://cloudinary.com/console
2. Navigate to **Settings** (gear icon, bottom left)
3. Go to **Upload** tab
4. Scroll down to **Upload presets** section
5. Click **Add upload preset**

## Step 2: Configure Upload Preset

### Basic Settings:

- **Preset name**: `purifier-store-upload`
- **Signing Mode**: Unsigned (for unsigned uploads from frontend)

### Upload Settings:

- **Folder**: `Purifier_Store` (this is the base folder)
  - Subfolders (water-purifiers, air-purifiers) will be added by code
- **Quality**: 80
- **Format**: Auto

### Allowed formats:

- ✓ JPEG
- ✓ PNG
- ✓ WebP

### Transformations (Optional but Recommended):

- **Width**: 1200 (max width)
- **Quality**: auto
- **Fetch format**: auto

### File size:

- **Max file size**: 5000000 bytes (5 MB)

## Step 3: Copy Upload Preset Name

After creating, copy the preset name and add to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=purifier-store-upload
```

## Step 4: Get Your Cloud Name

Your cloud name is already in `.env.local`: `dw7r0o`

You can verify it at: https://cloudinary.com/console/settings/account

## Folder Structure Created Automatically

Once you set up the preset and upload, images will be organized:

```
Purifier_Store/
├── water-purifiers/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── air-purifiers/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── reviews/
    └── ...
```

## URL Format

After uploading, your Cloudinary image URLs will look like:

```
https://res.cloudinary.com/dw7r0o/image/upload/w_1200,q_auto,f_auto/Purifier_Store/water-purifiers/product-name.jpg
```

## How It Works in Your App

1. Admin goes to Product Form
2. Clicks "Upload or Replace Image"
3. Selects image from computer
4. Image is automatically uploaded to Cloudinary
5. URL is saved to database in `imageURL` field
6. Image is displayed in product

## Fetching Workflow (No Changes Needed!)

Your existing code remains the same:

```typescript
// Before (GitHub URLs):
imageURL: "https://raw.githubusercontent.com/..."

// After (Cloudinary URLs - same field):
imageURL: "https://res.cloudinary.com/dw7r0o/image/upload/..."

// Your code just reads imageURL - no changes needed!
<Image src={product.imageURL} />
```

## Troubleshooting

### Upload fails with "Preset not found"

- Make sure preset name matches exactly in `.env.local`
- Preset must be set to "Unsigned"
- Reload page after adding preset

### Images not showing

- Check Cloudinary console to see if image uploaded
- Verify URL in database is correct
- Check browser console for 404 errors

### Wrong folder structure

- Make sure preset has Folder set to `Purifier_Store`
- Code will append `/water-purifiers` or `/air-purifiers` automatically

## Environment Variables Checklist

```env
✓ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dw7r0o
✓ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=purifier-store-upload (your preset name)
⚠ CLOUDINARY_API_KEY (optional, only for server-side operations)
⚠ CLOUDINARY_API_SECRET (optional, only for server-side operations)
```

## Next Steps

1. Create upload preset in Cloudinary (5 minutes)
2. Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to `.env.local`
3. Restart dev server: `npm run dev`
4. Go to Admin → Add Product
5. Try uploading an image!

Done! 🎉
