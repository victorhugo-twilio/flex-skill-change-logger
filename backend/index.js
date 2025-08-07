// backend/index.js
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

//const response = new Twilio.Response();
//response.appendHeader("Access-Control-Allow-Origin", "*");
//response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
//response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
//response.appendHeader("Content-Type", "application/json");

app.post('/api/log-skill-change', async (req, res) => {
    const { workerSid, changedBy, newAttributes, timestamp } = req.body;
    console.log('Recebido POST de alteração de skill');
    console.log('Payload:', req.body);
    console.log('[Skill Change]', {
        workerSid,
        changedBy,
        newAttributes,
        timestamp
    });

    res.send({ success: true });
});

app.listen(3000, () => {
    console.log('Logging server running on http://localhost:3000');
});
