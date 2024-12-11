function CheckBody(body, requiredFields, optionalFields = []) {
  // Vérification des champs obligatoires
  for (let field of requiredFields) {
    if (!body[field] || body[field].trim() === "") {
      return false;
    }
  } // Initialisation des champs optionnels

  for (let field of optionalFields) {
    if (!body[field]) {
      body[field] = Array.isArray(body[field]) ? [] : null;
    }
  }

  return true;
}

module.exports = { CheckBody };
