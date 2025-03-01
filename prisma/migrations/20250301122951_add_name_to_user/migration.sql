-- AddForeignKey
ALTER TABLE `EmployeeDetails` ADD CONSTRAINT `EmployeeDetails_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
