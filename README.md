# Getting Started
This guide explains how to clone the repository and run the Angular application locally.

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js and npm](https://nodejs.org/)
- [Angular CLI]()
- [Git](https://git-scm.com/)

### Clone the repository
Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/LangTowl/polynavigator.git
```

Inside of the repository, install the project dependencies:
```bash
npm install
```

Install application specific dependancies:
```bash
npm install -r requirements.txt
```

### Serve the application
Start the development server by running:
```bash
ng serve
```

### GitHub Pages Hosting
To host the application on GitHub pages, ensure that GitHub actions are enabled. Navigate to settings > pages, and select the branch you want to serve from. Inside of that branch, ensure that there is a /docs folder available.

In your IDE of choice, run the following command in the terminal

```bash
ng build --output-path docs --base-href /your-reposiotiry-name-here/
```

Ensure that the build folder is created inside of docs.

Note: this command will sometimes create a sub folder called browser. Place all files in browser into docs.

Once pushed, GitHub actions will automatically serve the application over HTTPS.
