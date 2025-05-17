# 🗂️ Task Management Board

A collaborative web-based project management platform where users can manage projects and tasks visually using a task board. Ideal for individuals and teams who want a simple and effective way to stay organized and track progress.

---

## 📌 Features

- 🔐 **User Authentication**  
  - Register and Login functionality

- 📁 **Project Management**  
  - Create projects with a title and description  
  - View all your projects in one place

- ✅ **Task Management**
  - Add tasks to specific projects with:
    - Title & description
    - Priority levels: **Low**, **Medium**, **High**
    - Due dates
  - Move tasks between default statuses:
    - **To Do**
    - **In Progress**
    - **Completed**
  - Tasks are added to **To Do** by default

---

## 🛠️ Tech Stack - MERN

---

# API Documentation

# User API

1. Register User
   
Endpoint: POST /user/register

Description: Create a new user account.

Request Body:

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Response:

{
  "success": true,
  "message": "User registered successfully",
  
  "user": {
    "_id": "userId",
    "name": "User Name",
    "email": "user@example.com"
  }
}

2. Login User
   
Endpoint: POST /user/login

Description: Authenticate user and receive a JWT token.

Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}

Response:

{
  "success": true,
  "token": "<JWT token>"
}

# Project API

1. Create Project
   
Endpoint: POST /project/create

Description: Create a new project.

Request Body:

{
  "title": "Project Title",
  "description": "Project description",
  "members": ["userId1", "userId2"]  // optional
}

Response:

{
  "success": true,
  "message": "Project created successfully",
  
  "project": {
  
    "_id": "projectId",
    "title": "Project Title",
    "description": "Project description",
    "status": "To Do",
    "owner": "ownerUserId",
    "members": ["ownerUserId", "userId1", "userId2"],
    "tasks": []
    
  }
}

2. Add Member to Project
   
Endpoint: POST /project/addMemberToProject/:projectId

Description: Add a member to a project (owner only).

Request Body:

{
  "memberId": "userIdToAdd"
}

3. Get Projects
   
Endpoint: GET /project/getProjects

Description: Get projects where the user is owner or member.

5. Get Project by ID

Endpoint: GET /project/getProject/:projectId

Description: Get project details by ID (owner or member only).

6. Update Project

Endpoint: PATCH /project/updateProject/:projectId

Description: Update project details (owner only).

7. Delete Project

Endpoint: DELETE /project/deleteProject/:projectId

Description: Delete project and related data (owner only).

# Task API

1. Create Task

Endpoint: POST /task/create

Description: Create a task linked to a project.

Request Body:

{
  "title": "Task Title",
  "description": "Task details",
  "projectId": "projectId",
  "assignee": "userId",
  "status": "To Do"
}

2. Get Tasks by Project

Endpoint: GET /task/getTasks/:projectId

Description: Get all tasks for a specific project.

3. Update Task

Endpoint: PATCH /task/updateTask/:taskId

Description: Update task details.

4. Delete Task
   
Endpoint: DELETE /task/deleteTask/:taskId

Description: Delete a specific task.


# How project looks like

![image](https://github.com/user-attachments/assets/8d155177-457b-4fd9-8139-8d88c88fd269)

![image](https://github.com/user-attachments/assets/3ae3056f-1e2a-4f54-8ba7-92570bc5e8da)

![image](https://github.com/user-attachments/assets/5c0f3f05-bd99-45c2-a278-1c7fb0d8f0c4)

![image](https://github.com/user-attachments/assets/b635c7b2-3654-400f-b414-f86a36fd9e89)

![image](https://github.com/user-attachments/assets/a63e3e64-48ce-469e-a62b-be35a2d76596)

![image](https://github.com/user-attachments/assets/b82ac4e7-6618-4cc5-b0a2-8a11b7bf3943)

![image](https://github.com/user-attachments/assets/4e4b20b6-9ec6-4fcb-97eb-89741fa6d9a4)














