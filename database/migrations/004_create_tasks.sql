CREATE TABLE IF NOT EXISTS tasks (
  id CHAR(36) PRIMARY KEY,
  column_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  priority ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  position INT NOT NULL,
  due_date DATE NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  CONSTRAINT fk_tasks_column FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tasks_column_position_due ON tasks(column_id, position, due_date);
