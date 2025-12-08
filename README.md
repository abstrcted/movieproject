# 🎬 Movie Dataset Frontend - Group 2

This repository hosts our **Front End** project for TCSS 460.  
This repository serves as the starting point for our Group Web API Swaps project.
It includes links to the Web APIs our group will use, initial design mockups, and documentation for the Alpha Sprint phase.

---

‼️**Admin Account for Our Movies App**  
Our Movies App includes one **Admin-level account** that has access to additional features within the frontend.  
Only this Admin user can:
- Create new Movies  
- Create new TV Shows  
- Delete Movies
  
**Admin Credentials:**  
- **Email:** jakita987@gmail.com  
- **Password:** Jakita2005!  
- **Username:** JakitaK  
- **User ID:** 8  
- **Plan:** Admin (Active)
This Admin account is the *only* account with elevated permissions in the Movies App.
Regular users do not have access to these features and are limited to searching, viewing, filtering and using the standard app functionality.

 ---
 
## 🌐 URL Links

## URL link to the Vercel-hosted web app
- **https://movieproject-liart.vercel.app/**

## 🔗 URL link to the hosted Web API Used by Our Group
- **https://tcss460-group5-credentials-api.onrender.com/api-docs/**

### **Data Web API**
Group 4 Movie API
- **https://tcss460-moviewebapi-t961.onrender.com/api-docs/**

Group 3 TV API
- **https://group3-datasetwebapi.onrender.com/api-docs/**

### **Credentials Web API**
Group 5
- **https://tcss460-group5-credentials-api.onrender.com/api-docs/**

---
## ALL Contributions

## 🚀 Alpha Sprint Contribution

During the Alpha Sprint, **Primitivo, Jakita, George, and Evan** worked collaboratively to develop API functionality and plan design ideas for the web app.

- **Primitivo Bambao** — Created all designs in **Figma**, including routes for:
  - Landing Page  
  - Registration & Login Flow  
  - Forgot Password  
  - My Account Info  
  - Dashboard  
  - Discover Page  
  - Discover Page (Search)  
  - Discover Page (Search with Pagination)  
  - Viewing Specific Movie  
  - Admin View for Viewing Specific Movie  

- **Jakita Kaur** — Collaborated in discussions on API functionality and UI design ideas, reviewed and provided input on Figma layouts.

- **Evan Tran** — Reviewed Figma designs and contributed ideas for improving the discover and movie detail pages, aligning them with API data output.

- **George Njane** — Participated in API discussions, reviewed Figma work, and provided feedback on design usability and movie data flow.

## Published Front End version Beta I Contributions 

### **Primitivo Bambao**  
Primitivo updated the Register and Login forms to fully match the 3rd-party Auth API requirements.  
He ensured that all client-side validation rules aligned with the server-side checks enforced by the external Credentials API.  
He also incorporated the required updates into `src/utils/authOptions.tsx` so the frontend can successfully register users through the external Auth API.

### **Jakita Kaur**  
Jakita built the **Change Password** page that becomes available after login.  
The page includes all backend-required fields, and all client-side validation rules match server expectations.  
This page does **not** connect to the 3rd-party API yet (as required), but the UI and validation logic are fully implemented.

### **Evan Tran**  
Evan created the **Single Movie View** and **Single TV Show View**, displaying complete mock-data information for each item.  
Both views include titles, metadata, and images, meeting the requirement for showing all provided movie/TV details once the user is logged in.

### **George Njane**  
George developed the **Movie + TV List View** using mock data.  
This page displays summary information and images, and allows users to navigate to Evan’s detailed pages.  
This meets the requirement for viewing lists and accessing the full details for each individual item.

## Published Front End version Beta II Contributions

### **Primitivo Bambao** 
Primitivo completed the full implementation of the Change Password feature.
For this sprint, he connected the entire Change Password workflow to the 3rd-party Credentials Auth API, ensuring successful requests, error-handling, and response validation.
He function-tested the UI, cleaned the styling for improved UX, and helped verify that user authentication routes correctly integrate with the external API.

### **Jakita Kaur**  
Jakita fixed all major bugs from our own web api. For this sprint, she designed the full UI/UX for the Delete Movie and Delete Show feature.
This requirement was design-only (not implemented), so she focused on user flow, confirmation modal styling, and accessibility.
She also updated and organized the project README.md for Beta II, ensuring all sprint requirements, contributions, and meeting logs are documented properly.

### **Evan Tran**  
Evan implemented all views related to searching Movies and TV Shows using the live data returned by the 3rd-party Movie & TV APIs.
He connected the search bar + filters directly to the real endpoints and used our List component from last sprint to display results.
He also built and finalized the pages for: Viewing Movie Lists, Viewing TV Show Lists, Viewing a single Movie, Viewing a single TV Show
He function-tested all UI, improved layouts, and ensured the pages respond properly to authentication and API data.

### **George Njane**  
George built the UI for the Create New Movie & Create New Show page.
He created the full form with all required fields (title, description, release date, genres, image requirements, etc.).
This page was not required to integrate with the real Web API this sprint, but he prepared the structure in case the team chooses to connect it in the future. 
George also designed and implemented our team’s major creative feature: the Watchlist.
This included UI/UX planning, the add/remove interactions, and state updates to support a personalized list for logged-in users.

## Published Front End Production Contributions

### **Primitivo Bambao** 
Worked on the full verification flow for our app and reconnected Group 4’s updated Render deployment link so the Movie API routes function correctly in production. Ensured authentication and data requests were fully integrated and stable.

### **Jakita Kaur**  
Fixed multiple bugs across the application and resolved inconsistencies within routing, state handling, and UI behavior. Identified issues where components behaved differently between development and production, corrected them, and ensured a clean and consistent final UI.

### **Evan Tran**  
Fixed the pagination issue where the app only returned 200 results instead of all available results from the API. Updated the logic to properly load all Movie and TV Show results from the 3rd-party APIs.

### **George Njane**  
Reviewed the final deployed version, checked all core features, and ensured everything matched the production sprint requirements.


---

### ALL Meetings

**Primary Form of Communication:**  
All team members used **Discord** for calls and messages throughout the Alpha Sprint to share updates, discuss functionality, and review Figma designs.

**Summary:**  
- Discussed and aligned on API endpoints and their structure.  
- Reviewed design ideas and finalized Figma pages.  
- Collaboratively reviewed data presentation and user flows for all pages.

### Published Front End version Beta I Meetings 
## 📌 **Meeting 1 — November 11**
- **Time:** 8:30 PM – 9:20 PM  
- **Location:** Discord Call  
- **Attendance:** Full team (Primitivo, Jakita, Evan, George)  
- **Summary:**  
  Assigned sprint tasks, clarified Auth API connection requirements, and reviewed mock-data page deliverables.

## 📌 **Meeting 2 — November 14**
- **Time:** 7:12 PM – 7:45 PM  
- **Location:** Discord Call  
- **Attendance:** Primitivo + Jakita  
- **Summary:**  
  Reviewed Auth API progress, synced updates to validation rules, and troubleshot adjustments in `authOptions.tsx`.


## 📌 **Meeting 3 — November 16 (Due Date)**
- **Time:** 9:25 AM – 10:00 AM  
- **Location:** Discord Call  
- **Attendance:** Full team  
- **Summary:**  
  Final sprint review, last-minute fixes, validated all mock-data views, and ensured successful deployment on Vercel as required.

### Published Front End version Beta II Meetings
📌 **Meeting — November 20**
- **Time:** 8:10 PM – 8:52 PM  
- **Location:** Discord Call  
- **Attendance:** Full team  
- **Summary:**  
  We discussed our time constraints due to Thanksgiving break, planned deadlines for each task, and divided all sprint work. We also confirmed the
  integration order for connecting the 3rd-party APIs.

📌 **Meeting — November 25**
- **Time:** 6:30 PM – 7:15 PM  
- **Location:** Discord Call  
- **Attendance:** Jakita, Primitivo, Evan  
- **Summary:**  
  Reviewed progress on all API-connected features, checked routing and UI consistency, and discussed what remaining work was needed to complete the sprint.

📌 **Meeting — November 30**
- **Time:** 10:20 AM – 10:45 AM  
- **Location:** Discord Call  
- **Attendance:** Full team  
- **Summary:**  
  Final sprint wrap-up, verified all Beta II requirements were completed, tested all major pages, finalized the Watchlist feature, and
  updated the README before submission.


### Published Front End Production Meetings
📌 **Meeting — December 3**
- **Time:** 10:00 PM – 10:37 PM  
- **Location:** Discord Call  
- **Attendance:** Full team  
- **Summary:**  
  Catch-up meeting to review overall progress and identify what still needed to be finalized before deployment. We aligned on priorities for the final sprint tasks.

📌 **Meeting — December 5**
- **Time:** Evening discussion  
- **Location:** Discord Call  
- **Attendance:** Full team  
- **Summary:**  
  Updated each other on remaining tasks, discussed what was not working, and coordinated fixes for verification, pagination, and UI inconsistencies before the final submission.

📌 **Meeting — December 7**
- **Time:** 10:10 AM – 10:40 AM  
- **Location:** Discord Call  
- **Attendance:** Full team  
- **Summary:**  
  Final meeting to wrap up the sprint. We tested the Vercel deployment, confirmed all features worked properly, checked API connections, and ensured everything met the Production Sprint requirements.

---

## Sprint Comments
- None:)

