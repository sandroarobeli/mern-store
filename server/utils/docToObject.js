// Functions cannot be passed directly to Client Components because they're not serializable.
// So we serialize it here because this is not fetch and doesn't have res.json() method
// e.g. Converts MongoDB object to jS object
function convertDocumentToObject(doc) {
  doc.id = doc.id.toString();
  doc.createdAt = doc.createdAt.toString();
  // doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

module.exports = convertDocumentToObject;
