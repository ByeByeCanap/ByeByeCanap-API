function CheckBody(body, requiredFields) {
  for (let field of requiredFields) {
    if (!body[field] || body[field].trim() === "") {
      return false;
    }
  }
  return true;
}

module.exports = { CheckBody };
