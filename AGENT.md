# 🤖 AI Agent Instructions — file-to-md

## 📌 Project Overview

This is a modern full-stack web application built with:

- Next.js (App Router)
- React 19
- TypeScript
- ShadCN (UI components)
- Zod (validation)

The goal of this project is to build a scalable, production-grade SaaS application.

---

## ⚙️ Core Principles

### 1. Type Safety First

- Always use strict TypeScript
- Avoid `any`
- Prefer inferred types over manual typing when possible

### 2. Server-first Architecture

- Prefer server components over client components
- Only use `"use client"` when absolutely necessary
- Keep logic on the server whenever possible

### 3. Clean Code

- Small, reusable functions
- Descriptive variable names
- No dead code or commented-out blocks

### 4. Folder Structure

- Follow feature-based structure when possible
- Keep components close to where they are used
- Avoid deeply nested folders

---

## 🧩 Coding Standards

### General

- Use ES modules
- Use async/await (no `.then`)
- Prefer arrow functions

### React

- Functional components only
- Use hooks properly (no conditional hooks)
- Keep components small and focused

### Styling

- Use ShadCN components
- Avoid inline styles unless necessary

---

## 🔐 Environment Variables

- Never hardcode secrets
- Always use `process.env`
- Validate env variables using Zod
- Required env variables must be listed in `.env.example`

---

## 🧪 Validation

- Use Zod for all validation:
  - API inputs
  - Forms
  - Environment variables

---

## 🚀 Performance

- Avoid unnecessary re-renders
- Use dynamic imports when needed
- Optimize database queries

---

## 🛑 What NOT to do

- Do not introduce new libraries without justification
- Do not duplicate logic
- Do not bypass validation
- Do not use `console.log` in production code
- Do not create large monolithic components

---

## ✅ When Adding Features

Always:

1. Define types first
2. Add validation (Zod)
3. Implement backend logic
4. Connect frontend
5. Handle errors properly

---

## 🧠 Decision Guidelines

When unsure:

- Choose simplicity over cleverness
- Choose readability over micro-optimizations
- Follow existing patterns in the codebase

---

## 🧾 Output Expectations (IMPORTANT)

When generating code:

- Provide complete, working code
- Do not omit imports
- Do not leave TODOs unless explicitly asked
- Ensure code compiles

---

## 📌 Notes for AI Agent

- This is a production-oriented project
- Code quality matters more than speed
- Be consistent with existing architecture
- If something is unclear, make a reasonable assumption and proceed

---
