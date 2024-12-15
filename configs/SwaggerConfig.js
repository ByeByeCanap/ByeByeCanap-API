const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bye Bye Canap 🛋️",
      version: "v1.0",
      description: `
      📱 **API Documentation for Bye Bye Canap**  
      
      Bienvenue sur la documentation de l'API de **Bye Bye Canap**, l'application mobile qui facilite les rencontres ! 👫🌟  
      
      Utilisez cette documentation pour explorer les différentes fonctionnalités disponibles et intégrer l'API facilement.  
      
      **Fonctionnalités principales :**  
      - 🔒 Authentification sécurisée via UID2  
      - 👤 Gestion des profils utilisateurs 
      - 🥳 Gestion de évènements
      - 📅 Disponibilité et préférences de rencontres  
      - 🎯 Suggestions personnalisées  

      *N'hésitez pas à explorer les différentes routes et tester les requêtes directement depuis cette page !* 🚀  
      `,
    },
    components: {
      securitySchemes: {
        uid2Auth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "UID2 token for API authentication 🔑",
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "Endpoints for managing user profiles 👤",
      },
      {
        name: "Events",
        description: "Endpoints for managing events 🥳",
      },
    ],
  },
  apis: ["./configs/docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
