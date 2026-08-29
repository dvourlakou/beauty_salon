# 💅Beauty Salon Management System


Το συγκεκριμένο project αποτελεί ένα σύστημα διαχείρισης
ενός κέντρου ομορφιάς. Οι πελάτες έχουν τη δυνατότητα να 
επιλέγουν την υπηρεσία που επιθυμούν κλείνοντας το 
αντίστοιχο ραντεβού και ο διαχειριστής είναι σε θέση να
διαχειρίζεται υπηρεσίες, αισθητικούς και ραντεβού έχοντας
πλήρη εικόνα της λειτουργίας του κέντρου.

 ## 📌 Βασικές Λειτουργίες

### Για τον ΠΕΛΑΤΗ : 

- 🔐 Εγγραφή / Σύνδεση με JWT authentication
- 💆 Προβολή υπηρεσιών (περιποίηση νυχιών, αποτρίχωση και μασάζ)
- 📅 Κλείσιμο ραντεβού με δυνατότητα επιλογής ημερομηνίας, ώρας και αισθητικού
- ☑️ Επιβεβαίωση ραντεβού με λεπτομέρειες αυτού
- 😊 Σελίδα ευχαριστιών για την επιλογή του κέντρου ομορφιάς


### Για τον ADMIN :

- 📊 Dashboard με στατιστικά για τα ραντεβού (σύνολο, σημερινά, εβδομαδιαία, εκκρεμή)
- 📝 Διαχείριση υπηρεσιών (προσθήκη, ενημέρωση, διαγραφή)
-  👩‍🦰 Διαχείριση αισθητικών (προσθήκη, ενημέρωση, διαγραφή)
- 📖 Προβολή εβδομαδιαίων ραντεβού


## 🛠️ ΤΕΧΝΟΛΟΓΙΕΣ

### Για το FRONTEND :

- React -- Ui Library
- TypeScript -- Type Sfety
- Vite -- Build Tool
- Tailwind CSS v4 -- Styling
- React Router v7 -- Navigation
- React Hook Form & Zod -- Form Validation
- Axios -- HTTP Client


### Για το BACKEND :

- Node.js -- Runtime
- Express.js -- Web Framework
- Sequelize -- ORM
- JWT --Authentication
- Bcrypt.js -- Password Hashing
- Swagger -- OpenAPI Documentation


### Για τη DATABASE :

- MySQL 8.0 -- Database
- Docker -- Container


## 🧰 ΔΟΜΗ PROJECT ( φάκελοι & αρχεία )

```text
beauty_salon/
|—backend/
 | ⊢ controllers/  # business logic #
 | ⊢ models/  # database models #
 | ⊢ routes/  # API endpoints #
 | ⊢ middleware/   # auth & role check #
 | ⊢ server.js   # entry point #
 | ∟ swagger.js   # swagger config #
|— docker/
 | ∟ docker-compose.yml  # MySQL container #
|— src/  # Frontend #
 | ⊢ api/   # API calls #
 | ⊢ features/  # auth, services, booking, admin #
 | ⊢ shared/  # components #
 | ∟ App.tx   # main app #
∟ README.md 

```

## ✨ ΕΓΚΑΤΑΣΤΑΣΗ & ΕΚΤΕΛΕΣΗ

### Προαπαιτούμενα

- Node.js
-  Docker Desktop
- Git

### 1. Clone του repository

git clone https://github.com/dvourlakou/beauty_salon  

cd beauty_salon  

### 2. Εκκίνηση της βάσης δεδομένων (Docker)  

cd docker  
docker-compose up -d 
docker ps (επιβεβαίωση τρεξίματος με port κ.τ.λ)
cd .. (επιστροφή στο root του project)  

### 3. Εκκίνηση του backend  

cd backend (μπαίνω στο backend)  
npm install  
npm run dev

### 4. Εκκίνηση του frontend  

cd .. ( επιστροφή στο root beauty_salon)  
npm install  
npm run dev

### 5. Πρόσβαση στα τμήματα της εφαρμογής  

- Frontend: http://localhost:5173  
- Backend API : http://localhost:5000
- Swagger UI : http://localhost:5000/api-docs

## 🌐 API ENDPOINTS (Swagger)

Η πλήρης τεκμηρίωση των API endpoints είναι διαθέσιμη μέσω Swagger UI:

- /api/auth/register   →  POST  → Εγγραφή νέου χρήστη  
- /api/auth/login  → POST  → Σύνδεση χρήστη
- /api/services/categories  → GET  → Λήψη κατηγοριών υπηρεσιών
- /api/appointments  → POST  → Δημιουργία ραντεβού
- /api/appointments/my  → GET  → Ραντεβού μου
- /api/admin/stats → GET  → Στατιστικά dashboard(admin)
- /api/admin/services → GET  → Διαχείριση υπηρεσιών(admin)
- /api/admin/employees  → GET  → Διαχείριση αισθητικών(admin)

## ⌛ TESTING 

### API TESTING 

- Χρησιμοποιήστε το Swagger UI για δοκιμή των endpoints
- Μπορεί επίσης να γίνει χρήση του HTTP Client που υπάρχει στο IDE Webstorm. 






