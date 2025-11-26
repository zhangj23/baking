const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Get presigned URL for upload (admin)
router.post('/presigned-url', authenticateAdmin, async (req, res) => {
  try {
    const { fileType, fileName } = req.body;

    if (!fileType || !fileName) {
      return res.status(400).json({ error: 'File type and name are required' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type. Allowed: jpeg, png, webp, gif' });
    }

    // Generate unique file name
    const ext = fileName.split('.').pop();
    const key = `products/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

    // Construct the public URL (assuming bucket is configured for public read)
    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    res.json({
      presignedUrl,
      publicUrl,
      key
    });
  } catch (err) {
    console.error('Get presigned URL error:', err);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

module.exports = router;


