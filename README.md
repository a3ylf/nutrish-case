# Examine.com Live Data API: Supplement Information Extraction
Overview

This API enables dynamic retrieval of detailed supplement data from Examine.com, offering optimized web scraping and error-handling mechanisms for seamless integration and deployment.
Key Features

## 1. Data Extraction

Retrieve in-depth information like benefits, dosage, and drawbacks.
Automatically suggest alternatives when the queried supplement isn’t found.

## 2. Optimized Web Scraping

Built with Puppeteer, employing request interception to block irrelevant resources and improve efficiency.
Summarizes extracted data for concise and user-friendly output.

## 3. Intelligent Query Handling

Provides helpful suggestions for similar supplements if no exact match is found.
Ensures clean, readable summaries of extracted data.

## 4. Deployment Simplicity

Fully containerized with Docker for straightforward deployment.
Includes a Postman workspace for effortless API testing.

Getting Started with Docker
Step 1: Clone the Repository

git clone https://github.com/a3ylf/nutrish-case.git .

Step 2: Build and Run the Docker Container
````
docker-compose up --build
````

Alternatively, use:
````
npm run docker
````
Step 3: Access the Application

Once running, access the API at:

http://localhost:1212

API Documentation
Fetch Supplement Data

Endpoint: GET /fetch/{type}/{product}
Description: Retrieves comprehensive information about a specific topic from Examine.com. If no direct match is found, alternative suggestions with links to related pages are provided.

Parameters:

type (required): category in which the product falls into (e.g., supplements)
product (required): Name of the product(e.g., creatine).

Example Request:

GET http://localhost:1212/fetch/supplements/creatine

Health Check

Endpoint: GET /status
Description: Verifies if the API is operational.

# Technical Details
## Web Scraping with Puppeteer

Dynamically fetches content from Examine.com by waiting for the DOM to fully load.
Optimized through request interception, blocking unnecessary resources like images, fonts, and advertisements.


## Error Management

Handles missing data or invalid inputs with informative error messages.

## Deployment Readiness

Dockerized for portability, ensuring fast and consistent deployment.

## Challenges and Solutions
1. Scraping
   My first approach was to use Axios for web scraping, which is my go-to for this kind of problem, but it was denied by the examine.com bot protection, the solution was to use puppeteer instead, which acts as an user.

    Handled Examine.com’s dynamically loaded content using Puppeteer’s waitUntil: 'domcontentloaded' option to extract fully loaded data.

3. Performance Optimization

    Reduced scraping times by blocking unnecessary such as images or ads during a puppeteer search. By doing this, performance during searchs were drastically better than before.

4. Redundancy in Data

   filters most of the useless data by it's size, by understanding the data, I defined that the most valuable data was within a length range,
    with that I was able to retrieve most of the relevant data and avoid as much useless data as possible.


Technologies Used

Backend: Node.js with Puppeteer for web scraping.
Containerization: Docker for easy deployment.
Testing: Postman workspace for API validation.
Web Optimization: Request interception for faster scraping.

### Currently hosted at render

https://nutrish-case-1.onrender.com/

example use cases

https://nutrish-case-1.onrender.com/fetch/supplements/creatine

https://nutrish-case-1.onrender.com/fetch/categories/sleep

https://nutrish-case-1.onrender.com/fetch/conditions/insomnia
