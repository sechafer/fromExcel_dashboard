# Excel to Dashboard Converter

## Overview

This project was developed to address a real business need at Sky, where the marketing department required a simple yet effective way to visualize SalesForce Marketing Cloud data without requiring Power BI licenses. The application provides a streamlined solution for converting Excel reports into interactive dashboards, making data visualization accessible and efficient.

[Live Demo](https://fromexcel-dashboard.onrender.com/)

[Video Demo](https://youtu.be/dV9bPVBVF0Q)

The dashboard provides essential email marketing metrics including:
- Open rates
- Bounce rates
- Click-through rates
- Unsubscribe rates
- Visual representations of delivery status
- Engagement metrics
- Bounce type analysis

## Features

- **Simple File Upload**: Easy-to-use interface for uploading Excel files
- **Automatic Data Processing**: Handles and processes up to 20,000 records efficiently
- **Interactive Dashboard**: Dynamic visualization of key marketing metrics
- **Multiple Campaign Views**: Tab system for viewing different email campaigns
- **Responsive Design**: Works across different screen sizes
- **Real-time Calculations**: Instant metric calculations and chart generation

## Development Environment

### Technologies Used
- **Backend**:
  - Node.js
  - Express.js
  - XLSX library for Excel file processing
  - Multer for file upload handling

- **Frontend**:
  - HTML5
  - JavaScript (ES6+)
  - Chart.js for data visualization
  - Tailwind CSS for styling

### Version Information
```json
{
  "dependencies": {
    "axios": "^1.7.7",
    "express": "^4.21.1",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5"
  }
}
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Access the application at `http://localhost:3000`

## Usage

1. Download the [sample Excel file](https://docs.google.com/spreadsheets/d/19rb8n3YAv5v1-oJMSWLVUK815kOZwRWad70aga6_6dk/edit?usp=sharing)
2. Visit the [dashboard website](https://fromexcel-dashboard.onrender.com/)
3. Upload your Excel file
4. View the automatically generated dashboard with your email marketing metrics

## Project Demo

Watch our [Video Demonstration](https://youtu.be/dV9bPVBVF0Q) to see the dashboard in action and learn how to:
- Upload Excel files
- Navigate the dashboard interface
- Interpret the visualizations
- Switch between different campaign views
- Understand the metrics calculations

## Key Components

- `server.js`: Handles file upload and data processing
- `script.js`: Manages dashboard generation and chart creation
- `index.html`: Provides the user interface structure

## Features in Detail

### Data Processing
- Handles large datasets (up to 20,000 records)
- Automatic date-based aggregation for large datasets
- Calculates key email marketing metrics

### Visualization
- Interactive charts using Chart.js
- Multiple chart types:
  - Donut charts for delivery status and bounce types
  - Bar charts for engagement metrics
- Real-time metric updates

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [XLSX Documentation](https://docs.sheetjs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)

## Contributing

Feel free to fork this project and submit pull requests for any improvements you'd like to add.

## License

ISC License
