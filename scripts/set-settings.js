const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load service account
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setSettings() {
  try {
    const settings = {
      siteName: '마이 AI 스튜디오',
      contactEmail: 'ccv5@naver.com',
      contactPhone: '1588-0000',
      logoUrl: '/logo.png',
      paymentMethods: {
        card: true,
        bank: true,
        kakao: false,
        toss: true
      },
      adminNotifications: {
        newOrder: true,
        newUser: true,
        inquiry: true
      }
    };

    await db.collection('admin').doc('settings').set(settings);
    console.log('Settings saved successfully!');
    console.log('Site Name:', settings.siteName);
    console.log('Contact Email:', settings.contactEmail);
    console.log('Logo URL:', settings.logoUrl);

    process.exit(0);
  } catch (error) {
    console.error('Error saving settings:', error);
    process.exit(1);
  }
}

setSettings();
