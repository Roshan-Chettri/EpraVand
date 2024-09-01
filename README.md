EPRAVAND - An event management system

EPraVand is a user-friendly web-based platform designed for a seamless event management system. EPraVand is a web-application specially designed to facilitate efficient organization and coordination of events at the institution.

To run project on your Desktop/laptop follow below given steps:-

    1. Clone the Repository
        Open a terminal or command prompt.
        Navigate to the directory where you want to clone the project.
        Run the following command to clone the repository:

        git clone https://github.com/Roshan-Chettri/EpraVand.git

        Change into the project directory:

        cd EpraVand

    2. Install Backend Dependencies
        Navigate to the backend directory (if it exists, or assume it’s in the root directory):

        cd backend

        Install the Node.js dependencies:

        npm install

    3. Install Frontend Dependencies
        Navigate to the frontend directory (if applicable):

        cd ../frontend

        Install the Node.js dependencies:

        npm install

    4. Set Up the PostgreSQL Database
    Ensure that PostgreSQL is installed on your system. If not, you can download it from PostgreSQL's official website.
    Start the PostgreSQL service.
    Create a new PostgreSQL database:
    Import the provided SQL file into the newly created database

    6. Start the Backend Server
    Navigate to the backend directory:

    cd backend

    Start the backend server:

    nodemon index.js

    7. Start the Frontend Application
    Navigate to the frontend directory:

    cd ../frontend

    Start the frontend application:

    npm start

Note: All passwords are 111111
example username for:
coordinator - gaurav@gmail.com
admin - admin@ad
superadmin - superadmin@sa
