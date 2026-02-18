Timesheet Tracker

A full-stack Timesheet Management System built using the MERN stack. The application allows administrators and employees to manage timesheets efficiently with role-based authentication and authorization.
Prerequisites
----------------------------------------------------------------------------------------------------------------------------------
Before setting up the project, ensure you have:

1.Node.js (v18 or later recommended)
2.npm
3.Environment Variables
----------------------------------------------------------------------------------------------------------------------------------

Create a .env file inside the backend/ folder.

1.PORT=5000
2.MONGO_URI="mongodb+srv://fahad:fahad1530@timesheet-tracker.kfp50a6.mongodb.net/?appName=timesheet-tracker
3.JWT_SECRET=supersecretkey

put all these in .env file

Installation Steps:
1. Install Backend Dependencies
From the root directory of the project, run:
    * npm install


2. Install Frontend Dependencies 
Navigate to the frontend folder:cd frontend
    * cd frontend
    * npm install


3. Run the Application

You must run both backend and frontend servers.

Start Backend (from root folder):
    * npm run dev


Start Frontend (from frontend folder):  
    * npm run dev


For ADMIN login use credential:
admin@gmail.com
password:Abcd12345*