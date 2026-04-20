-- AlterTable
ALTER TABLE `notes`
  ADD COLUMN `entryType` VARCHAR(20) NOT NULL DEFAULT 'note' AFTER `noteDate`,
  ADD COLUMN `label` VARCHAR(100) NULL AFTER `entryType`,
  ADD COLUMN `color` VARCHAR(20) NULL AFTER `label`,
  ADD COLUMN `time` VARCHAR(10) NULL AFTER `color`,
  ADD COLUMN `isStarred` BOOLEAN NOT NULL DEFAULT false AFTER `time`,
  ADD COLUMN `location` VARCHAR(100) NOT NULL DEFAULT 'All Docs' AFTER `isStarred`;

-- CreateIndex
CREATE INDEX `notes_userId_entryType_idx` ON `notes`(`userId`, `entryType`);
