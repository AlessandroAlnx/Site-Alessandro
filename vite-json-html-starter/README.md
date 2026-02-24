# vite-json-html-starter

## Project Overview
This project is a starter template for building web applications using Vite, HTML, and JSON. It provides a basic structure to help you get started with your development.

## Folder Structure
```
vite-json-html-starter
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── public
│   └── data
│       └── sample-public.json
└── src
    ├── main.js
    ├── app.html
    ├── data
    │   ├── sample.json
    │   └── config.json
    ├── pages
    │   ├── about.html
    │   └── demo.html
    ├── components
    │   ├── header.js
    │   └── footer.js
    └── styles
        └── main.css
```

## Getting Started

### Prerequisites
- Node.js (version 12 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd vite-json-html-starter
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Project
To start the development server, run:
```
npm run dev
```
This will launch the application in your default web browser.

### Building for Production
To build the project for production, run:
```
npm run build
```
The built files will be available in the `dist` directory.

### File Descriptions
- **index.html**: Main entry point for the application.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **vite.config.js**: Configuration settings for Vite.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **public/data/sample-public.json**: Sample public data accessible by the application.
- **src/main.js**: Main JavaScript file for application logic.
- **src/app.html**: Template for the main application view.
- **src/data/sample.json**: Sample data used within the application.
- **src/data/config.json**: Configuration settings for the application.
- **src/pages/about.html**: Represents the "About" page.
- **src/pages/demo.html**: Represents a demo page.
- **src/components/header.js**: Renders the header component.
- **src/components/footer.js**: Renders the footer component.
- **src/styles/main.css**: Styles for the application.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.