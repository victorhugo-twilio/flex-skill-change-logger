**Technical Document** — Flex Skill Change Logger

**Overview**

The **Flex Skill Change Logger** is a sample Twilio Flex plugin that monitors changes to agent (worker) skills and sends these changes to a backend.
Its goal is to maintain a centralized log of all changes made via the Flex UI.

**Plugin Logic**

1. Monitored Event

The plugin listens for the workerAttributesUpdated event from the Flex Manager to capture changes to the logged-in worker’s attributes.

2. Previous State Storage

On initialization, the plugin stores a snapshot of the worker’s current attributes.
This allows comparison between the old and new state on every update.

3. Difference Calculation (Diff)

The plugin extracts the skill list from the routing.skills attribute.
These lists are converted into Sets and compared to identify which skills were added and which were removed.

4. Sending Data to the Backend

On every change, the plugin sends a POST request to the backend at /api/log-skill-change.
The default payload contains:

{
"workerSid": "WKxxxx",
"changedBy": "user",
"newAttributes": {},
"addedSkills": ["new-skill"],
"removedSkills": ["removed-skill"],
"source": "flex-ui",
"timestamp": "2025-08-07T20:43:52.160Z"
}

Payload Extensibility: The plugin is designed to allow adding new parameters easily, for example:

ipAddress of the user making the change
browserInfo with browser details
sessionId for event correlation
customNotes for additional comments

**Backend Logic**

1. Data Reception

The backend exposes a POST /api/log-skill-change endpoint.
It receives the JSON payload sent by the plugin.

2. Logging and Storage

Data can be stored in a database (e.g., PostgreSQL, MongoDB) or log files.
Stored information includes the timestamp, workerSid, changedBy, added/removed skills, and any extra parameters defined in the payload.

3. Subsequent Use

Enables auditing and tracking of changes for security, compliance, or operational optimization.

Can generate custom reports filtered by extra parameters.

**Reasons for This Architecture**

Decoupling: The Flex Plugin does not store data locally; it only collects and sends it to the backend, simplifying maintenance and scalability.
Security: The backend centralizes and controls access to audit data.
Extensibility: Diff calculation and log sending are isolated, allowing validation or integrations (e.g., Slack, email) to be added in the backend without changing the plugin.
Performance: Diff calculation happens locally on the client to minimize transmitted data and reduce backend load.

Flexibility: The design allows adding new payload parameters without changing the core monitoring logic.
