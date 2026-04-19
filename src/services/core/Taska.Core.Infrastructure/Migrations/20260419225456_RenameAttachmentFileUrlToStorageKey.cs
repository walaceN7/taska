using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Taska.Core.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameAttachmentFileUrlToStorageKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "file_url",
                table: "attachments",
                newName: "storage_key");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "storage_key",
                table: "attachments",
                newName: "file_url");
        }
    }
}
