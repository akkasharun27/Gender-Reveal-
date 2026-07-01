function getDatabaseConnectionString(connectionString) {
  if (!connectionString || typeof connectionString !== 'string') return connectionString;

  try {
    const url = new URL(connectionString);
    const params = url.searchParams;
    const sslMode = params.get('sslmode');

    if (sslMode === 'prefer' || sslMode === 'require' || sslMode === 'verify-ca') {
      params.set('sslmode', 'verify-full');
      url.search = params.toString();
      return url.toString();
    }
  } catch {
    // fall back to simple replacements for non-URL strings
    return connectionString
      .replace(/[?&]sslmode=prefer([&$])/g, '?sslmode=verify-full$1')
      .replace(/[?&]sslmode=require([&$])/g, '?sslmode=verify-full$1')
      .replace(/[?&]sslmode=verify-ca([&$])/g, '?sslmode=verify-full$1');
  }

  return connectionString;
}

module.exports = { getDatabaseConnectionString };
