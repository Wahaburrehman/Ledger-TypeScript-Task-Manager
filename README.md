Ledger — TypeScript Task Manager
Ledger is a lightweight task manager built with TypeScript, HTML, and CSS. It includes 10 starter tasks that demonstrate core TypeScript concepts.
Features
- Add new tasks with a title, note, tag, and priority
- Mark tasks as complete or reopen them
- Delete tasks
- Filter tasks by All, Open, or Done
- Search tasks by title, note, or tag
- View task totals and completion progress
- Switch between light and dark themes
- Save tasks in browser localStorage
- Explore example code for 10 TypeScript topics
Built With
- TypeScript
- HTML5
- CSS3
- npm
- Browser localStorage
Getting Started
Prerequisites
Install Node.js LTS (npm is included). You can check the installation with:
node --version
npm --version
Install and Build
1. Open a terminal in the project folder (the folder containing package.json).
2. Install the development dependency:
   npm install
3. Compile TypeScript into JavaScript:
   npm run build
4. Open index.html in your browser.
The build command compiles src/main.ts into dist/main.js, which is loaded by index.html.
Project Structure
ledger/
├── src/
│   └── main.ts       # TypeScript application source
├── dist/
│   └── main.js       # Compiled JavaScript
├── index.html        # App markup
├── style.css         # App styling and themes
├── package.json      # npm scripts and dependencies
├── tsconfig.json     # TypeScript compiler configuration
└── .gitignore        # Git ignore rules
Available Scripts
Command	Description
npm install	Install project dependencies
npm run build	Compile TypeScript into dist/main.js
npm run watch	Recompile automatically when TypeScript files change


Data Storage
Tasks are saved in the browser's localStorage on the current browser and device. They are not automatically synced across browsers or devices. Use the app's reset control to restore the 10 starter tasks.
TypeScript Topics Demonstrated
1. Basic types
2. Interfaces and type aliases
3. Union and intersection types
4. Enums and literal types
5. Functions and overloads
6. Classes and access modifiers
7. Generics
8. Utility types
9. Modules
10. Mapped and conditional types, and type guards
Notes
- This is a client-side project; it does not require a backend or database server.
- The Google Fonts stylesheet uses an internet connection; fallback fonts are defined in the CSS.
- node_modules/ is excluded from Git by .gitignore.
