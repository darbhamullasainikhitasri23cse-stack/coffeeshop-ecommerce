const http = require('http'); 
const mongoose = require('mongoose');
const Contact = require('./models/contact');
const { parse } = require('url');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/contactformDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected to contactformDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Create HTTP Server
const server = http.createServer((req, res) => {
  // 🔧 Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🛑 Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = parse(req.url, true);

  // Route to save contact (POST)
  if (req.method === 'POST' && parsedUrl.pathname === '/api/contact') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        console.log("📩 Raw Body:", body);
        const { name, email, message } = JSON.parse(body);
        console.log("📨 Parsed:", { name, email, message });

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        console.log("✅ Contact Saved:", newContact);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Contact saved successfully' }));
      } catch (err) {
        console.error("❌ Error Saving Contact:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error saving contact', error: err.message }));
      }
    });

  // Route to view saved contacts (GET)
  } else if (req.method === 'GET' && parsedUrl.pathname === '/api/contacts') {
    Contact.find()
      .then(contacts => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(contacts));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching contacts', error: err.message }));
      });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start Server
server.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});