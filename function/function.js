// tele: @xyroosoloooo
const axios = require('axios');
const fs = require('fs'); 
const fsp = require('fs').promises; 
const path = require('path');
const archiver = require('archiver');
const https = require('https');

const USERS_FILE = path.join(__dirname, '../users.json');

async function loadUsers() {
    try {
        const data = await fsp.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
} 

async function saveUsers(users) {
    try {
        await fsp.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.log('Error saveUsers:', error.message);
    }
}

function loadJSON(file) {
  try {
    if (!fs.existsSync(file)) return []
    const data = fs.readFileSync(file, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.log('Error loadJSON:', err)
    return []
  }
}

function saveJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  } catch (err) {
    console.log('Error saveJSON:', err)
  }
}

const apiClient = axios.create({
  timeout: 30000,
  httpsAgent: new https.Agent({ rejectUnauthorized: true, keepAlive: true }),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Origin': 'https://am.api888.dev',
    'Referer': 'https://am.api888.dev/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
  }
});

async function bypasscf() {
  try {
    const response = await axios.get("https://rafflie-ch-bypascf-rafz.hf.space/solve", {
      params: {
        url: "https://am.api888.dev",
        sitekey: "0x4AAAAAACLTsFnkWuzV5cB-"
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://rafflie-ch-bypascf-rafz.hf.space',
        'Referer': 'https://rafflie-ch-bypascf-rafz.hf.space/'
      }
    });

    console.log("Response solver:", JSON.stringify(response.data, null, 2));

    if (!response.data?.success || !response.data?.token) {
      throw new Error(`Token kosong: ${JSON.stringify(response.data)}`);
    }
    // Delay 2 detik biar token stabil
    await new Promise(r => setTimeout(r, 2000));
    return response.data.token;
  } catch (err) {
    console.error("Bypass error:", err.message);
    throw new Error('Bypass CF gagal: ' + err.message);
  }
}

async function verifyEmail(email) {
  try {
    const turnstileToken = await bypasscf();
    if (!turnstileToken) throw new Error('Token kosong');

    const response = await apiClient.post(
      'https://am.api888.dev/api/license/verify-email',
      { email, turnstileToken }
    );

    return response.data;
  } catch (err) {
    console.error("Verify error response:", err.response?.data || err.message);
    throw new Error('Gagal verifikasi email: ' + (err.response?.data?.message || err.message));
  }
}

async function activateLicense(email, oobCode) {
  try {
    const response = await apiClient.post(
      'https://am.api888.dev/api/license/activate',
      { email, oobCode }
    );
    return response.data;
  } catch (err) {
    throw new Error('Gagal aktivasi: ' + (err.response?.data?.message || err.message));
  }
}

function extractOobCode(input) {
  const match = input.match(/oobCode%3D([^%&]+)/);
  if (match) return match[1];
  const directMatch = input.match(/[A-Za-z0-9_-]{50,}/);
  if (directMatch) return directMatch[0];
  return input.trim();
}

async function createBackup() {
    return new Promise((resolve, reject) => {
        const backupPath = path.join(__dirname, '../backup.zip');
        const output = fs.createWriteStream(backupPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log('Backup selesai:', archive.pointer() + ' total bytes');
            resolve(backupPath);
        });

        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                console.log('Warning:', err.message);
            } else {
                reject(err);
            }
        });

        archive.on('error', err => reject(err));

        archive.pipe(output);

        const files = [
            path.join(__dirname, '../reseller.json'),
            path.join(__dirname, '../partner.json'),
            path.join(__dirname, '../users.json'),
            path.join(__dirname, '../index.js'),
            path.join(__dirname, '../package.json')
        ];

        files.forEach(file => {
            if (fs.existsSync(file)) {
                archive.file(file, { name: path.basename(file) });
            } else {
                console.log('File tidak ditemukan:', file);
            }
        });
       
        const functionDir = path.join(__dirname, '../function');

        if (fs.existsSync(functionDir)) {
            archive.directory(functionDir, 'function');
        } else {
            console.log('Folder function tidak ditemukan');
        }       
        
        archive.finalize();
    });
}            

function runtimePanel(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    return `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
}  

module.exports = {
    loadUsers,
    saveUsers,
    loadJSON, 
    saveJSON, 
    bypasscf,
    verifyEmail,
    activateLicense,
    extractOobCode, 
    createBackup, 
    runtimePanel
}; 