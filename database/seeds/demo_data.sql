INSERT INTO users (id, name, email, password_hash, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo User', 'demo@taskflow.local', '$argon2id$v=19$m=65536,t=4,p=1$dummy$dummy', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO boards (id, user_id, name, description, created_at, updated_at)
VALUES ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Demo Board', 'Demo Kanban board', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO columns (id, board_id, name, position, color, created_at)
VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Todo', 1, '#64748b', NOW()),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'In Progress', 2, '#3b82f6', NOW()),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Done', 3, '#22c55e', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO tasks (id, column_id, title, description, priority, position, due_date, created_at, updated_at)
VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Design API', 'Define endpoints', 'high', 1, NULL, NOW(), NOW()),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Build UI', 'Create kanban columns', 'medium', 1, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);
