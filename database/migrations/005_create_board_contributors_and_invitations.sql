CREATE TABLE IF NOT EXISTS board_contributors (
  board_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role ENUM('owner', 'contributor') NOT NULL DEFAULT 'contributor',
  added_by CHAR(36) NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (board_id, user_id),
  CONSTRAINT fk_board_contributors_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  CONSTRAINT fk_board_contributors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_board_contributors_added_by FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_board_contributors_user ON board_contributors(user_id);

INSERT IGNORE INTO board_contributors (board_id, user_id, role, added_by, created_at)
SELECT b.id, b.user_id, 'owner', b.user_id, NOW()
FROM boards b;

CREATE TABLE IF NOT EXISTS board_invitations (
  id CHAR(36) PRIMARY KEY,
  board_id CHAR(36) NOT NULL,
  inviter_user_id CHAR(36) NOT NULL,
  invitee_user_id CHAR(36) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL,
  responded_at DATETIME NULL,
  CONSTRAINT fk_board_invitations_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  CONSTRAINT fk_board_invitations_inviter FOREIGN KEY (inviter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_board_invitations_invitee FOREIGN KEY (invitee_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_board_invitations_invitee_status ON board_invitations(invitee_user_id, status, created_at);
CREATE INDEX idx_board_invitations_board_status ON board_invitations(board_id, status);
