CREATE TABLE IF NOT EXISTS columns (
  id CHAR(36) PRIMARY KEY,
  board_id CHAR(36) NOT NULL,
  name VARCHAR(120) NOT NULL,
  position INT NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#64748b',
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_columns_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_columns_board_position ON columns(board_id, position);
