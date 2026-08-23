# FRAMEX DIGITAL — Vercel Website

A 4-page, Vercel-ready portfolio website for FRAMEX DIGITAL.

## Pages
- `/` Home
- `/services` Services + pricing
- `/portfolio` Real video portfolio
- `/contact` WhatsApp booking

## Real embeds included
- YouTube: `https://www.youtube.com/embed/OkV1-Xjq5OA`
- Instagram Reel: `https://www.instagram.com/reel/DVvcuZ_E-3n/` rendered as a direct Instagram `/embed` iframe.

## Configuration
Public settings are read from Vercel Environment Variables through `/api/config`.
Copy `.env.example` values to Vercel Project Settings → Environment Variables.

## Local test
Use any static server for the frontend and a Vercel-compatible runtime for `/api/config`. On Vercel it works directly.

## Important
Instagram controls third-party embedding. The site uses the official direct Instagram embed endpoint and provides an "Open on Instagram" fallback button.
