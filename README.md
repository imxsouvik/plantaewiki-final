Plantae Wiki 

Plant Intelligence for a Greener Future

 Overview

Plantae AI is a full-stack, public plant intelligence platform developed for the Microsoft Imagine Cup Hackathon 2026. The platform allows users to identify plants, predict growth trends, detect plant diseases with cures, and explore a Wikipedia-style botanical encyclopedia — all through an intuitive, modern, and nature-aligned interface.

 Core Features

Plant Detection (Home Page)
Users can upload a plant image and get structured botanical metadata including:
common name, scientific name, species, varieties, and geographical origin, powered by Azure AI Vision inference deployed using Microsoft hackathon credits.

Growth Prediction
Hybrid prediction system where AI identifies the plant first, then backend-served ML regression logic forecasts:
height, leaf spread, survival %, timeline, and environmental compatibility (soil, humidity, season, sunlight).

Disease Detection
Users upload plant images and receive a detailed health report including:
disease name, biological cause, severity, cure steps, treatment process, prevention, and recovery conditions, processed using Azure AI Vision inference through backend handlers.

Plant Encyclopedia
A Wikipedia-like botanical knowledge hub exclusively for plants, powered by Supabase PostgreSQL, supporting:
search bar, filters, grid-based plant cards, individual plant detail pages, internal linking, and image support, scalable for future expansion via imports.

Chatbot Support
Floating chatbot popup placed at bottom-right, enabling public users to ask:
general plant queries or website guidance, without login, using local browser storage for temporary memory.

Dark/Light Mode
Global theme toggle integrated in the navbar for UI accessibility and flexibility.

 Tech Stack
Layer	Technology
Frontend	React + TypeScript + TailwindCSS
AI Inference	Azure AI Vision Service (deployed via Azure credits)
ML Hosting	Azure Machine Learning Real-Time Endpoint
Database	Supabase PostgreSQL
Chat Memory	Browser Local Storage (temporary, no auth)
Maps Support	Google Maps search for plant native region
Deployment UI	Hosted via GitHub or Vercel (AI hosted in Azure for proof)
 Architecture Highlights

Image uploaded from frontend UI

Sent to backend TypeScript handlers

Azure AI Vision analyzes the plant image

Azure ML endpoint runs regression model for growth forecasting

Logs and encyclopedia entries stored/retrieved using Supabase PostgreSQL

Chatbot answers public queries with lightweight local memory

System is modular, scalable, biologically correct, and hackathon-grade

 Deployment

Microsoft Azure services deployed using Hackathon credits:

✔ Azure AI Vision (Computer Vision) → Plant & Disease Detection

✔ Azure Machine Learning Endpoint → Growth Regression Model Hosting

Frontend UI hosted separately (allowed via GitHub/Vercel)

No external API keys used for core AI, keeping the system credit-safe.

 Team

Project Lead: Souvik Jana
Project Branding: Plantae Wiki
Built for: External users globally, public access, hackathon evaluation

 Future Enhancements

Expand encyclopedia to thousands of plants

Add plant care scheduling and reminders externally

Improve ML model accuracy

Enable multilingual plant summaries

Add voice support for chatbot queries

 Contact

For suggestions or queries, use the Contact form page or ask the floating chatbot on the website directly.

 Closing Statement

Plantae AI – Empowering plant knowledge, growth, and health using Microsoft Azure AI for a sustainable and inclusive greener future.

 About .env File
VITE_SUPABASE_PROJECT_ID=""
VITE_SUPABASE_PUBLISHABLE_KEY=""
VITE_SUPABASE_URL=""
VITE_GEMINI_API_KEY=
