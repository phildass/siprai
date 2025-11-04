# SIPRAI - South India Press Release Distribution App

A comprehensive web application for managing and distributing press releases across South India regions (Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana).

## Features

- 📝 Submit press releases with detailed information
- 🗺️ Target specific South Indian regions or all regions
- 🏷️ Categorize releases (Business, Politics, Sports, Entertainment, Technology, Health, Education)
- 📊 View statistics and analytics
- 🔍 Filter and search press releases
- 📤 Distribute press releases to target regions
- 💾 In-memory data storage (easily extensible to database)

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: Jest with Supertest
- **API**: RESTful API design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/phildass/siprai.git
cd siprai
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Testing

Run the test suite:
```bash
npm test
```

## API Documentation

### Press Releases

#### Create Press Release
- **POST** `/api/press-releases`
- **Body**:
```json
{
  "title": "Press Release Title",
  "content": "Full content of the press release",
  "author": "Author Name",
  "region": "Tamil Nadu",
  "category": "Technology",
  "contactEmail": "contact@example.com",
  "contactPhone": "+91-9876543210"
}
```

#### Get All Press Releases
- **GET** `/api/press-releases`
- **Query Parameters**: `region`, `category`, `status`

#### Get Press Release by ID
- **GET** `/api/press-releases/:id`

#### Update Press Release
- **PUT** `/api/press-releases/:id`

#### Delete Press Release
- **DELETE** `/api/press-releases/:id`

#### Distribute Press Release
- **POST** `/api/press-releases/:id/distribute`

#### Get Statistics
- **GET** `/api/press-releases/stats/summary`

#### Health Check
- **GET** `/health`

## Regions Supported

- Tamil Nadu
- Kerala
- Karnataka
- Andhra Pradesh
- Telangana
- All South India

## Categories

- Business
- Politics
- Sports
- Entertainment
- Technology
- Health
- Education

## Project Structure

```
siprai/
├── __tests__/          # Test files
├── models/             # Data models and services
├── public/             # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── routes/             # API routes
├── server.js           # Main server file
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.