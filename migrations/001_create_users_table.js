exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    role: { type: 'varchar(50)', notNull: true, default: 'user' },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('NOW()') }
  });

  pgm.addConstraint('users', 'users_role_check', 'CHECK (role IN (\'user\', \'admin\'))');
  pgm.createIndex('users', 'email');

  // Create function to update updated_at
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create trigger
  pgm.sql(`
    CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.sql('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;');
};