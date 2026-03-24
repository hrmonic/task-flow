SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = DATABASE() AND table_name = 'boards' AND column_name = 'job_key') = 0,
  'ALTER TABLE boards ADD COLUMN job_key VARCHAR(80) NULL AFTER description',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = DATABASE() AND table_name = 'boards' AND column_name = 'rubric_key') = 0,
  'ALTER TABLE boards ADD COLUMN rubric_key VARCHAR(80) NULL AFTER job_key',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = DATABASE() AND table_name = 'boards' AND column_name = 'icon_key') = 0,
  'ALTER TABLE boards ADD COLUMN icon_key VARCHAR(120) NULL AFTER rubric_key',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

