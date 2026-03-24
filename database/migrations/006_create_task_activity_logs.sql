CREATE TABLE IF NOT EXISTS task_activity_logs (
  id CHAR(36) PRIMARY KEY,
  board_id CHAR(36) NOT NULL,
  task_id CHAR(36) NOT NULL,
  actor_user_id CHAR(36) NOT NULL,
  action VARCHAR(32) NOT NULL,
  details TEXT NULL,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_task_activity_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_activity_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_activity_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_task_activity_board_created ON task_activity_logs(board_id, created_at DESC);
