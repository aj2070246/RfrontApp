const fs = require('fs');
const path = require('path');
const axios = require('axios');

const STATIC_DIR = "F:/CodeRepository/R/Front/RfrontApp/src/StaticPages";
const usersData = require(path.join(STATIC_DIR, 'users.json'));
const photosDir = path.join(STATIC_DIR, 'profile_photos');

const generateProfilePhotos = async () => {
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  for (const user of usersData.data.model) {
    try {
      const response = await axios.get(`http://localhost:5000/Connection/GetUserProfilePhoto/${user.id}`, { responseType: 'arraybuffer' });
      fs.writeFileSync(path.join(photosDir, `${user.id}.jpg`), Buffer.from(response.data));
    } catch (err) {
      console.error(`Failed to fetch photo for user ${user.id}: ${err.message}`);
    }
  }

  // کپی یه عکس پیش‌فرض
  fs.copyFileSync('path/to/default_avatar.jpg', path.join(STATIC_DIR, 'default_avatar.jpg'));
  console.log('Profile photos generated.');
};

generateProfilePhotos().catch(err => console.error(err));