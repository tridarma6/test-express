exports.up = (pgm) => {
  pgm.createTable('refresh_tokens', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    token: { type: 'text', notNull: true, unique: true },
    expires_at: { type: 'timestamp with time zone', notNull: true },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('NOW()') }
  });

  pgm.createIndex('refresh_tokens', 'token');
  pgm.createIndex('refresh_tokens', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('refresh_tokens');
};