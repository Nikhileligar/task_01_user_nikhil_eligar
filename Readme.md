1> connection strinng

"mongodb+srv://newUser:newUser@cluster01.swn9b4m.mongodb.net/"


# User Signup API

This project implements a user signup API with features such as image upload, SMS OTP verification, and email notifications.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)

## dependencies

"body-parser": "^1.20.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "fast-two-sms": "^3.0.0",
    "jsonwebtoken": "^9.0.2",
    "mongod": "^2.0.0",
    "mongodb": "^6.3.0",
    "mongoose": "^8.0.3",
    "multer"
    "nodemailer"
    "nodemon"

## Introduction

The User Signup API is designed to provide a secure and efficient way for users to sign up with additional features like image upload, SMS OTP verification, and email notifications.

## Features

- User registration with name, email, password, and phone number
- Image upload for user profile
<!-- - SMS OTP verification for added security -->
- Email notifications upon successful signup
- admin can signup & login secirly
- admin can only view records from db with role based validation control
## Getting Started

## API's
api/signUp
api/uploadFile
api/signIn
api/verify

api/admin/signUp
api/admin/signIn

/admin/getUsers
/admin/download/:fileName


To get started with the User Signup API, follow the instructions below.

## Installation

```bash
git clone https://github.com/Nikhileligar/task_01_user_nikhil_eligar.git
cd user-signup-api
npm install
#   t a s k _ 0 1 _ u s e r _ n i k h i l _ e l i g a r 
 
 