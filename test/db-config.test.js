const test = require('node:test');
const assert = require('node:assert/strict');
const { getDatabaseConnectionString } = require('../lib/db-config');

test('rewrites deprecated sslmodes to verify-full', () => {
  const original = 'postgresql://user:pass@host.example.com/dbname?sslmode=require&channel_binding=require';
  assert.equal(
    getDatabaseConnectionString(original),
    'postgresql://user:pass@host.example.com/dbname?sslmode=verify-full&channel_binding=require'
  );
});

test('leaves already-explicit verify-full values unchanged', () => {
  const original = 'postgresql://user:pass@host.example.com/dbname?sslmode=verify-full';
  assert.equal(getDatabaseConnectionString(original), original);
});
